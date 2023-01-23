// gameCanvasに描画されるplayfieldを設定
// いくつかのテトリミノは画面外をスタート位置にしているので、画面外(row = -2)も描画
const playfield = [];
for (let row = -2; row < 20; row++) {
  playfield[row] = [];
  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}

// ゲームオーバーまでループ
function loop() {
  rAF = requestAnimationFrame(loop);
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // draw the playfield
  drawField(gameCtx, playfield, 20, 10);

  if (tetromino) {
    // テトロミノを35フレームで落下させる
    if (++dropCount > 35) {
      tetromino.row++;
      dropCount = 0;

      // テトロミノが設置された(動かなくなった)とき
      if (!canMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }

    // テトロミノの描画(playfieldとnextfieldそれぞれに)
    drawTetromino(tetromino, gameCtx);
  }
}
