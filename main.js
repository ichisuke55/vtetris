// テトリスガイドライン https://tetris.fandom.com/wiki/Tetris_Guideline

// 乱数生成
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// テトロミノの中から重複しないように乱数を生成し、順番待ちListへ投入
// https://tetris.fandom.com/wiki/Random_Generator
function generateSequence() {
  const sequence = Object.keys(tetrominos);
  while (sequence.length) {
    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];
    tetrominoSequence.push(name);
  }
}

// 順番待ちListから次のテトロミノを取得する
function getNextTetromino() {
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }

  const nextMinoName = tetrominoSequence.pop();
  const matrix = tetrominos[nextMinoName];

  // スタート列数の設定: I型とO型は中央配置でスタート、それ以外は1マス左寄せ
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
  // スタート行数の設定: I型であれば21行目からスタート、それ以外は22行目からスタート
  const row = nextMinoName === "I" ? -1 : -2;

  return {
    name: nextMinoName, // テトロミノブロックの名前
    matrix: matrix, // 現在の2次元配列の状態
    row: row, // 現在の行数
    col: col, // 現在の列数
  };
}

// テトロミノを描画する
function drawTetromino(tetromino, ctx) {
  if (tetromino.name in colors) {
    ctx.fillStyle = colors[tetromino.name];
  } else {
    ctx.fillStyle = defaultColor;
  }
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        // drawing 1 px smaller than the grid creates a grid effect
        ctx.fillRect(
          (tetromino.col + col) * grid,
          (tetromino.row + row) * grid,
          grid - 1,
          grid - 1
        );
      }
    }
  }
}

// fieldを描画
function drawField(ctx, field, r, c) {
  for (let row = 0; row < r; row++) {
    for (let col = 0; col < c; col++) {
      if (field[row][col]) {
        const name = field[row][col];
        if (name in colors) {
          ctx.fillStyle = colors[name];
        } else {
          ctx.fillStyle = defaultColor;
        }
        // 指定したgrid分を乗算して描画
        ctx.fillRect(col * grid, row * grid, grid - 1, grid - 1);
      }
    }
  }
}

// テトロミノが動かせるかどうかを確認
function canMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (
        matrix[row][col] &&
        // 枠線外に出ているかを判定
        (cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          playfield[cellRow + row][cellCol + col])
      ) {
        return false;
      }
    }
  }
  return true;
}

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

        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  // したから上に向かって揃ったラインを確認する
  for (let row = playfield.length - 1; row >= 0; ) {
    if (playfield[row].every((cell) => !!cell)) {
      lineCount++; // 消されたライン数のカウント
      // 消されたラインより上を下にずらす
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r - 1][c];
        }
      }
    } else {
      row--;
    }
  }

  //stage7
  calculateScore(lineCount);

  tetromino = getNextTetromino();
}

// ゲームオーバー画面を表示
function showGameOver() {
  cancelAnimationFrame(rAF);
  isGameOver = true;

  gameCtx.fillStyle = "black";
  gameCtx.globalAlpha = 0.75;
  gameCtx.fillRect(0, gameCanvas.height / 2 - 30, gameCanvas.width, 60);
  gameCtx.globalAlpha = 1;
  gameCtx.fillStyle = "white";
  gameCtx.font = "36px monospace";
  gameCtx.textAlign = "center";
  gameCtx.textBaseline = "middle";
  gameCtx.fillText("GAME OVER!", gameCanvas.width / 2, gameCanvas.height / 2);
}

// gameCanvasの初期化
const gameCanvas = document.getElementById("game");
const gameCtx = gameCanvas.getContext("2d");
const grid = 32;
const tetrominoSequence = [];
const defaultColor = "white";

let dropCount = 0;
let tetromino = getNextTetromino();
let rAF = null;
let isGameOver = false;

//stage7
let lineCount = 0; // 消したライン合計数
let scoreResult = 0; // スコアの合計数

// start
rAF = requestAnimationFrame(loop);
