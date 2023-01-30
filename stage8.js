/*document.getElementById('bgm-play').addEventListener('click', () => {
let bgm = new Audio(
  "https://drive.google.com/uc?id=1oiDiUZIGqQVO4YAuzZzSYcTwjOTVJW9L"
);

bgm.volume = 0.1;

    bgm.play();
});*/


let myAudio = document.getElementById("myAudio");

function togglePlay() {
  if(myAudio.paused){
    myAudio.play();
  }else{
    myAudio.pause();
  }
};