# Public site build

Run `python3 scripts/build-site.py`, then `python3 scripts/check-site.py`, `python3 scripts/check-design.py` and `node --test tests/downloads.test.cjs` from the repository root. No network or third-party Python package is required.

- Edit home/download markup in `content/templates/`; root HTML and `downloads.js` are generated static files with functional no-JavaScript download links.
- Pages other than the home page take their header from `scripts/site_header.py` (download, guide and saved-sample builds) with `site-header.css`/`site-header.js`. It mirrors the home navigation; change both together.
- On phones the home pages show a text excerpt of the saved Tencent sample instead of desktop screenshots. `build-site.py` copies it from `assets/samples/tencent-2026-08/report.md` and stops if the quoted rows or note change.
- Edit the eight bilingual guides in `content/docs.json`. Generated pages and local search indexes go to `docs/`.
- Published channel versions, installer URLs and checksums are recorded in `content/releases.json`. Reverify exact public release assets before changing it. A source version is not an installer release.
- `content/docs-sources.json` records the explicit public-file reference list. Never recursively publish application workspaces, private plans, credentials or raw model sessions.
- Keep historical article and demo URLs intact. New screenshot/example assets require actual saved artifacts and clear generation/review labels.

Preview: `python3 -m http.server 8143 --bind 127.0.0.1`. A local preview or build does not publish to GitHub Pages.

Technical report v3 publishes only the nine reviewed public files from the main-repository report; source and published hashes are recorded in `content/technical-report-v3.json`. Historical v2 URLs remain available. Home-page report sections are the final sections before the site footer; edit their source templates to preserve this order. HTML wrappers add homepage navigation and canonical URLs.

Screenshot WebP copies come from `scripts/build-images.py` (optional; requires Pillow). Pages serve them through `<picture>` with the saved PNG/JPEG as fallback; rerun it after replacing a screenshot and keep the original file at its URL.

Saved sample pages use `scripts/render-sample.py INPUT --slug SLUG` with markdown-it-py 4.2.0. This optional renderer copies the original Markdown/Word bytes and requires generation/review metadata; it does not author report prose.

## Design v3.1

`design-tokens.css` and both logo assets are copied without modification from the product source commit in `content/design-source.json`. Keep the source record and file hashes in sync when intentionally upgrading that source; `scripts/check-design.py` checks identity, CSS token references/cycles, and component colors. Website-only reading scale remains in `site-tokens.css`.

This static repository serves the existing `briefloop.ai` GitHub Pages site. No deployment workflow is checked in; confirm the repository Pages settings before an authorized production publication. Pushing a candidate branch or building locally is not a deployment. Do not change `CNAME` or release metadata as part of design work.
