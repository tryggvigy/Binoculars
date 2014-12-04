window.addEventListener("DOMContentLoaded", function() {

  var recognition = new webkitSpeechRecognition();
  recognition.onresult = function(event) { 
    console.log(event) 
  }
  recognition.start();

}, false);
