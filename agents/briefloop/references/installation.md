# Installation

## Current Supported Path

Use a canonical BriefLoop source checkout. Python **3.12 or newer** is required.
The checkout installs the deterministic CLI and contains the source-only Codex
runtime kit.

The package URL is package metadata, not an installation authority. Do not use
`pipx install briefloop` for bootstrap until BriefLoop release notes explicitly
say that a package-index artifact has been published and smoke-tested.

The checkout serves two scopes:

1. **Deterministic CLI** — creates workspaces, validates artifacts, records
   Store state, runs gates, freezes evidence, and preserves delivery truth.
2. **Codex runtime kit** — installed into a workspace with
   `briefloop runtime install --workspace <path> --runtime codex`. Hermes,
   WorkBuddy, CodeBuddy, and the legacy JSON control-plane runtimes are
   deleted as of v0.15.2.

## Before Changing The Machine

Identify the OS and shell. Show the proposed source directory and actions to
the user, then obtain explicit approval before cloning or installing.

Use one shell for the entire install:

- macOS / Linux: Bash or another POSIX shell.
- Windows: PowerShell only. Never switch to Git Bash mid-flow.
- Never mix `python3`, `which`, or `/c/Users/...` into PowerShell.
- Empty output is neither success nor failure. Verify each command from its
  exit status and named postcondition.

## macOS / Linux — Bash

```bash
set -euo pipefail

command -v git
command -v python3

repo_root="$HOME/BriefLoop/briefloop"
if [ -e "$repo_root" ]; then
  printf 'Install target already exists: %s\nInspect it; do not clone over it.\n' "$repo_root" >&2
  exit 1
fi

mkdir -p "$(dirname "$repo_root")"
git clone https://github.com/Stahl-G/briefloop.git "$repo_root"
cd "$repo_root"

[ "$(git remote get-url origin)" = "https://github.com/Stahl-G/briefloop.git" ]
git rev-parse HEAD

bash scripts/setup.sh
source .venv/bin/activate
briefloop version
```

The active writing runtime is Codex. After a workspace exists:

```bash
briefloop runtime install --workspace <workspace> --runtime codex
briefloop run --workspace <workspace> --runtime codex
```

Do not run `briefloop claude install`, Hermes, WorkBuddy, or CodeBuddy paths.
Those runtimes were deleted in v0.15.2.

## Windows — PowerShell

Run this block in a single PowerShell session. It fails on a missing prerequisite,
wrong origin, half-created target directory, failed setup, or missing CLI. Do
not translate it to Git Bash or retry a failed clone over the same directory.

```powershell
$ErrorActionPreference = "Stop"

function Assert-LastExit {
    param([string]$Step)
    if ($LASTEXITCODE -ne 0) {
        throw "$Step failed with exit code $LASTEXITCODE. Stop and inspect before retrying."
    }
}

& py -3 --version
Assert-LastExit "Python check"
& git --version
Assert-LastExit "Git check"

$repoRoot = Join-Path $HOME "BriefLoop\briefloop"
if (Test-Path $repoRoot) {
    throw "Install target already exists: $repoRoot. Inspect it; do not clone over it."
}

New-Item -ItemType Directory -Path (Split-Path -Parent $repoRoot) -Force | Out-Null
& git clone https://github.com/Stahl-G/briefloop.git $repoRoot
Assert-LastExit "Clone"
Set-Location $repoRoot

$origin = (& git remote get-url origin).Trim()
Assert-LastExit "Origin check"
if ($origin -ne "https://github.com/Stahl-G/briefloop.git") {
    throw "Unexpected origin: $origin"
}

$commit = (& git rev-parse HEAD).Trim()
Assert-LastExit "Commit check"
if ($commit -notmatch "^[0-9a-f]{40}$") {
    throw "Git did not return a full commit SHA."
}

& .\scripts\setup.ps1
Assert-LastExit "Setup"
if (-not (Test-Path .\.venv)) {
    throw "Setup ended without creating .venv."
}

& .\.venv\Scripts\briefloop.exe version
Assert-LastExit "CLI verification"
```

If and only if PowerShell reports an execution-policy error for the checked-out
local setup script, use this one-process exception. It does not change a global
or user policy:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup.ps1
if ($LASTEXITCODE -ne 0) {
    throw "Setup failed with exit code $LASTEXITCODE. Stop and inspect before retrying."
}
```

## Full Runtime Asset Postconditions

Only perform these checks when the selected runtime is Codex. They prove the
workspace kit is installed; they do not prove that Codex delegated a role.

```bash
briefloop runtime install --workspace <workspace> --runtime codex
briefloop run --workspace <workspace> --runtime codex
```

Do not look for `.agents/skills/briefloop-workbuddy` or `.codebuddy/agents`.
Those trees were deleted with the legacy JSON runtime.

## Mandatory Postconditions

Do not report a stage complete until its postcondition is observed and recorded:

1. **Clone** — the origin is exactly the canonical repository and
   `git rev-parse HEAD` returns a full commit SHA.
2. **Setup** — the setup command succeeds and `.venv` exists.
3. **CLI** — `briefloop version` or the venv-local executable prints a version.
4. **Runtime assets** — only when requested, `briefloop runtime install --runtime
   codex` succeeds for the confirmed workspace.

If any postcondition is missing, say that the stage is incomplete. Do not infer
success from prose, an empty response, or the presence of a partial directory.

## On Timeout Or Hang

Before retrying, inspect the process, target directory, and the exit status of
the command that just ran. A slow command is not automatically a failure, but a
blind retry can compound a half-created checkout or virtual environment.

Never execute a setup script fetched through a pipe, silently modify system
Python, or use `sudo pip`. If role agents cannot be invoked, deterministic CLI
setup and inspection can still work, but the agent must not claim that the full
delegated workflow ran.
