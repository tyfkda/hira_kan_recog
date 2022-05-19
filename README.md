ブラウザ上でひらがな・漢字文字認識

## 学習モデル作成

### 文字認識モデルの学習

Google Colaboratoryで学習する。

  1. ツールで生成した手書き文字データ `etl8b48.zip` をGoogle Drive直下にアップロード
  2. Google Colaboratory で学習
  3. tfjsmodel.zip がダウンロードされる


## ツール関連

### データ変換

#### 環境準備

```sh
$ bundle install
$ pip install -r requirements.txt
```

#### データのダウンロード

ETL8B をダウンロード、.zipファイルを展開する。

#### 変換

1. PNG画像に変換

```sh
$ bundle exec ruby conv_elt8b.rb
```

`images/` 以下に.pngファイルが出力される。

2. PNG画像を.npzに変換

```sh
$ python3 gen_data.py
```

`etl8b48.zip` が出力される。


### 使用されている文字の出力

データの変換で `images/` 以下にPNGが生成された状態で

```sh
$ bundle exec ruby jis2utf8.rb
```
