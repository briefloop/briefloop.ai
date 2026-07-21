# Installation

## Release Rule

This guide describes the published v0.14.0 release. Verify the `v0.14.0` Git
tag and non-draft GitHub Release before installation. Use a canonical source
checkout for bootstrap; do not infer `pipx install briefloop` from package
metadata.

Before changing the machine, identify the OS, shell, source directory, and
future workspace directory. Show them to the user and obtain approval. Never
execute downloaded shell content directly and never use `curl | bash`.

## macOS / Linux

Run in one POSIX shell:

```bash
set -euo pipefail
command -v git
command -v python3

repo_root="$HOME/BriefLoop/briefloop"
test ! -e "$repo_root"
mkdir -p "$(dirname "$repo_root")"
git clone https://github.com/Stahl-G/briefloop.git "$repo_root"
cd "$repo_root"
test "$(git remote get-url origin)" = "https://github.com/Stahl-G/briefloop.git"
git rev-parse HEAD
bash scripts/setup.sh
source .venv/bin/activate
briefloop version
```

## Windows PowerShell

Run in one PowerShell session; do not translate this to Git Bash:

```powershell
$ErrorActionPreference = "Stop"
py -3 --version
if ($LASTEXITCODE -ne 0) { throw "Python check failed" }
git --version
if ($LASTEXITCODE -ne 0) { throw "Git check failed" }

$repoRoot = Join-Path $HOME "BriefLoop\briefloop"
if (Test-Path $repoRoot) { throw "Install target already exists: $repoRoot" }
New-Item -ItemType Directory -Path (Split-Path -Parent $repoRoot) -Force | Out-Null
git clone https://github.com/Stahl-G/briefloop.git $repoRoot
if ($LASTEXITCODE -ne 0) { throw "Clone failed" }
Set-Location $repoRoot

$origin = (git remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or $origin -ne "https://github.com/Stahl-G/briefloop.git") {
    throw "Unexpected origin: $origin"
}
git rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw "Commit verification failed" }
.\scripts\setup.ps1
if ($LASTEXITCODE -ne 0 -or -not (Test-Path .\.venv)) { throw "Setup failed" }
& .\.venv\Scripts\briefloop.exe version
if ($LASTEXITCODE -ne 0) { throw "CLI verification failed" }
```

If PowerShell reports an execution-policy error for the checked-out local
script, use a one-process exception only:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup.ps1
```

## Mandatory Postconditions

Do not call installation complete until all are observed:

1. exact canonical origin;
2. full checked-out commit SHA;
3. successful setup and local `.venv`;
4. the venv-local `briefloop version` output.

For a workspace, separately verify the packaged Codex kit:

```bash
briefloop runtime install --workspace <workspace> --runtime codex
```

CLI installation does not prove that Codex opened the workspace, trusted it,
started a role invocation, passed a Gate, or delivered a report.
