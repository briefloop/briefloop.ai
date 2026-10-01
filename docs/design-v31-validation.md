# Design v3.1 website candidate

Unpublished candidate for the existing briefloop.ai site. GitHub Pages settings were read through the existing GitHub identity: legacy Pages, main branch, root path, CNAME briefloop.ai. Only a candidate branch is pushed; no deployment, merge or release metadata update.

The supplied style bundle SHA256 matches 78f9c443febe4d4e09211b94693300de4d1701e4b52aaf6c6244866168fb75d1. Its base is aa7c006e and style tip is 648d5d4.

## Screenshots

The new product screenshot paths come from actual Chrome UI on product implementation commit cd53320, in an isolated workspace containing the software-provided synthetic weekly report. No model was called. Captions identify the prerelease UI and synthetic sample, and distinguish this screenshot from the linked historical Tencent report. Original historical screenshots, report documents, release manifest and CNAME remain intact. Image hashes and source are recorded in content/product-screenshots-v31.json; responsive WebP copies are generated with scripts/build-images.py.

## Validation

- Formal site build completed; 36 pages checked, zero link errors; design check zero errors; four download-selection tests passed.
- Actual desktop Chrome preview loaded the new logo, dark-blue styles and new product image. [Desktop evidence](visual-validation-v31/website-desktop-v31.jpg).
- Actual 390px Chrome preview showed the text report excerpt instead of shrinking a desktop screenshot; Chinese and English pages had no horizontal overflow. The mobile menu expanded through its actual control. The Chinese hero phrase stays together to avoid a single orphaned final character. [Mobile evidence](visual-validation-v31/website-mobile-v31.jpg). Temporary viewport override was reset.
- Native product installer and Microsoft Office visual verification remain outside these website checks. Pre-release screenshots do not represent a released installer version.
