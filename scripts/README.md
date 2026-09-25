# Public site build

Run `python3 scripts/build-site.py`, then `python3 scripts/check-site.py` and `node --test tests/downloads.test.cjs` from the repository root. No network or third-party Python package is required.

- Edit home/download markup in `content/templates/`; root HTML and `downloads.js` are generated static files with functional no-JavaScript download links.
- Edit the eight bilingual guides in `content/docs.json`. Generated pages and local search indexes go to `docs/`.
- Published channel versions, installer URLs and checksums are recorded in `content/releases.json`. Reverify exact public release assets before changing it. A source version is not an installer release.
- `content/docs-sources.json` records the explicit public-file reference list. Never recursively publish application workspaces, private plans, credentials or raw model sessions.
- Keep historical article and demo URLs intact. New screenshot/example assets require actual saved artifacts and clear generation/review labels.

Preview: `python3 -m http.server 8143 --bind 127.0.0.1`. A local preview or build does not publish to GitHub Pages.

Technical report v3 publishes only the nine reviewed public files from the main-repository report; source and published hashes are recorded in `content/technical-report-v3.json`. Historical v2 URLs remain available. Home-page report sections are the final sections before the site footer; edit their source templates to preserve this order. HTML wrappers add homepage navigation and canonical URLs.

Screenshot WebP copies come from `scripts/build-images.py` (optional; requires Pillow). Pages serve them through `<picture>` with the saved PNG/JPEG as fallback; rerun it after replacing a screenshot and keep the original file at its URL.

Saved sample pages use `scripts/render-sample.py INPUT --slug SLUG` with markdown-it-py 4.2.0. This optional renderer copies the original Markdown/Word bytes and requires generation/review metadata; it does not author report prose.
