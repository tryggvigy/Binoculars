oo_video.getPermission = function () {

  var hasGetUserMedia = function() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  if (!hasGetUserMedia()) {
    throw new Error("getPermission(): Sorry, your browser does not support this behaviour");
  }
  var permissions = { "video": true };

  return new Promise(function (fulfill, reject){
    // Put video listeners into place
    if(navigator.getUserMedia) { // Standard
      navigator.getUserMedia(permissions, function(stream) {
        videoSrc.src = stream;
        videoSrc.play();
        window.setTimeout(function(){ //give nativ stuff a second to finish
          fulfill(videoSrc);
        }, 1000);
      }, reject);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
      navigator.webkitGetUserMedia(permissions, function(stream){
        videoSrc.src = window.webkitURL.createObjectURL(stream);
        videoSrc.play();
        window.setTimeout(function(){
          fulfill(videoSrc);
        }, 1000);
      }, reject);
    }
    else if(navigator.mozGetUserMedia) { // Firefox-prefixed
      navigator.mozGetUserMedia(permissions, function(stream){
        videoSrc.src = window.URL.createObjectURL(stream);
        videoSrc.play();
        window.setTimeout(function(){
          fulfill(videoSrc);
        }, 1000);
      }, reject);
    }
  });
}
