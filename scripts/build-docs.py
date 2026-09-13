#!/usr/bin/env python3
"""Build the curated, bilingual public guides. No private directory imports."""
from pathlib import Path
import json, html
ROOT=Path(__file__).resolve().parents[1]
e=html.escape
release=json.loads((ROOT/'content/releases.json').read_text())
desktop=e(release['desktop_version'])
items=json.loads((ROOT/'content/docs.json').read_text())
out=ROOT/'docs';out.mkdir(exist_ok=True)
for en in (False,True):
 suffix='.en' if en else '';lang='en' if en else 'zh-CN'
 def link(slug): return f'{slug}{suffix}.html'
 def shell(title,body,slug='index'):
  nav=''.join(f'<a href="{link(x[0])}"'+(' aria-current="page"' if x[0]==slug else '')+f'>{e(x[2 if en else 1])}</a>' for x in items)
  alternate=f'{slug}{"" if en else ".en"}.html'
  return f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)} · BriefLoop</title><meta name="description" content="{e(title)} — {'Practical BriefLoop guides for installation, reports, sources and data.' if en else 'BriefLoop 可操作的安装、写作、依据和数据使用指南。'}"><link rel="icon" href="../assets/briefloop-icon.svg"><link rel="stylesheet" href="docs.css"><link rel="canonical" href="https://briefloop.ai/docs/{link(slug)}"><link rel="alternate" hreflang="zh-CN" href="https://briefloop.ai/docs/{slug}.html"><link rel="alternate" hreflang="en" href="https://briefloop.ai/docs/{slug}.en.html"></head><body><a class="skip" href="#content">{'Skip to content' if en else '跳到正文'}</a><header><a class="brand" href="../{'en' if en else 'index'}.html"><img src="../assets/briefloop-mark.svg" alt="">BriefLoop</a><nav aria-label="{'Site' if en else '站点'}"><a href="{link('index')}">{'Guides' if en else '使用文档'}</a><a href="../downloads{suffix}.html">{'Download' if en else '下载'}</a><a href="{alternate}" lang="{'zh-CN' if en else 'en'}">{'中文' if en else 'EN'}</a></nav></header><div class="layout"><aside><p class="eyebrow">{'USER GUIDES' if en else '使用文档'}</p><nav aria-label="{'Guide topics' if en else '文档目录'}">{nav}</nav></aside><main id="content">{body}</main></div><footer>BriefLoop · <a href="../downloads{suffix}.html">{'Published installers and requirements' if en else '已发布安装包与要求'}</a> · <a href="https://github.com/Stahl-G/briefloop/releases">{'Release notes' if en else '发行说明'}</a><p>{'Workspaces stay local. Cloud models and search services receive relevant content when used.' if en else '工作区保存在本地；调用云端模型或搜索时，相关内容会发送给你选择的服务。'}</p></footer><script src="search.js" defer></script></body></html>'''
 search=[]
 for x in items:
  slug,zh,eng,desczh,descen,stepszh,stepsen,okzh,oken,errzh,erren=x
  title=eng if en else zh;desc=descen if en else desczh;steps=stepsen if en else stepszh;ok=oken if en else okzh;err=erren if en else errzh
  scope=(f'Applies to desktop {desktop} and the 0.20.x service. Labels and capabilities vary by channel; the installer version is authoritative. Development features are not implied.' if en else f'适用于桌面 {desktop} 与 0.20.x 服务的基本流程。按钮与能力因渠道不同，以所装版本为准；不代表开发中功能已经随安装包发布。')
  body=f'<p class="eyebrow">BRIEFLOOP / {"GUIDES" if en else "使用指南"}</p><h1>{e(title)}</h1><p class="lead">{e(desc)}</p><p class="scope">{scope}</p><h2>{"Before you start" if en else "前置条件"}</h2><p>{"Use a workspace you can back up. Model tasks require an authenticated runtime and permission to process the chosen materials." if en else "准备可备份的工作区；需要模型的操作须先完成宿主认证，并确认材料允许交给所选服务处理。"}</p><h2>{"Steps" if en else "操作步骤"}</h2><ol>'+''.join(f'<li>{e(s)}</li>' for s in steps)+f'</ol><h2>{"What success looks like" if en else "成功后应该看到什么"}</h2><p>{e(ok)}</p><h2>{"If something goes wrong" if en else "失败与边界"}</h2><p>{e(err)}</p><p class="next"><a href="{link("index")}">← {"All guides" if en else "全部文档"}</a> · <a href="../downloads{suffix}.html">{"Installation options" if en else "选择安装方式"} →</a></p>'
  (out/link(slug)).write_text(shell(title,body,slug))
  search.append({'title':title,'url':link(slug),'text':' '.join([desc,*steps,ok,err])})
 cards=''.join(f'<li data-guide><a href="{link(x[0])}"><h2>{e(x[2 if en else 1])}</h2><p>{e(x[4 if en else 3])}</p></a></li>' for x in items)
 title='User guides' if en else '使用文档'
 body=f'<p class="eyebrow">BRIEFLOOP / {"GET STARTED" if en else "从第一份报告开始"}</p><h1>{title}</h1><p class="lead">{"Install, create a draft, check its sources and export a document. Start with the task you need to complete." if en else "安装、成稿、看依据、导出。按你现在要完成的事情查找步骤。"}</p><div data-search hidden><label for="guide-search">{"Search these guides" if en else "搜索使用文档"}</label><input id="guide-search" type="search" placeholder="{"Python, Word, costs…" if en else "Python、Word、费用…"}" autocomplete="off"><p class="muted">{"Search runs locally in this browser. No queries are sent to a service." if en else "搜索在浏览器本地进行，不向服务发送关键词。"}</p><p id="search-status" role="status"></p><ul id="search-results"></ul></div><ul class="guide-grid">{cards}</ul>'
 (out/link('index')).write_text(shell(title,body))
 (out/f'search-index{suffix}.json').write_text(json.dumps(search,ensure_ascii=False))
print('Built 18 guide pages and two local search indexes.')
