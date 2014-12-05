/*!
 * This function wraps
 * Color Thief v2.0
 * by Lokesh Dhakar - http://www.lokeshdhakar.com
 *
 * License
 * -------
 * Creative Commons Attribution 2.5 License:
 * http://creativecommons.org/licenses/by/2.5/
 */
 oo_video.color.colorPalette = function(colorCount, quality) {

  if (typeof colorCount === 'undefined') {
        colorCount = 10;
  }
  if (typeof quality === 'undefined') {
      quality = 10;
  }

  // Create custom CanvasImage object
  var image      = new oo._support.CanvasImage(videoSrc);
  var imageData  = image.getImageData();
  var pixels     = imageData.data;
  var pixelCount = image.getPixelCount();

  // Store the RGB values in an array format suitable for quantize function
  var pixelArray = [];
  for (var i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
      offset = i * 4;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];
      // If pixel is mostly opaque and not white
      if (a >= 125) {
          if (!(r > 250 && g > 250 && b > 250)) {
              pixelArray.push([r, g, b]);
          }
      }
  }

  // Send array to quantize function which clusters values
  // using median cut algorithm
  var cmap    = oo.algorithms.quantize(pixelArray, colorCount);
  var thePalette = cmap.palette();

  // Clean up
  image.removeCanvas();

  return thePalette;
};
