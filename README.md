# npmとwebpackで作るVue.js、学習のためのいい感じのフロントエンド開発環境 2016年8月の場合。

[vue.js](https://jp.vuejs.org/)

Vue.jsは日本語のドキュメントも整備されていて情報も多いので助かりますね。  
でそのVue.js + webpackでいい感じの環境を作る必要があって用意してみました。

* Vue.js
* webpack
* vue-router（あったほうが良さそうなので使います）
* Babel（これもあったほうが良さそう的なので使います）
* サーバーとのHTTP通信はjQueryを使います（元々プロジェクトに入っていたのでさらに追加するよりもいいだろうという判断です）

## 必要なものあるかどうか確認

```
node -v
```
まずはお決まりのNode.js入ってるか確認。

```
npm -v
```
npm（Node.jsのパッケージマネージャー）も入ってるか確認。

```
webpack -v
```
webpackも入っているか確認。  
もし入ってなかったら

```
npm install -g webpack
```
-gオプションはGlobalオプションのこと。

## ファイル・フォルダ構成

```
git clone https://github.com/shigekitakeguchi/npm-webpack-vuejs.git
```
[https://github.com/shigekitakeguchi/npm-webpack-vuejs](https://github.com/shigekitakeguchi/npm-webpack-vuejs)

GitHubから落として使ってください。  
カスタマイズなりなんなりして。

```
cd npm-webpack-vuejs
```
落としたフォルダ内に移動する。

```bash
├── LICENSE
├── README.md
├── app
│   ├── index.html
│   └── scripts
│       └── bundle.js
├── bs-config.json
├── package.json
├── src
│   ├── components
│   │   └── app.vue
│   └── scripts
│       └── index.js
└── webpack.config.js
```

ファイル・フォルダ構成はこんな感じ。  
LICENSEやREADME.mdはプロジェクトには直接はいらないファイルですね。今回は、わかりよいようにコンポーネントを使ったサンプルを入れてます。  
「.vue」という珍しい拡張子のファイルがVue.jsのコンポーネントですね。説明はのちほど。

```
npm install
```

これで必要なパッケージがインストールされるはず。

## package.json

```json
{
  "name": "npm-webpack-vuejs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "webpack": "webpack -w",
    "lite": "lite-server",
    "start": "concurrently \"npm run lite\" \"npm run webpack\""
  },
  "keywords": [],
  "author": "shigeki.takeguchi",
  "license": "MIT",
  "devDependencies": {
    "babel": "^6.5.2",
    "babel-core": "^6.13.2",
    "babel-loader": "^6.2.4",
    "babel-plugin-transform-runtime": "^6.12.0",
    "babel-preset-es2015": "^6.13.2",
    "concurrently": "^2.2.0",
    "css-loader": "^0.23.1",
    "lite-server": "^2.2.2",
    "vue-html-loader": "^1.2.3",
    "vue-loader": "^8.5.3",
    "vue-style-loader": "^1.0.0",
    "webpack": "^1.13.1"
  },
  "dependencies": {
    "jquery": "^3.1.0",
    "vue": "^1.0.26",
    "vue-router": "^0.7.13"
  }
}
```
中身はこんな感じ。
けっこういろいろはいってますね。

### パッケージの説明

落としてきたpackage.jsonからインストールすればいいんですがそれぞれのパッケージの説明を。

```
npm install --save-dev babel
```
はい、Babelです。

```
npm install --save-dev babel-core
```
[https://github.com/babel/babel/tree/master/packages/babel-core](https://github.com/babel/babel/tree/master/packages/babel-core)

言わずもがな、Babelのコンパイラのコア。

```
npm install --save-dev babel-loader
```
[https://github.com/babel/babel-loader](https://github.com/babel/babel-loader)

webpackでES2015構文で書いたファイルをトランスパイルするのに必要。

```
npm install --save-dev babel-plugin-transform-runtime
```

未対応なブラウザでも動くように変換するやるらしいですね。  
[babel-polyfillとbabel-runtimeの使い分けに迷ったので調べた](http://qiita.com/inuscript/items/d2a9d5d4daedaacff924)

```
npm install --save-dev babel-preset-es2015
```
BabelでES2015を使うときに必要なやつです。

```
npm install --save-dev concurrently
```
[https://github.com/kimmobrunfeldt/concurrently](https://github.com/kimmobrunfeldt/concurrently)

concurrentlyは複数のコマンド実行できるようにするため。具体的に何をしているかは後ほど説明。

```
npm install --save-dev lite-server
```
[https://github.com/johnpapa/lite-server](https://github.com/johnpapa/lite-server)

webpackにもwebpack dev serverというのがあるみたいだけどlite-serverのがシンプルで良さそうなので使ってみた。  
ただし設定ファイルは必要でした。

```
npm install --save-dev webpack
```
[https://github.com/webpack/webpack](https://github.com/webpack/webpack)

webpackですね。

## package.jsonの中のscriptsで何をしているか

```json
"scripts": {
  "webpack": "webpack -w",
  "lite": "lite-server",
  "start": "concurrently \"npm run lite\" \"npm run webpack\""
},
```

```
npm start
```

このコマンドでlite-serverを立ち上げwebpackでwatchを行いJavaScriptの変更を監視するようにしている。

```json
"start": "concurrently \"npm run lite\" \"npm run webpack\""
```
scriptsの中にあるstartがこれにあたる。

```
npm run lite
```
```
npm run webpack
```

これらのコマンドはそれぞれ独立したコマンドですが、最初にちょっと触れたがconcurrentlyにダブルクオーテーションでくくってスペースで区切って引数で渡せば並行して実行することになる。便利。

```json
"webpack": "webpack -w",
```
これはwebpackのwatch（監視）を走らせている。こちらも後ほど触れるがwebpack.config.jsonで記述されたことをもとに監視している。

```json
"lite": "lite-server",
```
lite-serverを立ち上げている。bs-config.jsonに設定ないようを記述している（こちらも後ほど触れる）。

## webpack.config.json

webpackの設定です。

```javascript
var webpack = require("webpack");

module.exports = {
  entry: './src/scripts/index.js',
  output: {
    path: __dirname + '/app/scripts',
    filename: 'bundle.js',
		publicPath: '/app/',
  },
  module: {
    loaders: [
      {
        test: /\.vue$/, loader: 'vue'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ]
}
```
entryにもとファイル（複数ある場合は配列で持たせる）。outputに出力される設定を記述。今回はbundle.jsっていう一般的によく使われているらしい名称のまま。  
けっこうシンプルですね。
依存するパッケージがいろいろあってエラーが出て知るという感じで
