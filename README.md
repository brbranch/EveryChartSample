# EveryChartSample
EveryChart( https://www.everychart.site ) のリリース前のソースコードです

## 注意
バックエンドはセキュリティの問題上中途半端な状態で公開してます（大事な部分は消しちゃってます）
ただ、トップまでは動かすことはできると思います。

## 環境構築
### requirement
* Google Cloud SDK (253.0.0)
    * firestore emuratorも入れる
* go1.9.7
* goapp 1.9.4
* Firebase SDK
* dep (最新でいいと思う)
* direnv (最新でいいと思う)

### 最初だけ行う
```bash
$ git submodule update --init --recursive
$ cd ./backend
$ direnv allow // direnvを有効にする
$ cd ./src/project
$ dep ensure // 依存ライブラリのDL
```

### firestore emuratorの起動

```bash
$ gcloud beta emulators firestore start --host-port=localhost:8915
```

### バックエンド側のローカルサーバー起動
上記とは別のターミナルを開く。

```bash
$ cd ./backend
$ goapp serve local.yaml
```

### アクセス
ブラウザから `127.0.0.1:8080` を開くと見ることができると思います。

### フロントエンドのビルド
※ npm 6.9.0以上が入っていることが前提
バックエンドのローカルサーバーとfirestore emuratorは起動したままとします。

```bash
$ cd ./front
$ npm install // 最初だけ行う
$ npm run develop // ビルドが始まり、完了するとbackend/static/js/bundle.js が更新されます。
```

あとはブラウザからサイトを開くと

## Copyright / Lisence

画像： Copyright (c) [@br_branch](https://twitter.com/br_branch)  
※ 一部素材として [シルエットデザイン](http://kage-design.com/wp/) 様のものを使わせてもらっています。
その他：MIT Lisence  
