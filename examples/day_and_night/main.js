$(document).ready(function() {
  var brightness;
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

  var webcam = document.getElementById("webcam");
  var myVid = oo.video(webcam);
  myVid.getPermission().then(init, function(err){
    console.error("Video capture error: ", err);
  });

  function init() {
    window.setInterval(function() {
      if(myVid.isVeryDark()) {
        setNight();
      }
      else {
        setDay();
      }
    }, 1000);
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