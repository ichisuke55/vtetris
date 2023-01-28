let bgm = new Audio(
  "https://drive.google.com/uc?id=1oiDiUZIGqQVO4YAuzZzSYcTwjOTVJW9L"
);

bgm.volume = 0.1;

/*document.getElementById('bgm-play').addEventListener('click', () => {
    bgm.play();
});*/


let myAudio = document.getElementById("myAudio");

function togglePlay() {
  return myAudio.paused ? myAudio.play() : myAudio.pause();
};