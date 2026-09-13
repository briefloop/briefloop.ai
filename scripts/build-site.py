#!/usr/bin/env python3
"""Render static channel metadata and bilingual docs without network or dependencies."""
from pathlib import Path
import json, re, runpy
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'content/releases.json').read_text())
values={'desktop_version':data['desktop_version'],'pypi_version':data['pypi_version'], 'release_catalog':json.dumps({'version':data['desktop_version'],**{key:{field:asset[field] for field in ('ready','url','architecture')} for key,asset in data['assets'].items()}},ensure_ascii=False)}
for key,asset in data['assets'].items():
 values[key+'_url']=asset['url'];values[key+'_sha256']=asset['sha256'];values[key+'_mib']=f"{asset['bytes']/1024/1024:.2f}"
for source in (root/'content/templates').iterdir():
 text=source.read_text()
 for key,value in values.items(): text=text.replace('{{'+key+'}}',value)
 if re.search(r'\{\{[a-z_]+\}\}',text):raise ValueError(f'Unresolved metadata in {source.name}')
 (root/source.name).write_text(text)
runpy.run_path(str(root/'scripts/build-docs.py'),run_name='__main__')
print('Built static pages from content/templates and content/releases.json.')

manifest=root/'.well-known/briefloop-agent.json'
agent=json.loads(manifest.read_text())
agent['product']['version']=data['desktop_version']
agent['distribution']['package_index']['version']=data['pypi_version']
manifest.write_text(json.dumps(agent,ensure_ascii=False,indent=2)+'\n')
