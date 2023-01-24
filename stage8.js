let bgm = new Audio(
    "https://drive.google.com/uc?id=1oiDiUZIGqQVO4YAuzZzSYcTwjOTVJW9L"
  );
  
  bgm.volume = 0.1;
  
  document.getElementById('bgm-play').addEventListener('click', () => {
      bgm.play();
    });