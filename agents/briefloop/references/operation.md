# Workspace Operation

## Start With Machine Facts

```bash
BRIEFLOOP_CLI="$(command -v briefloop)"
test -n "$BRIEFLOOP_CLI"
"$BRIEFLOOP_CLI" version
```

The active writing runtime is Experimental SQLite-only Codex:

```bash
briefloop runtime install --workspace <workspace> --runtime codex
briefloop run --workspace <workspace> --runtime codex
briefloop runtime next --workspace <workspace>
briefloop status --workspace <workspace>
```

Do not use `--runtime operator`, `--runtime codebuddy`, Hermes, or WorkBuddy.
Those paths were deleted or are unsupported on SQLite. Do not silently
substitute one runtime for another.

JSON, Markdown, and HTML next to the workspace are projections. Runtime
authority is `briefloop.db` and its Receipts.

## Follow The Next Action

Treat the Store-derived `CoreRunNextAction` as the sequence authority. Read
`briefloop runtime next` before each role action and after each deterministic
transaction. Never hand-author Store state or frozen artifacts to make a stage
appear complete.

Legacy `agent_handoff.md` / `agent_handoff.json` files may still exist as
non-authoritative projections. Do not treat them as a new-run entrypoint.

## Report A Run Card

```text
runtime:
store_revision:
current_stage:
blocked:
latest_gate_status:
finalize_report:
delivery_truth:
next_allowed_action:
```

Use `unknown` rather than guessing. Prose is not evidence that a stage, gate,
repair, or delivery completed.
