// 消されたライン数に応じてスコアを乗算
function calculateScore(c) {
  scoreResult = c * 100;
  // スコア情報を更新
  document.getElementById("score-count").innerHTML = scoreResult;
}
