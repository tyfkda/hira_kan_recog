#!/usr/bin/env python3

# Extract images from etl9g

from PIL import Image
import os
import struct
from tqdm import tqdm

W = 128
H = 127

def main():
    nrecords = 12144
    record_size = 8199
    count_dic = {}
    for root, dirs, files in os.walk('ETL9G'):
        for file in sorted(files):
            if file == 'ETL9INFO':
                continue
            filepath = os.path.join(root, file)
            print(filepath)

            with open(filepath, 'rb') as f:
                for rc_idx in tqdm(range(nrecords)):
                    f.seek(rc_idx * record_size)
                    s = f.read(64)  #record_size)
                    r = struct.unpack('>2H8sI4B4H2B34s', s)
                    # print(r)

                    pixels = f.read(8128)
                    # f.read(7)  # Uncertain

                    im = Image.new('L', (W, H))
                    for y in range(H):
                        for x in range(W):
                            c = pixels[y * (W // 2) + x // 2]
                            if x & 1 == 0:
                                c >>= 4
                            c &= 0x0f
                            # image[y][x] = (c << 4) | c
                            im.putpixel((x, y), (c << 4) | c)

                    code = r[1]
                    idx = 0 if not (code in count_dic) else count_dic[code]
                    count_dic[code] = idx + 1

                    dir_name = f"./images/{format(idx, '04d')}"
                    os.makedirs(dir_name, exist_ok=True)
                    im.save(os.path.join(dir_name, f"img{format(code, '04x')}.png"))

if __name__ == '__main__':
    main()
