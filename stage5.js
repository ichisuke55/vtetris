// 回転処理
// 参考サイト: https://www.bugbugnow.net/2019/04/array-rotate.html

// キーボード入力イベントのリッスン
document.addEventListener("keydown", function (e) {
  if (isGameOver) return;
  switch (e.code) {
    // 左、右キー (移動)
    case "ArrowLeft":
    case "ArrowRight": {
      const col =
        e.code === "ArrowLeft" ? tetromino.col - 1 : tetromino.col + 1;
      if (canMove(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
      }
      break;
    }
    case "ArrowDown": {
      // 下キー(落下)
      const row = tetromino.row + 1;
      if (!canMove(tetromino.matrix, row, tetromino.col)) {
        tetromino.row = row - 1;
        placeTetromino();
        return;
      }
      tetromino.row = row;
      break;
    }
    case "ArrowUp": {
      // 上キー(ハードドロップ)
      while (canMove(tetromino.matrix, tetromino.row + 1, tetromino.col)) {
        tetromino.row++;
      }
      break;
    }

    // 問題: 回転イベントを発生させるkeyEvent条件分岐を追加すること
    // 参考サイト: https://developer.mozilla.org/ja/docs/Web/API/KeyboardEvent/keyCode
    // 参考サイト: https://www.javadrive.jp/javascript/function/index6.html
  }
});
