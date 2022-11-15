# vtetris

## 目的

CoderDojo @田町で利用する、ブロックが落ちてくるゲームに関するドキュメント

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

#### フィールド

フィールドの大きさは 20 行 × 10 列とする  
上から落ちてくる次のブロックを描画するために、22 行目まで描画する

##### Canvas

HTML の canvas 要素と JavaScript の Canvas API を使うことで、グラフィックを描画できる  
canvas への描画は、canvas のコンテキスト経由で行う  
参考 link](https://developer.mozilla.org/ja/docs/Web/API/Canvas_API)

```js
const gameCanvas = document.getElementById("game"); // canvas要素を取得
const gameCtx = gameCanvas.getContext("2d"); // canvasコンテキストを取得(2次元要素)
```

##### フィールドの準備

20 行(22 行) × 10 列のフィールドを用意する。

- field の縦について、row 番号で最上部は 0(-2)、最下部が 19 となる
- field の横について、col 番号で左端が 0、右端が 9 となる
- field の 1 マスをセルと呼ぶことにする

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

#### ブロック

##### ブロックの定義

- `tetrominos`という変数に key-value 型で定義する
  - key-value 型にすることで、key の値で形と色の定義が楽になるため
- value に定義する際に、二次元配列で定義する
  - 視覚的にわかりやすい/アレンジ可能
  - 注意点として、全てのブロックを 4 × 4 の二次元配列で定義すると、回転をかけた際にズレが生じるため、形によって最小幅で定義する

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

##### カラー定義

- ブロックごとに色を付与する
  - [参考 link](https://ja.wikipedia.org/wiki/%E3%83%86%E3%83%88%E3%83%AD%E3%83%9F%E3%83%8E#:~:text=%E5%90%84%E7%A8%AE%E9%A1%9E%E3%81%AE%E5%91%BC%E3%81%B3%E6%96%B9,%E5%9E%8B%EF%BC%88%E3%83%9E%E3%82%BC%E3%83%B3%E3%82%BF%EF%BC%89%E3%81%A8%E5%91%BC%E3%81%B0%E3%82%8C%E3%82%8B%E3%80%82)
- カラーコードはネームドカラーを使用
  - https://www.w3schools.com/tags/ref_colornames.asp
  - カラーコードを使用しても良いが、一旦ベースはわかりやすい名前で定義
- こちらもブロック定義同様、key-value 形式で定義する

```js
// テトロミノの色を設定
const colors = {
  I: "cyan",
  O: "yellow",
  T: "purple",
  S: "green",
  Z: "red",
  J: "blue",
  L: "orange",
};
```

#### アニメーション動作

ブラウザでアニメーションを実行させるために、`requestAnimationFrame`を採用する  
多くの某ゲームを作るサンプルでは`setInterval`と`setTimeout`を使って描画のタイミングを操るようにしているが、簡単に記述できることを重視した結果、`requestAnimationFrame`で描画タイミングを操る

```js
let rAF = null; // 初期値の設定

// ゲーム実行中の繰り返し処理をloop関数にまとめる
function loop() {
  rAF = requestAnimationFrame(loop);
  // ゲームが動いてる間の繰り返し処理を記述
}

// ゲームを起動する
rAF = requestAnimationFrame(loop);

// ゲームを中断する
cancelAnimationFrame(rAF);
```

繰り返されるアニメーション中に入れないといけないものは以下の処理

1. canvas のクリア
2. field の描画
3. 描画されたブロックを落下させる + 動かせない時の判別
4. 次のブロックの取得と描画

##### 落下処理

落下については、以下のようにフレーム単位を loop 処理の中で計算させる

```js
// 0で初期化
let dropCount = 0;
// 落下は35フレーム単位で行い、35フレーム経過するごとにブロックが持つ行数を足し算する
// 足し算後の値をifで判別する(返り値は足し算後の値)
if (++dropCount >= 35) {
  tetromino.row++; // ブロックが持つ現在のy軸座標に1を足す
  dropCount = 0; // 次のブロックのためにカウントを0リセットする

  // ブロックが設置された(動かなくなった)ときの判別
  if (!canMove(tetromino.matrix, tetromino.row, tetromino.col)) {
    // 動かせなくなった時の処理
  }
}

// ブロックの描画
drawTetromino(tetromino, gameCtx); // 以下ブロックの描画で説明
```

##### ブロックの描画

`drawTetromino`関数で、取得したブロックとゲームフィールドコンテキストから、描画する

```js
// ブロックを描画する
function drawTetromino(tetromino, ctx) {
  // colors定義のkeyをもとに、渡されたcontextの内側に色を塗りつぶす
  ctx.fillStyle = colors[tetromino.name];
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        // 現在のfillStyleに基づいて、x + width/y + heightで塗りつぶす
        ctx.fillRect(
          (tetromino.col + col) * grid, // tetromino.col(現在値) + 対象のブロックの幅分を描画
          (tetromino.row + row) * grid, // tetromino.row(現在値) +
          grid - 1, // 幅 32-1=31(1引かないと全て色で塗りつぶされる)
          grid - 1 // 高さ 32-1=31(1引かないと全て色で塗りつぶされる)
        );
      }
    }
  }
}
```

#### 設置判定

##### ブロックが動くかどうかの判定

canMove 関数(true/false を返す)を使って、ブロックが動かせるかどうかを判定する  
loop 内で`tetromino.row++`で 1 段落としたタイミングで、動かせるかどうかを check する

```js
// テトロミノが動かせるかどうかを確認
function canMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (
        matrix[row][col] &&
        // 枠線外に出ているかを判定
        (cellCol + col < 0 || // 現在のブロックのx軸の値 + dxが0より小さくないか(左壁より左の位置ではないこと)
          cellCol + col >= playfield[0].length || // 現在のブロックのx軸の値が右壁より右ではないこと
          cellRow + row >= playfield.length || // 現在のブロックのy軸の値 + dyが下の壁より下ではないこと
          playfield[cellRow + row][cellCol + col]) // ブロックが存在していないこと
      ) {
        // 上記にmatchした場合、そのブロックはもう動けないのでfalseを返す
        return false;
      }
    }
  }
  // matchしない場合は動けるのでtrueを返す
  return true;
}

function loop() {
  if (tetromino) {
    // フレーム処理の諸々
    tetromino.row++;
    // テトロミノが設置された(動かなくなった)とき
    // false = 動けなくなった場合に placeTetromino() を呼ぶ
    if (!canMove(tetromino.matrix, tetromino.row, tetromino.col)) {
      tetromino.row--;
      placeTetromino();
    }
  }
}
```

##### ブロックの設置

上述で説明したとおり、ブロックが動かなくなった場合に `placeTetromino` 関数で呼び出す  
対象ブロックの二次元配列を行/列ごとに for 文を回して、1 が存在した場合(定義が 0 or 1 なので)に、ゲームオーバーなのか、対象セルにブロックが持つ名前要素で上書きする  
(例: I 型であれば、対象セルに`I`文字を入力)

```js
// テトロミノが積まれた時の関数
function placeTetromino() {
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        // ゲームオーバーかどうかを確認
        // tetromino.rowが現在のy軸のポジション値となるので、枠外のポジションにあるとマイナスの値を取る
        if (tetromino.row + row < 0) {
          return showGameOver();
        }

        // 初期値が0のplayfield上のブロックの現在位置 + dx/dyに設置されたブロックの名称を上書き
        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  // 消す処理
}
```

##### ライン一致判定

ブロックが設置されたら、設置されたブロックによって、ラインが揃ったかどうかの判定を行う

- `playfield.length -1`を使うことで、playfield の底辺から順に check していく
- カラムのチェックは配列に用意されている`every()`メソッドと、評価式にアロー関数を用意して、対象行の全ての要素が 0 以外である場合にラインを消す処理を行う

```js
function placeTetromino() {
  // ブロックの設置処理云々

  // 消す処理
  // 下から上に向かって揃ったラインを確認する
  for (let row = playfield.length - 1; row >= 0; ) {
    // 0以外であればtrueを返す(積まれているセルは文字で上書きされているため)
    if (playfield[row].every((cell) => cell)) {
      lineCount++; // 消されたライン数のカウントアップ
      // 消されたラインより上を下にずらす
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r - 1][c];
        }
      }
      // 0であれば1行上を確認できるようにrow自体に-1を行う
    } else {
      row--;
    }
  }

  calculateScore(lineCount); // 消したライン数をもとに得点を計算
  tetromino = getNextTetromino(); // playfieldに描くために待ち配列 or 待ち配列からブロックを取得
  nextmino = getAfterNextTetromino(); // nextfieldにブロックを描画するために待ち配列 or 待ち配列からブロックを取得
}
```

#### 待ち配列

ブロックの設置が終わったら、次のブロックが落ちてくる  
この処理を実現するために、次のブロックを準備するための配列を用意しておく

##### 待ち配列の作成

- 待ち配列を `tetrominoSequence`とする
- tetrominoSequence はゲーム開始時に初期値 0 を入れているため、配列の長さが 0 の場合の処理を入れる
- 乱数生成(`getRandomInt`)方法は、某ブロックゲームのガイドラインに乗っ取って重複がない方法を選択
  - いわゆる `0 < x < 1の小数点に欲しい乱数の長さを乗算` はやらない
  - [参考 link](https://pisuke-code.com/js-create-non-overlap-randoms/)

```js
// 乱数生成
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// テトロミノの中から重複しないように乱数を生成し、順番待ちListへ投入
// https://tetris.fandom.com/wiki/Random_Generator
function generateSequence() {
  // tetrominos定義のkey配列を取得
  const sequence = Object.keys(tetrominos);
  // tetrominos key配列の長さ分繰り返す
  while (sequence.length) {
    // getRandomIntを呼び出して、返り値をrandに代入(randは整数)
    const rand = getRandomInt(0, sequence.length - 1);
    // splice()メソッドでrandの値から1つの要素を取り除く(取り除いた時に配列で返ってくるので[0]を記載し、要素に変換)
    const name = sequence.splice(rand, 1)[0];
    // tetrominoSequence配列の末尾に取得した要素名("I"とか"J"とか)を追加する
    tetrominoSequence.push(name);
  }
}

// 順番待ちListから次のテトロミノを取得する
function getNextTetromino() {
  // ゲーム開始直後はtetrominoSequenceは初期値0のため、この処理を入れる
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }
  // ブロックの取得(以下記載)
}
```

##### 待ち配列からブロックを取得

- ブロックを取り出す際は、某ブロックゲームのガイドラインに乗っ取って、1 順中に重複なく取り出す方式にする
  - そのため作った待ち配列から要素を取り出す際は、破壊的メソッドの`pop`を利用する

```js
// 順番待ちListから次のテトロミノを取得する
function getNextTetromino() {
  // ゲーム開始直後はtetrominoSequenceは初期値0のため、この処理を入れる
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }

  // tetrominoSequenceの配列の最後の要素を取り出す(破壊的に取り出す)
  const nextMinoName = tetrominoSequence.pop();
  // 定義した二次元配列のkey-valueのtetrominosから文字列を元にmatrixに代入
  const matrix = tetrominos[nextMinoName];

  // スタート列数の設定: I型とO型は中央配置でスタート、それ以外は1マス左寄せ
  // I型とO型は配列の横幅が偶数で、その他は3の奇数
  // またMatch.ceilにより小数点以下切り上げ対応にするため
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
  // スタート行数の設定: I型であれば-1行目からスタート、それ以外は-2行目からスタート
  // 3項演算子で記述
  const row = nextMinoName === "I" ? -1 : -2;

  return {
    name: nextMinoName, // テトロミノブロックの名前
    matrix: matrix, // 現在の2次元配列の状態
    row: row, // 現在の行数(ここではブロックの初期位置となる)
    col: col, // 現在の列数(ここではブロックの初期位置となる)
  };
}
```
