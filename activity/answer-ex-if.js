// おみくじを引く呪文(じゅもん)（参考(さんこう)：乱数生成(らんすうせいせい)）
x = Math.floor(Math.random() * 3);

// ↓↓おみくじの中身：〇〇が出たら××
if (x == 0) {
  console.log("大吉!");
} else if (x == 1) {
  console.log("中吉!");
} else if (x == 2) {
  console.log("小吉!");
}
