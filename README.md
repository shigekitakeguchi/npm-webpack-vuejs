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

```bash
npm install --save-dev vue-loader
```
webpackでvue.jsを扱うようにするやつです。

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

```bash
npm install --save vue
```
vue.jsです。HTMLでscriptタグで読み込むのではなくrequireで読み込めるようにするためですね。
```bash
npm install --save jquery
```
同じくjqueryもwebpack.ProvidePluginで設定して利用できるようにします。

```bash
npm install --save vue-router
```
vue-router.jsもrequireで読み込めるようにします。

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
依存するパッケージがいろいろあってエラーが出てインストールする感じでした。うーん。

```bash
npm install --save-dev css-loader
```
```bash
npm install --save-dev vue-style-loader
```
このふたつのパッケージは「.vueファイル」（コンポーネント化したファイル）でCSSを記述するのでそのために必要ってことですね。

```bash
npm install --save-dev vue-html-loader
```
これも「.vueファイル」（コンポーネント化したファイル）でHTMLを記述するのでそのために必要ってことです。

## bs-config.json

```json
{
  "injectChanges": "true",
  "files": ["./app/**/*.{html,htm,css,js}"],
  "watchOptions": { "ignored": "node_modules" },
  "server": { "baseDir": "./app" }
}
```
lite-serverの設定はドキュメントルートをappの直下にしたかったのと監視対象のファイル（html、css、js）が変更されたらリロードしてinjectChangesというBrowsersyncを動すため。

## サンプルのソースコード

[vue.jsを使った大規模開発に必要なもの](http://qiita.com/m0a/items/34df129d6d8991ebbf86)

このページを参考にHello Worldしました。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>npm Webpack Vue.js</title>
  </head>
  <body>
    <div id="app">
      <router-view></router-view>
    </div>
    <script src="/scripts/bundle.js"></script>
  </body>
</html>
```
app/index.htmlです。

```vue
<style>
  .red {
    color: #f00;
  }
</style>

<template>
  <h1 class="red">{{msg}}</h1>
</template>

<script>
  module.exports = {
    data: function() {
      return {
        msg: 'Hello world!'
      }
    }
  }
</script>
```
src/app.vueです。styleとhtmlとscriptsがひとつになってるのでキモい人にはキモいかもですが考え方を変えればわかりやすいですね。好みの別れるところでしょうが。。。

### language-vue-component

[CYBAI/language-vue-component](https://github.com/CYBAI/language-vue-component)

あとAtomでvueのコンポーネントをシンタックスハイライトしてくれるパッケージです。

```javascript
var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(VueRouter);
var appComponent = Vue.extend(require('../components/app.vue'));

var App = Vue.extend({});
var router = new VueRouter();

router.map({
  '/': { component: appComponent}
})

router.start(App, '#app');
```
routerを使ってコンポーネントapp.vueを呼び出します。
成功すると赤い文字で「Hello world!」と表示されます。

---
vue.jsは軽量で扱いやすいMVVMフレームワークですね。  
Riot.jsの方が新しくてここのところ注目されているらしいですがvue.jsは日本語ドキュメントが充実していて情報も豊富なので入門しやすいのが特徴ですね。
