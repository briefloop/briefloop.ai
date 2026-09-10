# BriefLoop

BriefLoop is a local agent workbench for sourced briefings: connect a CLI you already have, ask for research or a report, and get an editable draft with an independent evaluation and reusable learning.

- Version 0.17.1 · Python 3.11+ · the service listens on loopback only.
- Runtimes: Codex and Opencode run natively; Claude Code, Kimi, Hermes, DeepSeek Reasonix and MiMo Code run through a bundled bridge (needs Node.js 20+).
- Interface language: Chinese. Report body can be Chinese or English.

## Install and start

```sh
git clone https://github.com/Stahl-G/briefloop.git
cd briefloop
./start.sh                 # creates .venv, installs dependencies, opens the web app
```

Or from the published package:

```sh
pip install briefloop-local
briefloop serve --workspace /path/to/workspace --port 8765
```

The workspace records its process in `server.json`; `briefloop status --workspace <dir>` prints the workspace state and `briefloop doctor` lists the host CLIs found on this machine.

## How a workspace is used

1. Open the web app and pick or create a workspace.
2. In 设置 → 模型与提供商 choose the runtime and model. Lists come from the host's own catalogue, and any model ID can be typed in.
3. In 材料与需求 describe the task, add sources, and optionally switch on 联网 so the host can search.
4. Generate: BriefLoop plans the research, Scout collects sources inside the shared budget, Analyst drafts, Evaluator scores the draft in its own session, and one automatic revision can follow.
5. Edit the draft in the browser. Feedback becomes Wiki notes and, after verification, skills.

## Interfaces

- Web UI plus a loopback HTTP API (`/api/...`, token from `/api/session`).
- `briefloop tool --workspace <dir> <command>` for source work: `add-url`, `read-source`, `render-source`, `register-figure`, `join-scouts`, `normalize-document`, `count-brief`, `prepare-report-data`, `workspace-action`.

## Rules

- Never edit `briefloop.db` or the workspace folders behind the app's back: use the UI, the API, or `briefloop tool`.
- Sources are the evidence; model output, search snippets and scores are not.
- Ask before enabling online search, spending research budget, or producing a formal delivery.
- Keep credentials out of workspaces, reports and logs.

## References

- `references/installation.md` — requirements, both install paths, host setup, troubleshooting.
- `references/onboarding.md` — first run: workspace, runtime, sources, requirements.
- `references/operation.md` — daily use: roles, budget, evaluation, editing, Word, release.
- `references/control-boundary.md` — what agents may touch and what they must not.
- `references/repair-and-delivery.md` — recover interrupted work and produce a delivery.
