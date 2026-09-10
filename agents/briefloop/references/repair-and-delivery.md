# Recover work, then deliver

## Recover

1. `briefloop status --workspace <dir>` reports the workspace state and the jobs it knows about.
2. `briefloop doctor` reports whether the host CLIs and helpers this machine needs are present.
3. Job details live in `jobs/` and in the app's task list; a failure keeps its message and whatever artifacts were produced.
4. Restart the service with `./start.sh` (or `briefloop serve`) after a crash. A workspace opened while the app was closed stays paused, so old queues are not re-run silently.
5. If a host CLI is not authenticated, fix it in the host (for example `codex login`) and retry the message.

## Deliver

1. Fix the version you want to deliver: 生成 Word writes the `.docx` and shows progress.
2. 正式交付 binds that version with its template, sources and review record; unresolved items stay visible in the app.
3. 审计包 exports the fixed material with evidence and review metadata when the user asks for it.
4. Later edits create new versions; the release keeps pointing at the version it was built from.
