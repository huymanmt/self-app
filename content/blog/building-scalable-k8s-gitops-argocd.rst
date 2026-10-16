Building Scalable GitOps Delivery Pipelines with ArgoCD and GitHub ARC
######################################################################

:date: 2026-10-10 14:30
:modified: 2026-10-12 09:00
:tags: kubernetes, gitops, argocd, devops, github-actions
:category: Infrastructure
:slug: building-scalable-k8s-gitops-argocd
:author: Nguyen Huynh Huy Man
:summary: A deep dive into engineering resilient, self-healing GitOps pipelines using ArgoCD, Actions Runner Controller (ARC), and multi-tenant Kubernetes clusters.

GitOps has fundamentally shifted how cloud-native engineering teams manage infrastructure and application lifecycles.
By treating Git repositories as the single source of truth for declarative infrastructure, platforms achieve enhanced auditability, automated drift detection, and reproducible environments.

In this article, we examine an enterprise architecture combining **ArgoCD** with **GitHub Actions Runner Controller (ARC)** to eliminate build queue bottlenecks and establish continuous reconciliation.

.. image:: {static}/images/k8s-gitops-diagram.svg
   :alt: Kubernetes GitOps with ArgoCD and GitHub ARC
   :align: center
   :width: 100%

Architectural Objectives
========================

When designing multi-tenant CI/CD platforms across staging and production clusters, three challenges dominate:

1. **Runner Sprawl & Idle Costs:** Fixed static build agents incur ongoing cloud compute overhead during idle periods.
2. **Configuration Drift:** Imperative deployments via ad-hoc scripts lead to divergence between environments.
3. **Security Boundaries:** Providing deployment credentials directly inside CI runners expands the blast radius of potential compromises.

.. note::
   **Key Principle:** The CI pipeline should only build artifacts and update deployment manifests in Git. It should *never* hold direct cluster-admin credentials. ArgoCD pulls and reconciles cluster state internally.

Autoscaling CI with GitHub ARC
==============================

The **GitHub Actions Runner Controller (ARC)** deploys an operator in the Kubernetes cluster that spins up ephemeral runner pods on demand based on GitHub webhook metrics:

.. code-block:: yaml

   apiVersion: actions.summerwind.dev/v1alpha1
   kind: RunnerDeployment
   metadata:
     name: k8s-arc-runner
     namespace: arc-runners
   spec:
     template:
       spec:
         repository: org/cloud-platform
         dockerdWithinRunner: false
         nodeSelector:
           workload: ci-compute
         resources:
           limits:
             cpu: "4"
             memory: "8Gi"
           requests:
             cpu: "1"
             memory: "2Gi"
   ---
   apiVersion: actions.summerwind.dev/v1alpha1
   kind: HorizontalRunnerAutoscaler
   metadata:
     name: k8s-arc-runner-autoscaler
     namespace: arc-runners
   spec:
     scaleTargetRef:
       name: k8s-arc-runner
     minReplicas: 1
     maxReplicas: 30
     metrics:
     - type: PercentageRunnersBusy
       scaleUpThreshold: '0.75'
       scaleDownThreshold: '0.3'
       scaleUpFactor: '1.5'

Declarative Deployment with ArgoCD
==================================

Once the CI runner pushes a new image tag to the container registry and updates the target Git environment repo, ArgoCD triggers automated reconciliation:

.. code-block:: yaml

   apiVersion: argoproj.io/v1alpha1
   kind: Application
   metadata:
     name: platform-portal
     namespace: argocd
   spec:
     project: default
     source:
       repoURL: 'https://github.com/org/gitops-manifests.git'
       targetRevision: HEAD
       path: envs/production
     destination:
       server: 'https://kubernetes.default.svc'
       namespace: production
     syncPolicy:
       automated:
         prune: true
         selfHeal: true
       syncOptions:
         - CreateNamespace=true

Performance Metrics & Results
=============================

.. list-table::
   :widths: 40 30 30
   :header-rows: 1

   * - Metric
     - Before (Static Agents)
     - After (ARC + GitOps)
   * - Average Build Wait Time
     - 8.5 minutes
     - **25 seconds**
   * - Deployment Drift Incident Rate
     - 14% monthly
     - **0% (auto-healed)**
   * - Cloud Compute Idle Cost
     - 100% baseline
     - **Reduced by 58%**

Conclusion
==========

Decoupling continuous integration (handled by ephemeral, containerized runners) from continuous delivery (enforced by declarative GitOps controllers) yields a hardened, scalable foundation.
Engineering teams regain velocity without sacrificing infrastructure compliance.
