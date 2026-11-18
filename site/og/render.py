"""Renders the social preview images and the touch icon into public/.

Run from site/ after the page title changes:  python3 og/render.py
Needs Python with Playwright and Pillow (pip install playwright pillow; playwright install chromium,
or CHROME=/path/to/chrome to use an installed one).
Not part of the build: the PNGs are committed.

The preview is the first screen in the dark theme: page title over the contour art,
and the address on a yellow block. It is read at ~350 px wide in messengers, so it holds
nothing smaller than the address.
"""
import base64
import json
import os
import re
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

SITE = Path(__file__).resolve().parent.parent
FONTS = SITE / 'src/assets/fonts'
OUT = SITE / 'public'
LANGS = ['en', 'fr', 'uk', 'ru']
ADDRESS = 'privacy.stevedevhere.com'

# the favicon mark: yellow tick on the ink square
TICK = '<path d="M9 16.5l4.5 4.5L23 11" stroke="#FFE15C" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
FAVICON = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#172033"/>{TICK}</svg>'

def font(name: str) -> str:
    return 'data:font/woff2;base64,' + base64.b64encode((FONTS / name).read_bytes()).decode()


FONT_CSS = ''.join(
    f'@font-face{{font-family:{family};src:url({font(f"{file}-{script}.woff2")});font-weight:{weight};unicode-range:{rng}}}'
    for family, file, weight in [('U', 'unbounded', '500 700'), ('G', 'golos-text', '400 700')]
    for script, rng in [('latin', 'U+0000-00FF,U+2000-206F'), ('cyrillic', 'U+0400-045F,U+0490-0491')]
)

CSS = FONT_CSS + """
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:#0C1119;color:#E7EAF1;position:relative}
.art{position:absolute;right:-170px;top:60px;width:1300px;height:680px;opacity:.85}
.art svg{width:100%;height:100%}
.art path{fill:none;stroke:#93A6FF;stroke-width:1.3;opacity:.3}.art path.e{opacity:.62}
h1{position:absolute;left:60px;top:64px;right:50px;max-width:1090px;font:600 84px/1.02 U;letter-spacing:-.03em;text-wrap:balance}
.address{position:absolute;left:60px;bottom:60px;display:flex;gap:16px;align-items:center;font:600 36px G;color:#172033;background:#FFE15C;border-radius:18px;padding:16px 26px 16px 18px}
.address svg{width:46px;height:46px}
"""


def title(lang: str) -> str:
    text = json.loads((SITE / f'src/i18n/{lang}.json').read_text())['header']['title']
    # a dash never starts a line
    return re.sub(r'<[^>]+>', '', text).replace(' —', ' —')


def contours() -> str:
    source = (SITE / 'src/components/HeroContours.astro').read_text()
    return source[source.index('<svg'):source.rindex('</svg>') + 6]


def shrink(path: Path):
    # flat colours: a 256-colour palette keeps the image sharp at a third of the size
    Image.open(path).convert('RGB').quantize(256, dither=Image.Dither.NONE).save(path, optimize=True)


def main():
    (OUT / 'og').mkdir(exist_ok=True)
    (OUT / 'favicon.svg').write_text(FAVICON + '\n')
    art = contours()
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROME'))  # CHROME: use an installed browser
        page = browser.new_page(viewport={'width': 1200, 'height': 630})
        for lang in LANGS:
            html = f'<!doctype html><html lang="{lang}"><meta charset="utf-8"><style>{CSS}</style><body><div class="art">{art}</div><h1>{title(lang)}</h1><div class="address">{FAVICON}{ADDRESS}</div></body></html>'
            page.set_content(html)
            page.evaluate('document.fonts.ready')
            path = OUT / 'og' / f'{lang}.png'
            page.screenshot(path=str(path))
            shrink(path)
        # iOS fills the corners itself, so the touch icon is the square without its rounding
        page.set_viewport_size({'width': 180, 'height': 180})
        page.set_content(f'<body style="margin:0"><svg viewBox="0 0 32 32" width="180" height="180"><rect width="32" height="32" fill="#172033"/>{TICK}</svg></body>')
        page.screenshot(path=str(OUT / 'apple-touch-icon.png'))
        browser.close()


if __name__ == '__main__':
    main()
