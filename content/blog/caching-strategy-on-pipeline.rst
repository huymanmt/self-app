Pipeline Caching Strategy: Scope Isolation, Fallback Keys, and Cache Invalidation
#################################################################################

:date: 2026-10-17 09:00
:tags: devops, cicd, caching, azure-devops, nodejs, npm, performance
:category: CI/CD
:slug: caching-strategy-on-pipeline
:author: Nguyen Huynh Huy Man
:summary: An engineering guide to pipeline caching in Azure DevOps: understanding cache scope and isolation, avoiding pull request cache shadowing with branch-aware fallback keys, and declarative cache invalidation with a practical npm example.

Introduction
============

Fetching and installing project dependencies - such as third-party packages (npm, pip, maven) or compilation outputs - on every fresh CI runner wastes network bandwidth and compute time. Pipeline caching helps by saving and restoring these assets across builds, significantly speeding up build times.

However, caching isn't just about saving an archive. Without knowing how the CI engine resolves scopes and fallback keys, pipelines often suffer from unexpected cache misses or restore outdated dependencies. 

This post covers how cache scopes and fallback keys actually resolve in Azure DevOps, using ``npm`` and ``node_modules`` as a practical example.

What is a Cache Scope and Its Isolation?
========================================

Before configuring cache keys or fallback keys, the first fundamental concept to understand is Cache Scope and how the CI engine enforces isolation.

In Azure DevOps, cache entries are not stored in a flat, global bucket. Instead, each cache entry is tied to a specific boundary. If you inspect the diagnostic logs of an Azure Pipeline running ``Cache@2``, you will find that the internal scope key looks like this:

.. code-block:: text

   259;f5c7a962-6082-42ca-ac3f-137df246978a;refs/heads/develop;78fa3cd1-67a1-4ad7-876c-fd5872ec6db5

This identifier is composed of four distinct segments separated by semicolons:

* Organization ID: ``259``
* Repository ID: ``f5c7a962-6082-42ca-ac3f-137df246978a``
* Git Branch/Ref: ``refs/heads/develop``
* Pipeline ID: ``78fa3cd1-67a1-4ad7-876c-fd5872ec6db5``

This structure enforces two critical isolation rules:

1. Pipeline Boundary: Cache restoration only works within the same pipeline. Even if two pipelines reside in the exact same repository and build the exact same branch, they cannot read or write each other's cache because their ``Pipeline_ID`` differs.
2. Scope-based Read Hierarchy: While a cache is saved to a specific branch scope, Azure DevOps allows the cache task to read across multiple scopes in a strictly defined order.

Read and Write Scope Matrix
===========================

The scopes that the task can read from and write to depend on whether the build is a regular CI/manual run or a Pull Request automation run:

1. CI, Manual, and Scheduled Runs
---------------------------------

For standard CI triggers on branches, manual runs, or scheduled builds, the task evaluates scopes in the following order:

.. code-block:: text

   Scope            Read    Write
   Source branch    Yes     Yes
   main branch      Yes     No
   master branch    Yes     No

The task first searches the current Source branch. If found, it restores from it. Newly created caches are saved directly to this Source branch. If missed, it falls back to reading from ``main``, and then ``master``. The current branch cannot overwrite the cache of ``main`` or ``master``.

2. Pull Request Runs
--------------------

For pull request runs, the engine evaluates scopes in this 5-tier order:

.. code-block:: text

   Scope                                              Read    Write
   Source branch                                      Yes     No
   Target branch                                      Yes     No
   Intermediate branch (such as refs/pull/1/merge)    Yes     Yes
   main branch                                        Yes     No
   master branch                                      Yes     No

Key points for PR runs:

* Read Order: The task looks for a cache in the Source branch first, then falls back to the Target branch, then the Intermediate branch (the PR merge ref), and finally ``main`` and ``master``.
* Write Isolation: Only the Intermediate branch (e.g., ``refs/pull/1/merge``) has Write permission. A PR build can never modify or overwrite the cache of the Target branch, the Source branch, or the ``main``/``master`` branches.

