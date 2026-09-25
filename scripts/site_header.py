"""Shared header markup for pages outside the home page (DESIGN.md navigation).

The home page keeps its own header; these pages take the same links, language
switch and download action. `prefix` leads from the page back to the site root.
"""
MENU_ICON='<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
LABELS={
 False:dict(home='index.html',docs='docs/index.html',downloads='downloads.html',nav='站点导航',product='产品',example='示例',guides='使用文档',
            releases='更新日志',download='下载桌面版',menu='打开菜单',lang='EN',lang_code='en',lang_name='EN · 切换到英文版'),
 True:dict(home='en.html',docs='docs/index.en.html',downloads='downloads.en.html',nav='Site navigation',product='Product',example='Example',guides='User guides',
           releases='Release notes',download='Download',menu='Open menu',lang='中文',lang_code='zh-CN',lang_name='中文 · Switch to Chinese'),
}
def head(prefix=''):
 return (f'<link rel="stylesheet" href="{prefix}site-header.css">'
         '<noscript><style>.menu-toggle{display:none!important}.nav-links{display:flex!important;flex-wrap:wrap;position:static!important}</style></noscript>')
def script(prefix=''):
 return f'<script src="{prefix}site-header.js" defer></script>'
def header(en,alternate,prefix='',current=None):
 """current names the section this page belongs to: example, guides or download."""
 t=LABELS[en];mark=lambda key:' aria-current="page"' if key==current else ''
 links=(f'<a href="{prefix}{t["home"]}#why">{t["product"]}</a><a href="{prefix}{t["home"]}#report-example"{mark("example")}>{t["example"]}</a>'
        f'<a href="{prefix}{t["docs"]}"{mark("guides")}>{t["guides"]}</a><a href="https://github.com/Stahl-G/briefloop/releases">{t["releases"]}</a>')
 return (f'<header class="nav"><div class="wrap nav-inner"><a class="brand" href="{prefix}{t["home"]}"><img src="{prefix}assets/briefloop-mark.svg" alt=""><span>BriefLoop</span></a>'
         f'<nav class="nav-links" id="nav-links" aria-label="{t["nav"]}">{links}</nav><div class="nav-actions">'
         f'<a class="btn btn-ghost btn-sm lang-btn" href="{alternate}" hreflang="{t["lang_code"]}" aria-label="{t["lang_name"]}">{t["lang"]}</a>'
         '<a class="btn btn-ghost btn-sm" href="https://github.com/Stahl-G/briefloop" target="_blank" rel="noopener">GitHub ↗</a>'
         f'<a class="btn btn-ghost btn-sm" href="{prefix}{t["downloads"]}"{mark("download")}>{t["download"]}</a>'
         f'<button class="menu-toggle" id="menu-toggle" type="button" aria-label="{t["menu"]}" aria-expanded="false" aria-controls="nav-links">{MENU_ICON}</button></div></div></header>')
