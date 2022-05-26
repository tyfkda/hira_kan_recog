#!/usr/bin/env python3

# Generate .npz from .png images.

from PIL import Image
import numpy as np
from pathlib import Path
import os
import random
import subprocess
from tqdm import tqdm

SZ = 64
NCLASS = 3036

BATCH_SIZE = 256

# W = 128
# H = 127
# WW = 90

# CROP_START = (
#     (W - WW) * 11 // 16,
#     (H - WW) * 7 // 16)

DST_DIR = 'data'

ZIP_FILENAME = f'./etl9b{SZ}.zip'

# print(np.__version__)

def load_png_image_as_np(file, size):
    plimg = Image.open(str(file))
    if plimg.mode == '1':  # Black/white
        plimg = plimg.convert('L')  # To grayscale
    # plimg = plimg.crop((CROP_START[0], CROP_START[1], CROP_START[0] + WW, CROP_START[1] + WW))
    plimg = plimg.resize((size, size))

    npimg = np.array(plimg)
    assert(npimg.dtype == 'uint8')

    # mul = 255 * 2 / np.max(npimg)  # てきとうに明るくする
    # npimg = (npimg * mul).clip(0, 255).astype('uint8')

    # 確認用
    # converted = Image.fromarray(npimg)
    # converted.save(f",test/{file.name}")

    return npimg.reshape((size, size, 1))

def pack_images(name, all_files, start, count):
    dir_name = f"{DST_DIR}/{name}"
    os.makedirs(dir_name, exist_ok=True)

    npz_files = []
    for i in tqdm(range(count)):
        images = []
        labels = []
        for file, label in all_files[(i + start) * BATCH_SIZE: (i + 1 + start) * BATCH_SIZE]:
            images.append(load_png_image_as_np(file, SZ))
            labels.append(label)

        npz_fn = f"{dir_name}/{format(i, '04d')}.npz"
        np.savez(npz_fn, x=np.array(images), y=np.array(labels))
        npz_files.append(npz_fn)

    with open(f"{DST_DIR}/{name}.txt", 'w') as f:
        f.write('\n'.join(npz_files))

def zip_files(name):
    subprocess.run(f"zip -r '{ZIP_FILENAME}' '{DST_DIR}' -x .DS_Store", shell=True)

def convert():
    dirs = [d for d in Path('images').glob('*') if d.is_dir()]
    random.shuffle(dirs)
    all_files = []
    for dir in dirs:
        files = list(dir.glob('*.png'))
        assert len(files) == NCLASS
        files.sort()
        file_labels = list(zip(files, range(NCLASS)))
        all_files = all_files + file_labels
    random.shuffle(all_files)

    batch_count = len(all_files) // BATCH_SIZE
    test_count = batch_count // 10
    valid_count = batch_count // 15
    train_count = batch_count - (test_count + valid_count)
    pack_images('train', all_files, 0, train_count)
    pack_images('valid', all_files, train_count, valid_count)
    pack_images('test', all_files, train_count + valid_count, test_count)

    zip_files(ZIP_FILENAME)
    return

def confirm():
    data = np.load('data/train/0000.npz')
    print(data['x'].shape)
    print(data['y'].shape)
    print(data['y'])

if __name__ == '__main__':
    convert()
    # confirm()
