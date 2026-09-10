# Control boundary

## Use the app's interfaces

- Read and write through the web app, the loopback HTTP API, or `briefloop tool …`.
- Do not edit `briefloop.db` or the files under `sources/`, `jobs/`, `exports/` and `wiki/` directly; the workspace owns their state, hashes and version links.
- One service per workspace. Do not start a second process for the same folder.

## Versions and releases

- Editing a draft creates a new version; older versions stay readable.
- A score, a Word export and a formal release are bound to one version. Never rewrite a version a release or an audit bundle points at.
- Formal delivery is the user's action — confirm before producing it.

## Credentials

- Host credentials stay with the host CLI (`~/.codex`, `~/.claude`, `~/.config/opencode`, …); the Tavily key lives at `~/.config/briefloop/tavily.key` (0600) or in `TAVILY_API_KEY`.
- Credentials never enter a workspace, a report, a Wiki note or a log.

## Permissions belong to the host

- Codex enforces read-only / workspace-write sandboxes and per-turn web search; Opencode enforces read-only through its permission rules.
- Bridged hosts (Claude Code, Kimi, Hermes, Reasonix, MiMo) run with their own permission model. BriefLoop cannot enforce a restriction the host does not offer — say so instead of implying one.
- Switching runtime never rewrites an existing session; start a new one.

## Evidence

- Sources are the evidence: originals, extracted text, locators and dates. A model summary, a search snippet or a score is not evidence.
- Keep unverified material visible as unverified instead of smoothing it over.
