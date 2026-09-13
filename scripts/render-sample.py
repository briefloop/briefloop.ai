#!/usr/bin/env python3
"""Render a saved BriefLoop Markdown export; never generate or alter report prose.
Run with a Python environment containing markdown-it-py 4.2.0.
Input directory must contain report.md, report.docx and public-metadata.json.
"""
from pathlib import Path
import argparse,hashlib,html,json,shutil
from markdown_it import MarkdownIt
p=argparse.ArgumentParser();p.add_argument('input',type=Path);p.add_argument('--slug',required=True);a=p.parse_args()
if not a.slug.replace('-','').isalnum():raise ValueError('Use a simple public slug')
root=Path(__file__).resolve().parents[1];meta=json.loads((a.input/'public-metadata.json').read_text())
required={'title','version_id','model','source_commit','generation','review_status','limitations','human_changes'}
if not required.issubset(meta):raise ValueError('Missing generation or review metadata')
for name in ('report.md','report.docx'):
 if not (a.input/name).is_file():raise ValueError(f'Missing actual export {name}')
text=(a.input/'report.md').read_text()
if '/Users/' in text or '[@src_' in text:raise ValueError('Export contains local paths or unresolved source IDs')
rendered=MarkdownIt('commonmark',{'html':False}).enable('table').render(text)
rendered=rendered.replace('<table>','<div class="table-scroll" tabindex="0" role="region" aria-label="Report table"><table>').replace('</table>','</table></div>')
out=root/'assets/samples'/a.slug;out.mkdir(parents=True,exist_ok=True)
for name in ('report.md','report.docx'):shutil.copyfile(a.input/name,out/name)
meta['exports']={name:{'sha256':hashlib.sha256((out/name).read_bytes()).hexdigest()} for name in ('report.md','report.docx')}
(out/'metadata.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
e=html.escape
for en in (False,True):
 suffix='.en' if en else '';language='en' if en else 'zh-CN';file=f'{a.slug}{suffix}.html'
 description='Saved BriefLoop report · Chinese text · public-source example, not an official Tencent publication.' if en else 'BriefLoop 已保存报告 · 基于公开资料的阅读场景示例，非腾讯官方出品。'
 labels=[('Generated with' if en else '生成方式',meta['generation']),('Model' if en else '模型',meta['model']),('Code snapshot' if en else '代码快照',meta['source_commit']),('Human input' if en else '人工介入',meta['human_changes']),('Review status' if en else '审阅状态',meta['review_status']),('Limits' if en else '核查边界',meta['limitations'])]
 rows=''.join(f'<dt>{label}</dt><dd>{e(value)}</dd>' for label,value in labels)
 page=f'''<!doctype html><html lang="{language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(meta['title'])} · BriefLoop</title><link rel="icon" href="../assets/briefloop-icon.svg"><link rel="canonical" href="https://briefloop.ai/reports/{file}"><link rel="stylesheet" href="sample.css"></head><body><header><a class="brand" href="../{'en' if en else 'index'}.html">BriefLoop</a><nav><a href="../docs/index{suffix}.html">{'Guides' if en else '使用文档'}</a><a href="../downloads{suffix}.html">{'Download' if en else '下载'}</a><a href="{a.slug}{'' if en else '.en'}.html">{'中文' if en else 'EN'}</a></nav></header><main><p class="eyebrow">{'SAVED REPORT EXAMPLE' if en else '已保存报告示例'}</p><p>{description}</p><div class="downloads"><a href="../assets/samples/{a.slug}/report.docx" download>{'Download Word' if en else '下载 Word'}</a><a href="../assets/samples/{a.slug}/report.md" download>Markdown</a></div><details open><summary>{'Generation and review record' if en else '生成与核查记录'}</summary><dl>{rows}</dl><p class="version">{'Saved version' if en else '保存版本'}: {e(meta['version_id'])}</p></details><article lang="zh-CN">{rendered}</article><footer>{'This page displays a saved report and does not run a model or access visitor files.' if en else '本页展示已保存产物，不运行模型，也不读取访客文件。'}</footer></main></body></html>'''
 (root/'reports'/file).write_text(page)
print(f'Rendered {a.slug}; original Markdown and Word bytes preserved.')
