#!/usr/bin/env python3

# Generate .npz from .png images.

from PIL import Image
import numpy as np
from pathlib import Path
import zipfile
import os

SZ = 48
NCLASS = 956
FILENAME = f'./etl8b{SZ}.npz'

# print(np.__version__)

def load_png_image_as_np(file, size):
    plimg = Image.open(str(file))
    if plimg.mode == '1':  # Black/white
        plimg = plimg.convert('L')  # To grayscale
    plimg = plimg.resize((size, size))
    npimg = np.array(plimg)
    assert(npimg.dtype == 'uint8')
    npimg.resize((size, size, 1))
    return npimg

def load_png_images(dir):
    files = list(dir.glob('*.png'))
    assert len(files)
    files.sort()

    images = []
    for file in files:
        images.append(load_png_image_as_np(file, SZ))
    return images

def convert():
    dirs = [d for d in Path('images').glob('*') if d.is_dir()]
    dirs.sort()

    x = []
    for dir in dirs:
        images = load_png_images(dir)
        assert len(images) == NCLASS
        x.append(np.array(images))
    np.savez(FILENAME, x=np.array(x))

    with zipfile.ZipFile(f'./etl8b{SZ}.zip', 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        zf.write(FILENAME)
    # os.remove(FILENAME)

def confirm():
    data = np.load(FILENAME)
    print(data['x'].shape)

if __name__ == '__main__':
    convert()
    # confirm()
