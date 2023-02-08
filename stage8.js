let bgm = new Audio(
  "https://drive.google.com/uc?id=1oiDiUZIGqQVO4YAuzZzSYcTwjOTVJW9L"
);

bgm.volume = 0.1;

let playing = false;

document.getElementById("bgm-play").addEventListener("click", () => {
  if (playing === false) {
    playing = true;
    bgm.play();
  } else {
    playing = false;
    bgm.pause();
  }
});