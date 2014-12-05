oo_video.color.dominantColor = function(quality) {
  var colPalette = oo_video.color.colorPalette(5, quality);
  var dominantColor = colPalette[0];
  return dominantColor;
}
