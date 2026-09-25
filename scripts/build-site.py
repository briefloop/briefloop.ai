#!/usr/bin/env python3
"""Render static channel metadata and bilingual docs without network or dependencies."""
from pathlib import Path
import html, json, re, runpy, sys
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'scripts'))
import site_header
data=json.loads((root/'content/releases.json').read_text())
values={'desktop_version':data['desktop_version'],'pypi_version':data['pypi_version'], 'release_catalog':json.dumps({'version':data['desktop_version'],**{key:{field:asset[field] for field in ('ready','url','architecture')} for key,asset in data['assets'].items()}},ensure_ascii=False)}
values.update(site_header_head=site_header.head(),site_header_script=site_header.script(),
 downloads_header=site_header.header(False,'downloads.en.html',current='download'),
 downloads_header_en=site_header.header(True,'downloads.html',current='download'))
# Phones read the home report example as text (DESIGN.md). Every quoted word comes
# from the saved Markdown export; this build selects, it never writes report text.
sample=(root/'assets/samples/tencent-2026-08/report.md').read_text().splitlines()
start=sample.index('| 指标（未经审核） | 2Q2026 | 1H2026 |')
baseline={}
for line in sample[start+2:]:
 if not line.startswith('|'):break
 cells=[c.strip() for c in line.strip().strip('|').split('|')];baseline[cells[0]]=cells[1:]
note=next(line for line in sample if line.startswith('下表为最近已披露基线'))
unit,period='金额为人民币亿元（百万元÷100）','这是季度与半年度数据，不代表2026年8月单月表现。'
if unit not in note or period not in note:raise ValueError('Saved report baseline note changed; update the home excerpt')
rows=''.join(f'<tr><th scope="row">{html.escape(k)}</th><td>{html.escape(baseline[k][0])}</td><td>{html.escape(baseline[k][1])}</td></tr>'
             for k in ('收入','资本开支','经营活动现金净额','自由现金流（含预付款口径）','自由现金流（剔除算力采购预付款）'))
quote=(f'<blockquote cite="reports/tencent-2026-08.html" lang="zh-CN"><p class="excerpt-title">{html.escape(sample[0].lstrip("# "))}</p>'
       f'<p>{html.escape(next(line[3:] for line in sample if line.startswith("1. ")))}</p><table><caption>最近披露的经营基线（节选）</caption>'
       f'<thead><tr><th scope="col">指标（未经审核）</th><th scope="col">2Q2026</th><th scope="col">1H2026</th></tr></thead><tbody>{rows}</tbody></table>'
       f'<p class="excerpt-note">{unit}。{period}</p></blockquote>')
values['sample_excerpt']=(f'<figure class="shot report-excerpt"><p class="excerpt-kicker">已保存报告 · 正文节选</p>{quote}'
 '<figcaption><span class="badge">真实产物</span><span>节选自已保存报告，非腾讯官方报告</span><a href="reports/tencent-2026-08.html">阅读全文 →</a></figcaption></figure>')
values['sample_excerpt_en']=(f'<figure class="shot report-excerpt"><p class="excerpt-kicker">SAVED REPORT · CHINESE EXCERPT</p>{quote}'
 '<figcaption><span class="badge">Saved output</span><span>Excerpt from a saved report; not an official Tencent publication</span><a href="reports/tencent-2026-08.en.html">Read it in full →</a></figcaption></figure>')
for key,asset in data['assets'].items():
 values[key+'_version']=asset.get('version',data['desktop_version'])
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
