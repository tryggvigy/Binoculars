oo_video.getPixels = function() {
  var image      = new oo._support.CanvasImage(videoSrc);
  var imageData  = image.getImageData();
  var pixels     = imageData.data;

  // Clean up
  image.removeCanvas();

  return pixels;
};

oo_video.getPixelCount = function() {
  var image = new oo._support.CanvasImage(videoSrc);

  // Clean up
  image.removeCanvas();

  return image.getPixelCount();
};