Scope Resolution Flow
---------------------

When the task starts restoring, it iterates through scopes and keys in this sequence:

.. code-block:: text

   [Start Cache Restore]
             │
             ▼
     Determine Scope Order:
     • CI / Manual Run: [1. Source] ──► [2. main] ──► [3. master]
     • PR Run:          [1. Source] ──► [2. Target] ──► [3. Intermediate] ──► [4. main] ──► [5. master]
             │
             ▼
   ┌──► Any remaining scopes to check? ──(No)──► [CACHE FULL MISS]
   │         │ (Yes)
   │         ▼
   │    Pick the next Scope in order
   │         │
   │         ├─► [Step 1] Check Exact Match with primary key?
   │         │        ├─► (Match found) ──► [CACHE EXACT HIT] ──► Stop searching!
   │         │        └─► (Not found)
   │         │
   │         └─► [Step 2] Check restoreKeys in order (Prefix Match)
   │                  ├─► Matches prefix? (Pick most recently created entry)
   │                  │        └─► (Found) ──► [CACHE PARTIAL HIT] ──► Stop searching!
   │                  └─► (No match for any prefix in this scope)
   │                           │
   └───────────────────────────┘

Configuring the Cache Task: path, key, and restoreKeys
=======================================================

With the scope rules clear, let us look at the actual configuration of the ``Cache@2`` task, using an ``npm`` and ``node_modules`` setup as a concrete example:

.. code-block:: yaml

   variables:
     NODE_MODULES_CACHE: $(System.DefaultWorkingDirectory)/node_modules

   steps:
   - task: Cache@2
     displayName: Cache node_modules
     inputs:
       key: 'npm | "$(Agent.OS)" | $(Build.SourceBranch) | package-lock.json'
       path: $(NODE_MODULES_CACHE)
       restoreKeys: | 
         npm | "$(Agent.OS)" | $(Build.SourceBranch)
         npm | "$(Agent.OS)"

Here is how each input functions and how ``key`` and ``restoreKeys`` work together:

1. path
-------

The ``path`` defines the directory to archive at the end of the build and extract at the beginning of the next run. In this example, it points to ``$(NODE_MODULES_CACHE)``.

2. key (Primary Target Key)
---------------------------

The ``key`` input defines the primary search target during restore, and serves as the exact identifier under which the cache is saved if the step creates a new archive:

* ``npm``: Namespace identifier for the tool.
* ``"$(Agent.OS)"``: Runner operating system (e.g., ``Linux``, ``Windows``), preventing binary incompatibilities across platforms.
* ``$(Build.SourceBranch)``: Git reference of the current branch or PR.
* ``package-lock.json``: Target file path whose content SHA-256 hash is dynamically computed by Azure DevOps.

Because ``package-lock.json`` is hashed, an exact match against the primary ``key`` succeeds as long as dependencies do not change. Whenever a package is added, updated, or removed in ``package-lock.json``, the hash changes, causing the primary key to miss.

3. restoreKeys (Fallback Keys)
------------------------------

When the primary ``key`` misses, ``restoreKeys`` provides an ordered list of prefix fallbacks:

* Restore Key 1 (``npm | "$(Agent.OS)" | $(Build.SourceBranch)``):  
  Omits the ``package-lock.json`` hash. The task searches for any cache entry created on the same OS and same branch, regardless of lockfile changes. This allows subsequent commits on the same branch to reuse previous installed dependencies as a baseline.
* Restore Key 2 (``npm | "$(Agent.OS)"``):  
  Omits both the ``package-lock.json`` hash and the branch name. This is the broadest fallback: it searches for any cache created on the same OS across upstream scopes (such as ``develop`` or ``main``). When a new feature branch runs for the first time with no prior cache, this fallback seeds it with the base cache from ``develop`` or ``main``.

How the Lookup Logic Executes
-----------------------------

When the cache task executes the restore phase:

