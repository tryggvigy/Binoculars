oo.video.register = function (videoSrc) {

  var hasGetUserMedia = function() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  if (!hasGetUserMedia()) {
    throw new Error("init(): Sorry, your browser does not support this behaviour");
  }

    var permissions = { "video": true };

    var videoListenerError = function(error) {
      console.error("Video capture error: ", error);
    };

    // Put video listeners into place
    if(navigator.getUserMedia) { // Standard
      navigator.getUserMedia(permissions, function(stream) {
        videoSrc.src = stream;
        videoSrc.play();
        oo.video.gotPermission();
      }, videoListenerError);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
      navigator.webkitGetUserMedia(permissions, function(stream){
        videoSrc.src = window.webkitURL.createObjectURL(stream);
        videoSrc.play();
        oo.video.gotPermission();
      }, videoListenerError);
    }
    else if(navigator.mozGetUserMedia) { // Firefox-prefixed
      navigator.mozGetUserMedia(permissions, function(stream){
        videoSrc.src = window.URL.createObjectURL(stream);
        videoSrc.play();
        oo.video.gotPermission();
      }, videoListenerError);
    }
}
