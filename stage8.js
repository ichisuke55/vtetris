let bgm = new Audio(
  "https://drive.google.com/uc?id=1oiDiUZIGqQVO4YAuzZzSYcTwjOTVJW9L"
);
// ファイル設置場所: https://drive.google.com/drive/u/0/folders/1pWyJzsvz0xxmq7DZJvpARj5ALDhgacl2

bgm.volume = 0.1;

let playing = false;

document.getElementById("").addEventListener("", () => {
  if (playing === false) {
    // playing フラグを書きかえるよ

    // 音楽を流すよ

    document.getElementById("bgm-play").innerHTML = "Stop";
  } else {
    // playing フラグを書きかえるよ

    // 音楽を止めるよ

    document.getElementById("bgm-play").innerHTML = "Start";
  }
});
