// 友だちリスト
let friends = ["Aさん", "Bさん", "Cさん"];

// ***ここにforを使って書いてみよう***

// おみくじを引く呪文（参考(さんこう)：乱数生成(らんすうせいせい)）
// 数字0〜2がでてくるよ！
x = Math.floor(Math.random() * 3);

// ↓↓さっき完成させたifの部分
if (x == 0) {
  console.log(friend, ":", "大吉!");
} else if (x == 1) {
  console.log(friend, ":", "中吉!");
} else if (x == 2) {
  console.log(friend, ":", "小吉!");
}
