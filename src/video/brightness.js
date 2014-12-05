/**
 * Checks the brightness of the dominant color of the video element snapshot.
 * because 255,255,255 == white(light) and 0,0,0 == black(dark)
 * we can know the sum: 765 is the brightest color.
 * From this, brightness level is divided into categories.
 * The following boolean functions boundary check a given videoSrc
 * agains it's respective category.
 */
 oo_video.isVeryDark = function(){
  var c = getBrightnessConst();
  var dominantColor = oo_video.color.dominantColor(videoSrc);
      dominantColor = oo._support.toColorObj(dominantColor);

  var brightness = dominantColor.r +
                dominantColor.g +
                dominantColor.b;

  return (brightness <= c.VERY_DARK) ? true : false;
}

oo_video.isDark = function(){
  var c = getBrightnessConst();
  var dominantColor = oo_video.color.dominantColor(videoSrc);
      dominantColor = oo._support.toColorObj(dominantColor);

  var brightness = dominantColor.r +
                dominantColor.g +
                dominantColor.b;

  return (brightness > c.VERY_DARK && brightness <= c.DARK) ? true : false;
}

oo_video.isBright = function(){
  var c = getBrightnessConst();
  var dominantColor = oo_video.color.dominantColor(videoSrc);
      dominantColor = oo._support.toColorObj(dominantColor);

  var brightness = dominantColor.r +
                dominantColor.g +
                dominantColor.b;

  return (brightness >= c.DARK && brightness < c.BRIGHT) ? true : false;
}

oo_video.isVeryBright = function(){
  var c = getBrightnessConst();
  var dominantColor = oo_video.color.dominantColor(videoSrc);
      dominantColor = oo._support.toColorObj(dominantColor);

  var brightness = dominantColor.r +
                dominantColor.g +
                dominantColor.b;

  return (brightness >= c.BRIGHT) ? true : false;
}

oo_video.getBrightness = function() {
  var c = getBrightnessConst();
  var dominantColor = oo_video.color.dominantColor(videoSrc, 5);
  dominantColor = oo._support.toColorObj(dominantColor);

  var brightness = dominantColor.r +
                dominantColor.g +
                dominantColor.b;

  return brightness/c.MAX_BRIGHTNESS;
}

function getBrightnessConst() {
  var MAX_BRIGHTNESS = 765,
      BRIGHTNESS_CONSTANT = 7, //higher constant => more colors categorized as "bright"
      BRIGHTNESS_STEP   = MAX_BRIGHTNESS/BRIGHTNESS_CONSTANT; //TODO COLOR_STEP is not whole, spectrum contains holes.

  return {
    MAX_BRIGHTNESS: 765,
    VERY_DARK     : BRIGHTNESS_STEP*1,
    DARK          : BRIGHTNESS_STEP*2,
    BRIGHT        : BRIGHTNESS_STEP*3,
    VERY_BRIGHT   : BRIGHTNESS_STEP*4
  };
}
