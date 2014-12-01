$(document).ready(function() {
  var brightness;

  var webcam = document.getElementById("webcam");
  oo.video.register(webcam);

  var targets = {
    coverHeadingEl : $(".cover-heading"),
    coverImgEl : $(".cover-img"),
    quoteEl : $(".footer-quote")
  };

  var config = {
    coverImg : {
      day : "day.jpg",
      night : "night.jpg"
    },
    coverHeading : {
      day : "Hello, From The Day",
      night : "Hello, From The Night"
    },
    quote : {
      day : '“Today is the first day of the rest of your life.”',
      night : "“I like the night. Without the dark, we'd never see the stars.”"
    }
  }

  oo.video.onPermission(function() {
    window.setInterval(function(){
      init();
    }, 1000);
  });


  function init() {
    if(oo.video.getBrightness(webcam)< 0.3) {
      setNight();
    }
    else {
      setDay();
    }
  }

  function swapStyleSheet(sheet) {
    document.getElementById("pagestyle").setAttribute("href", sheet);  
  }

  function setDay() {
    targets.coverImgEl.attr("src", config.coverImg.day);
    targets.coverHeadingEl.text(config.coverHeading.day);
    targets.quoteEl.text(config.quote.day);
    swapStyleSheet("day.css");
  }

  function setNight() {
    targets.coverImgEl.attr("src", config.coverImg.night );
    targets.coverHeadingEl.text(config.coverHeading.night);
    targets.quoteEl.text(config.quote.night);
    swapStyleSheet("night.css");
  }


});