from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path('/home/nemo/projects/rk-vista-ridge')
SOURCE = ROOT / 'public/brand/rk-logo.png'
APP = ROOT / 'app'
QA = ROOT / 'qa'

source = Image.open(SOURCE).convert('RGBA')
# Isolate the standalone RK monogram. The horizontal wordmark and tagline are
# intentionally excluded because they collapse inside a 16–32 px browser tab.
monogram = source.crop((0, 0, 116, 105))
alpha = monogram.getchannel('A')
bbox = alpha.getbbox()
if not bbox:
    raise RuntimeError('RK monogram mask is empty')
mask = alpha.crop(bbox)

canvas_size = 512
canvas = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
draw = ImageDraw.Draw(canvas)
draw.rounded_rectangle((8, 8, 504, 504), radius=104, fill='#0c2b1a')

# Fit the actual letterform, not its old horizontal-logo canvas, into the square.
max_w, max_h = 390, 350
scale = min(max_w / mask.width, max_h / mask.height)
mark_size = (round(mask.width * scale), round(mask.height * scale))
mark_mask = mask.resize(mark_size, Image.Resampling.LANCZOS)
mark = Image.new('RGBA', mark_size, '#ffffff')
mark.putalpha(mark_mask)
position = ((canvas_size - mark_size[0]) // 2, (canvas_size - mark_size[1]) // 2 - 4)
canvas.alpha_composite(mark, position)

APP.mkdir(parents=True, exist_ok=True)
QA.mkdir(parents=True, exist_ok=True)
canvas.save(APP / 'icon.png', optimize=True)
canvas.resize((180, 180), Image.Resampling.LANCZOS).save(APP / 'apple-icon.png', optimize=True)
canvas.save(APP / 'favicon.ico', format='ICO', sizes=[(16, 16), (24, 24), (32, 32), (48, 48)])

# Human-review sheet showing the same mark at actual browser-tab scales.
preview = Image.new('RGB', (920, 280), '#e8ebe3')
pd = ImageDraw.Draw(preview)
for index, size in enumerate((16, 24, 32, 48, 64)):
    small = canvas.resize((size, size), Image.Resampling.LANCZOS)
    enlarged = small.resize((128, 128), Image.Resampling.NEAREST)
    x = 28 + index * 176
    preview.paste(enlarged.convert('RGB'), (x, 44))
    pd.text((x, 188), f'{size}px source', fill='#0c2b1a')
preview.save(QA / 'favicon-size-review.png', optimize=True)

print({
    'source_size': source.size,
    'monogram_bbox': bbox,
    'mark_size': mark_size,
    'outputs': [str(APP / 'favicon.ico'), str(APP / 'icon.png'), str(APP / 'apple-icon.png')],
})
