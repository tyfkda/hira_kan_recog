import struct
from PIL import Image
import os
from tqdm import tqdm

def main():
    nrecords = 121440
    record_size = 576
    count_dic = {}
    for root, dirs, files in os.walk('ETL9B'):
        for file in sorted(files):
            if file == 'ETL9INFO':
                continue
            filepath = os.path.join(root, file)
            print(file)

            with open(filepath, 'rb') as f:
                for rc_idx in tqdm(range(nrecords)):
                    f.seek((rc_idx + 1) * record_size)
                    s = f.read(record_size)
                    r = struct.unpack('>2H4s504s64x', s)
                    im = Image.frombytes('1', (64, 63), r[3], 'raw')

                    code = r[1]
                    idx = 0 if not (code in count_dic) else count_dic[code]
                    count_dic[code] = idx + 1

                    dir_name = f"./images/{format(idx, '04d')}"
                    os.makedirs(dir_name, exist_ok=True)
                    im.save(os.path.join(dir_name, f"img{format(code, '04x')}.png"), 'PNG')

if __name__ == '__main__':
    main()
