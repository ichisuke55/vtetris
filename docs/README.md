# vtetris

## 目的

CoderDojo @田町で利用する、ブロックが落ちてくるゲームに関するドキュメント。

## 要求仕様

- GAS にて実装する必要がある
- こともが楽しめる内容であること
  - ゲームであること

### 実装仕様

- 某ブロック落としゲームのようなものとする
  - 某ブロック落としゲームにできるだけ準拠する
- ブラウザで動かせるものとする
  - HTML/CSS/JavaScript を使用する
  - 実行は GAS の WEB app deploy で公開する

### 詳細仕様

#### フィールドの大きさ

フィールドの大きさは 20 行 × 10 列とする。  
上から落ちてくる次のブロックを描画するために、22 行目まで描画する。

#### フィールドの描画

##### Canvas について

HTML の canvas 要素と JavaScript の Canvas API を使うことで、グラフィックを描画できる。  
canvas への描画は、canvas のコンテキスト経由で行う。

```js
const gameCanvas = document.getElementById("game"); // canvas要素を取得
const gameCtx = gameCanvas.getContext("2d"); // canvasコンテキストを取得(2次元要素)
```

[参考 link](https://developer.mozilla.org/ja/docs/Web/API/Canvas_API)

##### フィールドの準備

20 行(22 行) × 10 列のフィールドを用意する。

- field の縦について、row 番号で最上部は 0(-2)、最下部が 19 となる。
- field の横について、col 番号で左端が 0、右端が 9 となる。

```js
// playfieldを描画
const playfield = [];
for (let row = -2; row < 20; row++) {
  playfield[row] = [];
  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}
```

#### ブロックについて

##### ブロックの定義

- `tetrominos`という変数に key-value 型で定義する
  - key-value 型にすることで、key の値で形と色の定義が楽になるため
- value に定義する際に、二次元配列で定義する
  - 視覚的にわかりやすい/アレンジ可能
  - 注意点として、全てのブロックを 4 × 4 の二次元配列で定義すると、回転をかけた際にズレが生じるため、形によって最小幅で定義する。

```js
const tetrominos = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};
```
