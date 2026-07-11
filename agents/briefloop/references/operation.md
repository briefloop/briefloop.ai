# Workspace Operation

## Start With Machine Facts

```bash
BRIEFLOOP_CLI="$(command -v briefloop)"
test -n "$BRIEFLOOP_CLI"
"$BRIEFLOOP_CLI" version
```

Use the runtime supported by available assets. For handoff only:

```bash
briefloop run --workspace <workspace> --runtime operator
```

For a source checkout with CodeBuddy-compatible role assets:

```bash
briefloop run --workspace <workspace> --runtime codebuddy
```

Do not silently substitute one runtime for another.

## Follow The Generated Handoff

Treat these as the workspace-specific execution contract:

```text
output/intermediate/agent_handoff.md
output/intermediate/agent_handoff.json
```

Read the relevant step before each role action and after each deterministic
transaction. Never hand-author control artifacts to make a stage appear complete.

## Report A Run Card

```text
runtime:
current_stage:
run_integrity:
blocked:
latest_gate_status:
finalize_report:
delivery_truth:
next_allowed_action:
```

Use `unknown` rather than guessing. Prose is not evidence that a stage, gate,
repair, or delivery completed.
