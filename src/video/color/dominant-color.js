oo.video.color.dominantColor = function(videoSrc, quality) {
  var colPalette = oo.video.color.colorPalette(videoSrc, 5, quality);
  var dominantColor = colPalette[0];
  return dominantColor;
}
