---
name: briefloop
description: Install and operate the BriefLoop v0.14.0 Experimental Codex SQLite path for accountable AI-assisted briefs.
---

# BriefLoop v0.14.0 Codex Operator

## Release Status

This website describes the published **v0.14.0** release. The authoritative
release record is the `v0.14.0` Git tag and its non-draft GitHub Release.

## Current Capability

- New runs support only the **Experimental Codex SQLite path**.
- `briefloop.db` is the SQLite ControlStore. Its accepted strict requests,
  receipts, and ledger relations are the sole runtime authority.
- The legacy JSON control plane has been deleted. Do not import, migrate,
  dual-read, dual-write, or fall back to a JSON-only workspace.
- Legacy JSON control files and report, status, Quality Panel, handoff,
  finalize, Markdown, JSON/JSONL, and HTML exports are non-authoritative
  projections. Strict action, envelope, and human-request JSON may carry input
  across the write boundary, but deterministic services revalidate it against
  ControlStore; the JSON is never authority by itself.
- A three-page HTML export and the public init wizard demo are presentation
  surfaces. They cannot write state or trigger workflow actions.
- LAJ is Experimental, advisory-only, and **NOT MEASURED** for utility or
  efficacy. It cannot affect Gates, delivery, approval, next action, or factual
  support.
- The Improvement Ledger is unavailable. There is no automatic learning,
  next-run memory, or “accept suggestion to improve the next run” capability.

## Required Reading

Read, in order:

1. `references/installation.md`
2. `references/onboarding.md`
3. `references/control-boundary.md`
4. `references/operation.md`
5. `references/repair-and-delivery.md`

Resolve these paths against `https://briefloop.ai/agents/briefloop/` over HTTP.

## Bootstrap

1. Identify the OS, shell, current directory, and intended workspace path.
2. Show the clone, install, and workspace actions; get explicit user approval.
3. Install from the canonical source checkout and verify origin, commit, and
   CLI version.
4. Capture requirements with `briefloop onboard`, then initialize a fresh
   workspace. Do not reuse a JSON-only workspace.
5. Install the packaged Codex runtime kit into that workspace.
6. Open and trust the workspace in Codex.
7. Run `briefloop run --workspace <workspace> --runtime codex`.
8. Follow only `briefloop runtime next --workspace <workspace>` and its exact
   Receipt-backed invocation envelope.

## Runtime Protocol

- Start the exact recorded role invocation before role work.
- When the envelope says `execute_in_current_session`, the current Codex
  session performs only that role. When it says `delegate_exact_role`,
  delegate only that exact role. Never fall back between paths.
- A role writes only its allowed invocation scratch files. Deterministic
  services accept or reject the proposed effect.
- Human decisions require the typed request surfaced by the Store-derived next
  action. Chat prose is not approval.
- For `role_topology=single_session`, stage-separated self-review is not an
  independent-review claim.

## Hard Boundaries

- Never edit `briefloop.db`, receipts, frozen artifacts, or projection files.
- Never infer stage, Gate, approval, package readiness, or delivery from file
  existence or agent prose.
- Never claim LAJ proves quality, correctness, completeness, or improvement.
- Never claim BriefLoop automatically learns from feedback.
- Never claim a role ran unless its invocation was recorded and accepted.
- Never claim delivery without Store-derived delivery truth and explicit human
  authorization.

## Engineering Provenance

The 0.14 engineering work is implemented and tested with Codex. Codex does not
authorize its own changes: humans approve merge and release.
