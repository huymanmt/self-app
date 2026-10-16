Architecting Enterprise AI Workflows with LiteLLM, Langfuse, and OpenBao
#########################################################################

:date: 2026-10-14 11:15
:tags: ai, llmops, litellm, langfuse, openshift, security
:category: Platform AI
:slug: enterprise-ai-workflow-litellm-langfuse
:author: Nguyen Huynh Huy Man
:summary: How to deploy and orchestrate Human-in-the-Loop AI automation workflows on Red Hat OpenShift using LiteLLM proxy, Langfuse observability, and OpenBao secrets vault.

As generative AI and autonomous agents transition from experimental pilots into core enterprise business operations, platform teams face new challenges in model governance, cost monitoring, latency optimization, and secret management.

In this post, we explore the architecture of a **Human-in-the-Loop (HITL)** automation pipeline deployed across an enterprise **Red Hat OpenShift** cluster.

.. image:: {static}/images/ai-workflow.svg
   :alt: Enterprise AI Workflow Architecture
   :align: center
   :width: 100%

Core Components of the Architecture
===================================

1. **LiteLLM Gateway:** Provides a unified OpenAI-compatible API layer across multiple providers (Azure AI Foundry, Anthropic, Bedrock, and self-hosted models).
2. **Langfuse Telemetry:** Captures full execution traces, token consumption, model latencies, and evaluations.
3. **OpenBao Secrets Vault:** Open-source fork of HashiCorp Vault ensuring encrypted, ephemeral credential brokering.
4. **Human-in-the-Loop (HITL) Controller:** Leverages GitHub Actions and GitHub Issues for human approval gates before executing critical operational tasks.

.. tip::
   Standardizing through a centralized gateway like LiteLLM decouples internal client applications from specific vendor APIs, enabling seamless fallbacks and automatic failover during downstream outages.

Deploying LiteLLM on OpenShift
==============================

Below is a declarative OpenShift Deployment configuration with health checks and resource constraints:

.. code-block:: yaml

   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: litellm-proxy
     namespace: ai-platform
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: litellm-proxy
     template:
       metadata:
         labels:
           app: litellm-proxy
       spec:
         containers:
         - name: litellm
           image: ghcr.io/berriai/litellm:main-latest
           ports:
           - containerPort: 4000
           env:
           - name: DATABASE_URL
             valueFrom:
               secretKeyRef:
                 name: ai-platform-secrets
                 key: database-url
           - name: STORE_MODEL_IN_DB
             value: "True"
           resources:
             requests:
               cpu: "500m"
               memory: "1Gi"
             limits:
               cpu: "2"
               memory: "4Gi"
           readinessProbe:
             httpGet:
               path: /health/readiness
               port: 4000
             initialDelaySeconds: 10
             periodSeconds: 10

Instrumenting Langfuse Observability
====================================

Tracking input/output tokens and cost attribution across engineering squads is mandatory for enterprise FinOps:

.. code-block:: python

   import os
   from langfuse.openai import openai

   # Automatic tracing hooked via OpenAI-compatible LiteLLM proxy
   openai.api_base = os.getenv("LITELLM_ENDPOINT", "https://litellm.internal.domain/v1")
   openai.api_key = os.getenv("LITELLM_KEY")

   def execute_agent_step(prompt: str, session_id: str) -> str:
       response = openai.ChatCompletion.create(
           model="azure-gpt4o",
           messages=[{"role": "user", "content": prompt}],
           metadata={
               "session_id": session_id,
               "environment": "production",
               "tier": "enterprise-agent"
           }
       )
       return response.choices[0].message.content

Summary of Takeaways
====================

By combining OpenShift's robust container scheduling with specialized LLMOps tooling:

* Teams gained **real-time visibility** into latency and cost via Langfuse.
* API keys are rotated dynamically through **OpenBao**, mitigating credential leaks.
* The organization established a standardized, provider-agnostic AI platform ready for scale.
