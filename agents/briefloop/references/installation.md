# Install BriefLoop

## Requirements

- macOS is the verified path. The service listens on 127.0.0.1 only.
- Python 3.11 or newer.
- At least one execution host, installed and authenticated by the user: Codex CLI, Opencode CLI, Claude Code, Kimi, Hermes, DeepSeek Reasonix or MiMo Code.
- Node.js 20+ when using a bridged host (Claude Code, Kimi, Hermes, Reasonix, MiMo). Codex and Opencode run natively and do not need it.
- Network access for the first dependency install. Tavily is optional and uses the user's own key.

## Option A — source checkout (reference setup)

```sh
git clone https://github.com/Stahl-G/briefloop.git
cd briefloop
./start.sh                                            # default workspace ./workspaces/default on port 8765
./start.sh --workspace /path/to/ws --port 8765         # choose workspace and port
./start.sh --backend opencode --no-open                # pick the runtime, skip opening a browser
```

`start.sh` creates `.venv`, installs the Python dependencies and the bundled WikiSkill wheel, starts the local service and opens the web app. There is no second repository to clone and no frontend build step.

## Option B — published package

```sh
pip install briefloop-local
briefloop serve --workspace /path/to/ws --port 8765
```

`briefloop serve` accepts `--workspace`, `--port`, `--paused` (open the workspace without re-running queued jobs or feedback learning) and `--backend`.

## Verify

```sh
briefloop --version                 # BriefLoop 0.17.1
briefloop doctor                    # which host CLIs and helpers exist on this machine
briefloop status --workspace <dir>  # settings, sources and jobs of one workspace
```

`doctor` only checks that commands exist; it does not start a model or verify a login. Credentials belong to each host (for example `codex login` or `opencode auth login`).

## Host channels

| Host | Channel | Notes |
| --- | --- | --- |
| Codex | native app-server | read-only / workspace-write sandbox, per-turn web search |
| Opencode | native local service | needs a 1.x server; models are `provider/model` |
| Claude Code | bridge (stream-json) | the CLI's own permission model |
| Kimi, Hermes, Reasonix | bridge (ACP) | permissions negotiated per tool call |
| MiMo | bridge (JSON events) | no direct image input |

Tavily: the key is read from `TAVILY_API_KEY` or `~/.config/briefloop/tavily.key` (0600) and never enters a workspace, report or log.

## Troubleshooting

- `需要本机 Node.js 20+ 来运行多 Runtime bridge` — install Node 20+, then restart the service.
- `这个工作区已有本地服务在运行` — one service per workspace; stop the other process or open the URL recorded in `server.json`.
- A job interrupted by a closed app or a crashed service — see `references/repair-and-delivery.md`.
