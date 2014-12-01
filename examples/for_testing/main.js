window.addEventListener("DOMContentLoaded", function() {

  var canvas = document.createElement('canvas')
  canvas.width = 100
  canvas.height = 100

  var ctx = canvas.getContext("2d");
  var fakeSrc = ctx.createImageData(100, 100);
  for (var i = 0;i < fakeSrc.data.length; i += 4) {
    fakeSrc.data[i+0]=255; //r
    fakeSrc.data[i+1]=0; //g
    fakeSrc.data[i+2]=0; //b
    fakeSrc.data[i+3]=255; //alpha
  }
  ctx.putImageData(fakeSrc, 10, 10);

  var a = oo.video.getPixels(canvas)
  var b = new oo._CanvasImage(canvas);
  var c = b.getPixelCount()

}, false);
