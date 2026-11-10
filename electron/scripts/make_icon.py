# -*- coding: utf-8 -*-
"""生成应用图标 build/icon.png（512×512，蓝底白“水”字）。"""
import os
from PIL import Image, ImageDraw, ImageFont

SIZE = 512
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'build', 'icon.png')

img = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))

# 圆角矩形遮罩
mask = Image.new('L', (SIZE, SIZE), 0)
md = ImageDraw.Draw(mask)
md.rounded_rectangle([16, 16, SIZE - 16, SIZE - 16], radius=112, fill=255)

# 蓝蓝渐变（#4c9aff -> #2a6fe0）
grad = Image.new('RGBA', (SIZE, SIZE))
gd = ImageDraw.Draw(grad)
for y in range(SIZE):
    t = y / (SIZE - 1)
    r = round(0x4C + (0x2A - 0x4C) * t)
    g = round(0x9A + (0x6F - 0x9A) * t)
    b = round(0xFF + (0xE0 - 0xFF) * t)
    gd.line([(0, y), (SIZE, y)], fill=(r, g, b, 255))
img.paste(grad, (0, 0), mask)

d = ImageDraw.Draw(img)
font_path = 'C:/Windows/Fonts/msyh.ttc'
if not os.path.exists(font_path):
    font_path = 'C:/Windows/Fonts/simhei.ttf'
font = ImageFont.truetype(font_path, 288)
text = '水'
box = d.textbbox((0, 0), text, font=font)
x = (SIZE - (box[2] - box[0])) / 2 - box[0]
y = (SIZE - (box[3] - box[1])) / 2 - box[1] - 8
d.text((x, y), text, font=font, fill=(255, 255, 255, 255))

os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT)
img.save(os.path.join(os.path.dirname(OUT), 'icon.ico'), sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
print('icon ->', os.path.abspath(OUT))
