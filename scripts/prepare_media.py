#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import shutil
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / 'public/media'
BRAND = ROOT / 'public/brand'
DOCS = ROOT / 'docs'
MEDIA.mkdir(parents=True, exist_ok=True)
BRAND.mkdir(parents=True, exist_ok=True)
DOCS.mkdir(parents=True, exist_ok=True)

config_path = os.environ.get('RK_MEDIA_CONFIG')
if not config_path:
    raise RuntimeError(
        'RK_MEDIA_CONFIG must point to a private JSON config containing '
        'candidate_dir, dark_logo, light_logo, and the approved source mapping.'
    )
private_config = json.loads(Path(config_path).read_text())
CANDIDATES = Path(private_config['candidate_dir'])
DARK_LOGO = Path(private_config['dark_logo'])
LIGHT_LOGO = Path(private_config['light_logo'])
SOURCES = private_config['sources']


def open_rgb(name: str) -> Image.Image:
    path = CANDIDATES / SOURCES[name]
    if not path.exists():
        raise FileNotFoundError(path)
    return Image.open(path).convert('RGB')


def enhance_documentary(im: Image.Image) -> Image.Image:
    """Conservative clarity pass only: no generative pixels or facility changes."""
    im = ImageEnhance.Contrast(im).enhance(1.035)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.35, percent=125, threshold=3))
    return im


def save_webp(name: str, target_width: int = 1920, quality: int = 89) -> Path:
    im = open_rgb(name)
    if im.width != target_width:
        h = round(im.height * target_width / im.width)
        im = im.resize((target_width, h), Image.Resampling.LANCZOS)
    im = enhance_documentary(im)
    out = MEDIA / f'{name}.webp'
    im.save(out, 'WEBP', quality=quality, method=6)
    return out


def make_hero_mobile() -> Path:
    im = open_rgb('hero')
    cropped = ImageOps.fit(im, (1080, 1350), method=Image.Resampling.LANCZOS,
                           centering=(0.68, 0.48))
    cropped = enhance_documentary(cropped)
    out = MEDIA / 'hero-mobile.webp'
    cropped.save(out, 'WEBP', quality=88, method=6)
    return out


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    choices = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
    ]
    for candidate in choices:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


def make_og() -> Path:
    base = ImageOps.fit(open_rgb('hero'), (1200, 630), method=Image.Resampling.LANCZOS,
                        centering=(0.63, 0.5))
    arr = np.asarray(base).astype(np.float32)
    x = np.linspace(0.12, 0.86, base.width, dtype=np.float32)
    alpha = np.tile(x, (base.height, 1))[..., None]
    dark = np.zeros_like(arr)
    dark[..., 0] = 8
    dark[..., 1] = 24
    dark[..., 2] = 18
    arr = arr * alpha + dark * (1 - alpha)
    card = Image.fromarray(np.uint8(np.clip(arr, 0, 255)))
    draw = ImageDraw.Draw(card)
    draw.text((64, 90), 'RK LOGISTICS GROUP', font=font(24, True), fill=(185, 211, 141))
    draw.text((64, 160), 'VISTA RIDGE', font=font(76, True), fill='white')
    draw.text((64, 255), 'Specialized industrial space', font=font(37), fill=(244, 246, 239))
    draw.text((64, 305), 'in the Texas Innovation Corridor', font=font(37), fill=(244, 246, 239))
    draw.rounded_rectangle((64, 425, 354, 489), radius=6, fill=(113, 164, 70))
    draw.text((88, 441), 'REQUEST A TOUR', font=font(22, True), fill='white')
    out = MEDIA / 'vista-ridge-og.jpg'
    card.save(out, 'JPEG', quality=90, optimize=True)
    return out


def make_video() -> Path:
    images = [MEDIA / f'{name}.webp' for name in ['loading', 'truck-court', 'facade', 'arrival']]
    for p in images:
        if not p.exists():
            raise FileNotFoundError(p)
    out = MEDIA / 'vista-ridge-exterior-film.mp4'
    cmd = ['ffmpeg', '-y', '-v', 'error']
    for p in images:
        cmd += ['-loop', '1', '-t', '5', '-i', str(p)]
    filters = []
    zooms = ['0.00022', '0.00016', '0.00019', '0.00015']
    for i, z in enumerate(zooms):
        filters.append(
            f'[{i}:v]scale=1408:792:force_original_aspect_ratio=increase,'
            f'crop=1280:720,zoompan=z=\'min(zoom+{z},1.04)\':'
            f'x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':'
            f'd=150:s=1280x720:fps=30,format=yuv420p,setsar=1[v{i}]'
        )
    filters += [
        '[v0][v1]xfade=transition=fade:duration=1:offset=4[v01]',
        '[v01][v2]xfade=transition=fade:duration=1:offset=8[v012]',
        '[v012][v3]xfade=transition=fade:duration=1:offset=12,'
        'fade=t=in:st=0:d=0.6,fade=t=out:st=16:d=0.8[vout]',
    ]
    cmd += [
        '-filter_complex', ';'.join(filters),
        '-map', '[vout]', '-t', '16.8', '-an',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '22',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(out),
    ]
    subprocess.run(cmd, check=True)
    return out


def main() -> None:
    generated = []
    large_media = {'hero', 'interior-wide', 'interior-volume', 'loading', 'office'}
    for name in SOURCES:
        generated.append(save_webp(name, target_width=3200 if name in large_media else 1920, quality=92 if name == 'hero' else 90 if name in large_media else 89))
    generated.append(make_hero_mobile())
    generated.append(make_og())

    shutil.copy2(DARK_LOGO, BRAND / 'rk-logo.png')
    shutil.copy2(LIGHT_LOGO, BRAND / 'rk-logo-white.png')
    generated += [BRAND / 'rk-logo.png', BRAND / 'rk-logo-white.png']
    generated.append(make_video())

    manifest = {
        'source_count': len(SOURCES),
        'source_classes': ['exterior', 'loading', 'warehouse', 'support-space'],
        'generated': [
            {'path': str(p.relative_to(ROOT)), 'bytes': p.stat().st_size}
            for p in generated
        ],
        'policy': 'All facility imagery derives from executive-authorized real property footage. Private source filenames remain outside the public repository.',
    }
    (DOCS / 'media-manifest.json').write_text(json.dumps(manifest, indent=2))
    print(json.dumps({'generated_count': len(generated),
                      'total_bytes': sum(p.stat().st_size for p in generated)}, indent=2))


if __name__ == '__main__':
    main()
