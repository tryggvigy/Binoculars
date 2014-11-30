window.addEventListener("DOMContentLoaded", function() {

  var video = document.getElementById("video");
  oo.video.register(video);

  var brightness;
  var isVeryDark;
  var isDark;
  var isBright;
  var isVeryBright;

  // Trigger photo take
  document.getElementById("snap").addEventListener("click", function() {
    var mainColor = oo.video.color.dominantColor(video);
    showColor(mainColor);

    isVeryDark = oo.video.isVeryDark(video);
    isDark = oo.video.isDark(video);
    isBright = oo.video.isBright(video);
    isVeryBright = oo.video.isVeryBright(video);
    brightness = oo.video.getBrightness(video);

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