1. Exact Match Check: It first queries for an entry strictly matching the full ``key``. If found, the search stops immediately (Exact Hit).
2. Prefix Match Check: If the primary key misses, it evaluates ``restoreKeys`` line-by-line from top to bottom. It looks for entries whose key starts with the declared prefix. If multiple entries match, the task selects the most recently created entry (Inexact Match).

Why We Include ``$(Build.SourceBranch)`` to Handle Pull Request Builds
-------------------------------------------------------------------

The inclusion of ``$(Build.SourceBranch)`` in both the ``key`` and the first ``restoreKeys`` line is intentional and crucial for Pull Request builds.

Recall the scope reading order for a PR run:

1. Source branch
2. Target branch (e.g., ``develop``)
3. Intermediate branch (the PR merge scope, e.g., ``refs/pull/1/merge``)

Consider what happens if we do not include ``$(Build.SourceBranch)``, using a naive configuration like:

.. code-block:: yaml

   key: 'npm | "$(Agent.OS)" | package-lock.json'
   restoreKeys: |
     npm | "$(Agent.OS)"

In this naive setup:

* Build 1 of the PR: The task misses on the Source branch, falls back to the Target branch (``develop``), matches the generic prefix ``npm | "$(Agent.OS)"``, and restores the base cache. At the end of Build 1, a brand-new cache containing the latest packages is written into Scope 3 (Intermediate branch / PR scope).
* Build 2 of the PR: You push another commit to the same PR. The task starts searching from the top: Scope 1 (Source branch, which will match if the branch was ever manually built), then Scope 2 (Target branch - ``develop``). 
* The Problem: Because the fallback key (``npm | "$(Agent.OS)"``) has no branch identifier, it matches the Target branch (``develop``) again! The search halts immediately at Scope 2.
* The Consequence: The task never reaches Scope 3 (Intermediate branch). Even though Build 1 wrote a fresh, updated cache into the PR scope, that cache is completely ignored and will never be used.

How ``$(Build.SourceBranch)`` Fixes This:

In a PR run, ``$(Build.SourceBranch)`` evaluates to the PR reference (such as ``refs/pull/1/merge``).

When Build 2 runs with our branch-aware configuration:

1. At Scope 2 (Target branch - ``develop``), the task tests Restore Key 1 (``npm | "$(Agent.OS)" | refs/pull/1/merge``).
2. Because caches in ``develop`` were saved with branch ``refs/heads/develop``, Restore Key 1 does not match ``develop``.
3. The task safely skips the Target branch and advances down to Scope 3 (Intermediate branch).
4. In Scope 3, the cache saved by Build 1 matches Restore Key 1 (same OS, same PR branch). The fresh PR cache is successfully restored.

In this design, Restore Key 2 (``npm | "$(Agent.OS)"``) acts strictly as a fallback for Build 1 when the PR scope is still completely empty.

Flow Comparison: Naive vs. Branch-Aware PR Lookup
---------------------------------------------------

The diagram below compares how the cache engine navigates scopes across two consecutive PR builds under both configurations:

