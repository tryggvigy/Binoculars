import "../support/canvas-image";

oo.video.getPixels = function(videoSrc) {
  var image      = new oo._support.CanvasImage(videoSrc);
  var imageData  = image.getImageData();
  var pixels     = imageData.data;

  // Clean up
  image.removeCanvas();

  return pixels;
};

oo.video.getPixelCount = function(videoSrc) {
  var image = new oo._support.CanvasImage(videoSrc);

  // Clean up
  image.removeCanvas();

  return image.getPixelCount();
};
