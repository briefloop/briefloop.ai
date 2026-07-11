# Installation

## Decide What Is Needed

The PyPI package installs BriefLoop's deterministic CLI. It does not, by
itself, give an agent runtime all role agents and skills needed to write a full
brief. Full runtime operation may also require the canonical source checkout.

Before changing the machine, inspect:

```bash
uname -s
command -v python3 || true
command -v pipx || true
command -v briefloop || true
```

Show the findings and proposed actions to the user. Obtain explicit approval.

## Install The CLI

Prefer an isolated installation:

```bash
pipx install briefloop
command -v briefloop
briefloop version
```

If `pipx` is unavailable, explain the platform-appropriate installation. Do
not silently modify system Python or use `sudo pip`.

## Install Source Runtime Assets

Only when required by the selected runtime, and only after confirmation:

```bash
git clone https://github.com/Stahl-G/briefloop.git
git -C briefloop remote get-url origin
git -C briefloop rev-parse HEAD
cd briefloop
bash scripts/setup.sh
```

The remote must be the canonical repository. Record the commit used. Never
execute a setup script fetched through a pipe; inspect and run the checked-out
local file.

For Claude Code:

```bash
source .venv/bin/activate
briefloop claude install --repo-workdir .
```

For WorkBuddy/CodeBuddy, confirm the checkout contains both:

```text
.agents/skills/briefloop-workbuddy/
.codebuddy/agents/briefloop-*.md
```

If role agents cannot be invoked, deterministic setup and inspection remain
possible, but do not claim the full delegated workflow can run.
