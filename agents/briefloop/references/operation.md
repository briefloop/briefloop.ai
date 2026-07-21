# Workspace Operation

## Active Path

Only the Experimental Codex SQLite path is active for new runs:

```bash
briefloop runtime install --workspace <workspace> --runtime codex
briefloop run --workspace <workspace> --runtime codex
briefloop runtime next --workspace <workspace>
```

Open and trust the workspace in Codex after installing the runtime kit. Do not
substitute operator, Claude, Hermes, OpenCode, CodeBuddy, or a JSON-control
workflow.

## Sequence Authority

`runtime next` returns the Store-derived `CoreRunNextAction`. It is the only
sequence authority. For role work, start the exact recorded invocation, follow
its `execute_in_current_session` or `delegate_exact_role` instruction, and
write only its allowed scratch outputs. A later role requires a new invocation
and receipt. Deterministic actions stay with the root runtime host.

For `role_topology=single_session`, the same Codex context performs separately
recorded stage invocations. This is stage-separated self-review, not independent
review.

## Read-Only Views

Use `briefloop status --workspace <workspace> --json` and `runtime next` as
supported Store-derived views. Legacy JSON control files and report, status,
handoff, finalize, Quality Panel, Markdown, JSON/JSONL, and HTML exports are
non-authoritative projections. Strict action, envelope, and human-request JSON
payloads are revalidated against ControlStore and are not authority by
themselves. Do not
infer current stage, blockers, package readiness, or delivery from file
existence.
