#!/usr/bin/env python3
"""Optional: derive WebP copies of published screenshots. Requires Pillow.

The saved PNG/JPEG files stay published as fallbacks and at their historical
URLs; pages offer these smaller copies through <picture> for modern browsers.
The widest copy of each screenshot keeps its saved resolution.
"""
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]/'assets'
WIDTHS={'workbench-home-20260914.png':(800,1320,2640),'source-evidence.png':(800,1600),
        'report-document.png':(1053,),'tencent-report-workbench.png':(896,)}
for name,widths in WIDTHS.items():
 source=Image.open(ROOT/name).convert('RGB');stem=name.rsplit('.',1)[0]
 for width in widths:
  full=width==source.width
  image=source if full else source.resize((width,round(source.height*width/source.width)),Image.LANCZOS)
  target=ROOT/(f'{stem}.webp' if full else f'{stem}-{width}.webp')
  image.save(target,'WEBP',quality=82,method=6)
  print(f'{target.name}: {target.stat().st_size//1024} KiB')
