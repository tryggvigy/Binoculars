window.addEventListener("DOMContentLoaded", function() {

  var videoEl = document.getElementById("video");
  
  var myVideo = oo.video(videoEl);
  myVideo.getPermission();

  var brightness;
  var isVeryDark;
  var isDark;
  var isBright;
  var isVeryBright;

  // Trigger photo take
  document.getElementById("snap").addEventListener("click", function() {
    var mainColor = myVideo.color.dominantColor();
    showColor(mainColor);
    console.log(myVideo.origin);

    isVeryDark = myVideo.isVeryDark();
    isDark = myVideo.isDark();
    isBright = myVideo.isBright();
    isVeryBright = myVideo.isVeryBright();
    brightness = myVideo.getBrightness();

    document.querySelector("#verydark").innerHTML = isVeryDark;
    document.querySelector("#dark").innerHTML = isDark;
    document.querySelector("#bright").innerHTML = isBright;
    document.querySelector("#verybright").innerHTML = isVeryBright;
    document.querySelector("#brightness").innerHTML = brightness;
  });

  function showColor(rgbArr) {
    var r = rgbArr[0],
        g = rgbArr[1],
        b = rgbArr[2];
    var div = document.createElement("div");
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.border = "1px solid black";
    div.style.display = "inline-block";
    div.style.margin = "0 0 0 2px";
    div.style.background = 'rgb('+r+','+g+','+b+')';

    document.querySelector(".colors").appendChild(div);
  }

}, false);
