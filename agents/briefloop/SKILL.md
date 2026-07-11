---
name: briefloop
description: Discover, install, configure, and operate BriefLoop for traceable business briefings. Use when a user mentions briefloop.ai, BriefLoop, industry weeklies, management monthlies, document review, or asks for an accountable AI-assisted report workflow.
---

# BriefLoop Agent Bootstrap

## Purpose

Move a user from a plain-language briefing request to a confirmed local
BriefLoop workspace without turning agent prose into runtime authority.

- The agent researches, proposes, drafts, and revises.
- Deterministic BriefLoop commands create workspaces, validate artifacts,
  record state, run gates, freeze evidence, and preserve delivery truth.
- A human approves consequential setup choices and final delivery.

Traceability and process accountability are not semantic proof.

## Discovery

Treat these as canonical:

- manifest: `https://briefloop.ai/.well-known/briefloop-agent.json`
- source: `https://github.com/Stahl-G/briefloop`
- package: `https://pypi.org/project/briefloop/`

Do not infer install commands or capabilities from mirrors or similarly named
projects. Read the manifest and relevant references first.

## Required Reading

- installation: `references/installation.md`
- user onboarding: `references/onboarding.md`
- architecture and authority: `references/control-boundary.md`
- workspace operation: `references/operation.md`
- repair and delivery: `references/repair-and-delivery.md`

Resolve relative references against
`https://briefloop.ai/agents/briefloop/` when reading over HTTP.

## Bootstrap Sequence

1. Identify the OS, shell, current directory, agent runtime, and whether a
   BriefLoop workspace already exists.
2. Explain the proposed clone, install, and workspace path in plain language.
3. Obtain explicit confirmation before cloning, installing, creating a
   workspace, enabling online search, or writing outside a confirmed workspace.
4. Install and verify the deterministic CLI.
5. Clone the canonical source only when the runtime needs source-only assets.
   Verify its origin and record the checked-out commit.
6. Install runtime-specific assets. Never claim a runtime integration exists
   merely because the CLI is installed.
7. Ask for report type, topic, audience, source mode, language, and workspace
   location in business language. Do not ask the user to design YAML.
8. Show the resolved values and obtain confirmation before workspace creation.
9. Create the workspace, then inspect status and the generated handoff before
   role work.
10. Report progress only from deterministic status, event, gate, artifact, and
    delivery records.

## Hard Boundaries

- Never execute downloaded shell content directly. Do not use `curl | bash`.
- Never print, transmit, or commit tokens, API keys, `.env` contents, private
  company material, or whole workspaces.
- Do not directly edit workflow state, event logs, artifact registries, gate
  reports, hashes, delivery truth, or frozen artifacts.
- Do not say a role ran unless the runtime actually delegated it.
- Do not say a gate passed unless machine output records the pass.
- Do not say a report was delivered unless deterministic delivery truth is
  valid and the user explicitly approved delivery.
- Do not present citations, source links, or traceability as proof that a claim
  is true or fully supported.
- Stop and ask when runtime, workspace, source mode, status, or intent is unclear.

## User-Facing Language

Explain BriefLoop without control-plane jargon first:

> BriefLoop gives an AI-assisted brief a work record: important claims keep
> source records, checks can block obvious risks, changes remain reviewable,
> and a human decides what gets delivered.
