# -*- coding: utf-8 -*-
# ELT8Bのコンバート
require 'chunky_png'
require 'fileutils'

HEADER_SIZE = 8
W = 64
H = 63

HEADER_STRUCT = {
  :serial_sheet_number => 2,
  :jis_code => 2,
  :jis_typical_reading => 4,
}

def read_header(f)
  buf = f.read(HEADER_SIZE).unpack('C*')

  header = {}
  index = 0
  HEADER_STRUCT.each do |key, count|
    x = 0
    count.times do |i|
      x = (x << 8) | buf[index + i]
    end
    header[key] = x
    index += count
  end
  return header
end

def read1chr(f)
  header = read_header(f)
  img = f.read(W * H / 8).unpack('C*')
  return header, img
end


def main
  file_names = ['./ETL8B/ETL8B2C1', './ETL8B/ETL8B2C2', './ETL8B/ETL8B2C3']
  counts = Hash.new { 0 }
  file_names.each do |fn|
    File.open(fn, 'r') do |f|
      f.read(512)  # Skip dummy
      until f.eof?
        header, img = read1chr(f)

        png = ChunkyPNG::Image.new(W, H, ChunkyPNG::Color::TRANSPARENT)
        H.times do |i|
          W.times do |j|
            c = (img[i * (W / 8) + j / 8] >> (7 - (j & 7))) & 1
            a = (c * 255.0 / 1).to_i
            png[j, i] = ChunkyPNG::Color.rgba(a, a, a, 255)
          end
        end
        chr = header[:jis_code]
        index = counts[chr]
        counts[chr] += 1

        dir = sprintf('images/%04d', index)
        unless File.exists?(dir)
          FileUtils.mkdir_p(dir)
        end
        fn = sprintf('%s/img%04x.png', dir, chr)
        png.save(fn)
      end
    end
  end
end

if $0 == __FILE__
  main
end
