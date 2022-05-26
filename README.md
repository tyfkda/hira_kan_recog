ブラウザ上でひらがな・漢字文字認識

## 学習モデル作成

### 文字認識モデルの学習

Google Colaboratoryで学習する。

  1. ツールで生成した手書き文字データ `etl8b64.zip` をGoogle Drive直下にアップロード
  2. Google Colaboratory で学習
  3. tfjsmodel.zip がダウンロードされる


## ツール関連

### データ変換

#### 環境準備

```sh
$ pip install -r requirements.txt
```

#### データのダウンロード

ETL9B をダウンロード、.zipファイルを展開する。

#### 変換

1. PNG画像に変換

```sh
$ python3 extract_etl9b.py
```

`images/` 以下に.pngファイルが出力される。

2. PNG画像を.npzに変換

```sh
$ python3 gen_9b_npz.py
```

`etl8b64.zip` が出力される。


### 使用されている文字の出力

データの変換で `images/` 以下にPNGが生成された状態で

```sh
$ bundle exec ruby jis2utf8.rb
```


### 解説

[転移学習で手書きのひらがな・漢字認識 - Kludge Factory](https://tyfkda.github.io/blog/2022/05/26/hira-kan-recog.html)


### 参考

  * [ETL文字データベース](http://etlcdb.db.aist.go.jp/?lang=ja)
  * [etlcdb(ETL文字データベース)のETL9Bから画像を抽出するスクリプトを書いた - ごはんと飲み物は紙一重](https://twdlab.hatenablog.com/entry/2018/07/03/205518)
