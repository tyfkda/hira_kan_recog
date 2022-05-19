require 'nkf'
require 'json'

def jis2utf8(hex)
  escape = "\x1b\x24\x42"  # ESC $ B
  jis = escape + hex.scan(/[0-9a-fA-F]{2}/).map{|x| x.hex}.pack('C*')
  jis.force_encoding(Encoding::ISO2022_JP).encode(Encoding::UTF_8)
end

Dir.glob('images/0000/*.png').sort.each do |fn|
  if fn =~ /img([0-9A-Fa-f]+).png/
    hex = $1
    print jis2utf8(hex)
  end
end
puts ''
