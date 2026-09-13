#!/usr/bin/env python3
"""Check built-page links and channel parity without fetching third-party sites."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json
root=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set()
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k in ('href','src') and v:self.links.append(v)
   if k=='id':self.ids.add(v)
pages=[root/x for x in ('index.html','en.html','downloads.html','downloads.en.html')]+list((root/'docs').glob('*.html'))+list((root/'reports/technical-report-v2').glob('*.html'))+list((root/'reports').glob('tencent-*.html'))
errors=[]
for p in pages:
 parsed=Page();parsed.feed(p.read_text())
 for link in parsed.links:
  u=urlsplit(link)
  if u.scheme or u.netloc or not u.path:continue
  dest=(root/u.path.lstrip('/')) if u.path.startswith('/') else p.parent/unquote(u.path)
  if not dest.exists():errors.append(f'{p.relative_to(root)}: missing {link}')
release=json.loads((root/'content/releases.json').read_text())
for name in ('downloads.html','downloads.en.html'):
 text=(root/name).read_text()
 for a in release['assets'].values():
  for expected in (a['url'],a['sha256']):
   if expected not in text:errors.append(f'{name}: missing release metadata {expected}')
for en in (False,True):
 suffix='.en' if en else ''
 index=json.loads((root/f'docs/search-index{suffix}.json').read_text())
 if len(index)!=8:errors.append('Expected eight searchable guides per language')
for error in errors:print(error)
print(f'{len(pages)} built pages checked; {len(errors)} errors.')
raise SystemExit(bool(errors))
