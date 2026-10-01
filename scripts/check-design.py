#!/usr/bin/env python3
"""Dependency-free checks for the shared v3.1 website design contract."""
from pathlib import Path
import hashlib, json, re
ROOT = Path(__file__).resolve().parents[1]
errors = []
manifest = json.loads((ROOT / 'content/design-source.json').read_text())
for name, record in manifest['files'].items():
    digest = hashlib.sha256((ROOT / name).read_bytes()).hexdigest()
    if digest != record['sha256']:
        errors.append(f'{name}: differs from the pinned product design source')
styles = [*ROOT.glob('*.css'), ROOT/'docs/docs.css', ROOT/'reports/sample.css']
pages = [ROOT/'index.html', ROOT/'en.html', *ROOT.glob('how-it-works*.html')]
css = '\n'.join(p.read_text() for p in styles)
css += '\n'.join(block for p in pages for block in re.findall(r'<style>(.*?)</style>', p.read_text(), re.S))
definitions = dict(re.findall(r'(--[\w-]+)\s*:\s*([^;}]+)', css))
for reference in set(re.findall(r'var\((--[\w-]+)', css)):
    if reference not in definitions:
        errors.append(f'Undefined CSS token: {reference}')
# Detect direct/indirect cycles that make entire values invalid at computed time.
def visit(name, stack):
    if name in stack:
        errors.append('CSS token cycle: ' + ' -> '.join([*stack, name]))
        return
    for dependency in re.findall(r'var\((--[\w-]+)', definitions.get(name, '')):
        visit(dependency, [*stack, name])
for name in definitions:
    visit(name, [])
for p in styles:
    if p.name == 'design-tokens.css':
        continue
    if re.search(r'#[0-9a-fA-F]{3,8}\b', p.read_text()):
        errors.append(f'{p.relative_to(ROOT)}: literal component color outside product tokens')
for p in pages:
    text = p.read_text()
    for block in re.findall(r'<style>(.*?)</style>', text, re.S):
        if re.search(r'#[0-9a-fA-F]{3,8}\b', block):
            errors.append(f'{p.name}: literal inline component color')
    if not ('site-header.css' in text or 'site-tokens.css' in text):
        errors.append(f'{p.name}: shared design styles missing')
    if '.cta-band{background:var(--accent-2)' in text:
        errors.append(f'{p.name}: oversized brand-color panel')
if (ROOT/'CNAME').read_text().strip() != 'briefloop.ai':
    errors.append('Unexpected domain change')
for error in sorted(set(errors)):
    print(error)
print(f'v{manifest["design_version"]} design: {len(manifest["files"])} pinned files, {len(definitions)} tokens; {len(set(errors))} errors.')
raise SystemExit(bool(errors))