.. code-block:: text

   ========================================================================
   SCENARIO 1: NAIVE CONFIGURATION (WITHOUT $(Build.SourceBranch))
   Key: npm | OS | package-lock.json   /   restoreKeys: npm | OS
   ========================================================================

   [PR Build 1]
     Scope 1: Source (feature-b) ──► Miss (empty)
     Scope 2: Target (develop)   ──► MATCH (inexact via "npm|OS")
                                     └──► Restores develop base cache
     End of Job                  ──► Writes NEW cache into [Scope 3: PR Scope]

   [PR Build 2 (Subsequent commit on same PR)]
     Scope 1: Source (feature-b) ──► Miss (or matches stale manual build)
     Scope 2: Target (develop)   ──► ⚠️ MATCHES AGAIN! (stops search here)
                                     └──► Re-restores stale develop cache!
     Scope 3: PR Intermediate   ──► ❌ NEVER REACHED!
                                     └──► Build 1 cache is shadowed and wasted!


   ========================================================================
   SCENARIO 2: BRANCH-AWARE CONFIGURATION (WITH $(Build.SourceBranch))
   Key: npm | OS | $(Build.SourceBranch) | package-lock.json
   restoreKeys:
     1. npm | OS | $(Build.SourceBranch)
     2. npm | OS
   ========================================================================

   [PR Build 1 (Cold Start)]
     Scope 1: Source (feature-b) ──► Miss
     Scope 2: Target (develop)   ──► restoreKey 1 (PR ref) misses develop
                                 ──► restoreKey 2 ("npm|OS") MATCHES!
                                     └──► Primes initial base cache
     End of Job                  ──► Writes NEW cache tagged with PR branch
                                     into [Scope 3: PR Scope]

   [PR Build 2 (Incremental Re-run)]
     Scope 1: Source (feature-b) ──► Miss
     Scope 2: Target (develop)   ──► restoreKey 1 ("npm|OS|refs/pull/1/merge")
                                     MISSES develop (Target branch has develop ref)
                                     └──► Task safely advances to Scope 3!
     Scope 3: PR Intermediate   ──► 🎉 MATCH restoreKey 1!
                                     └──► Successfully rehydrates Build 1 cache!

Handling Security Vulnerabilities: Cache Invalidation with ``CACHE_VERSION``
==========================================================================

What happens if a cached package is found to have a critical security vulnerability (CVE), or if the cached dependencies become corrupted?

Because cache entries in Azure DevOps are strictly immutable, you cannot delete or update an existing cache entry on remote storage directly from a pipeline task. Furthermore, because ``restoreKeys`` perform prefix matching, your pipeline will continue restoring the vulnerable or corrupted archive as a fallback.

The cleanest way to invalidate and purge the old cache across all branches and scopes is to introduce a ``CACHE_VERSION`` prefix at the very beginning of both the ``key`` and every line in ``restoreKeys``:

.. code-block:: yaml

   variables:
     CACHE_VERSION: v1
     NODE_MODULES_CACHE: $(System.DefaultWorkingDirectory)/node_modules

   steps:
   - task: Cache@2
     displayName: Cache node_modules with Version Invalidation
     inputs:
       key: '$(CACHE_VERSION) | npm | "$(Agent.OS)" | $(Build.SourceBranch) | package-lock.json'
       path: $(NODE_MODULES_CACHE)
       restoreKeys: | 
         $(CACHE_VERSION) | npm | "$(Agent.OS)" | $(Build.SourceBranch)
         $(CACHE_VERSION) | npm | "$(Agent.OS)"

How Bumping the Version Cleans the Cache
----------------------------------------

When you need to clean the cache due to a security patch, a Node.js upgrade, or corrupted dependencies:

1. Change the Variable: Simply bump the version in your pipeline definition:

   .. code-block:: yaml

      variables:
        CACHE_VERSION: v2

2. Instant Invalidation Across All Scopes:  
   Because every lookup now begins with ``v2``, every existing cache entry tagged with ``v1`` - across the Source branch, Target branch, PR scope, and ``main`` - will immediately miss.
3. Clean Baseline Rebuilt:  
   The pipeline performs a clean install, fetches patched dependencies from the registry, and saves a brand-new, secure cache baseline under the ``v2`` prefix.

This gives your team an instant, declarative "kill switch" to invalidate the entire cache history without needing administrative access or manual cache purging in the Azure DevOps portal.

Conclusion
==========

Effective pipeline caching comes down to understanding how the CI engine walks through scopes. 

While this guide used ``npm`` and ``node_modules`` as an example, the principles apply to any dependency or build cache: pair deterministic content hashes (like lockfiles) with branch-aware fallbacks ``$(Build.SourceBranch)`` to prevent upstream branches from shadowing PR caches. And when dependencies need a clean slate, bumping ``CACHE_VERSION`` gives you a declarative kill switch across all scopes.

References
==========

* `Pipeline caching in Azure Pipelines <https://learn.microsoft.com/en-us/azure/devops/pipelines/release/caching?view=azure-devops>`_
* `GitHub Actions Cache Action <https://github.com/actions/cache>`_
