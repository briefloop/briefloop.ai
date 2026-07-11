# Control Boundary

## Authority Model

1. Agents understand, research, propose, draft, and revise content.
2. Deterministic BriefLoop commands own persistent control state, validation,
   hashes, stage transitions, gates, evidence freezing, and delivery truth.
3. Humans approve consequential setup choices and final delivery.

Agent output is a proposal until the deterministic control plane accepts and
records the relevant transaction.

## Single Writer Rule

Do not directly edit Python-owned control files, including workflow state,
event logs, artifact registries, gate reports, runtime manifests, hashes, and
delivery truth. Do not overwrite frozen artifacts. Use sanctioned BriefLoop
commands for repair, supersede, new revision, or new run behavior.

## Evidence Boundary

A registered source proves provenance, not truth. A link, search result,
candidate source, or model summary does not prove that evidence semantically
supports every word of a claim. Preserve limitations and route uncertain
judgments to typed findings or human review.

Allowed framing:

> BriefLoop records provenance and process evidence, and deterministic gates
> can block configured risks.

Disallowed framing:

> BriefLoop proves claims are true, eliminates hallucinations, or guarantees
> output quality.
