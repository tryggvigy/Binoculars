var testUtils = {};

// returns a object containing the ImageData object created and a
// 100x100 canvas element containing the ImageData.
// This is needed because we can only create a ImageData object through a canvas.
testUtils.fakeRedImgSrc = function() {
  var canvas = document.createElement('canvas')
  canvas.width = 100;
  canvas.height = 100;
  var ctx = canvas.getContext("2d");
  var imgData = ctx.createImageData(100, 100);
  for (var i = 0;i < imgData.data.length; i += 4) {
    imgData.data[i+0]=255; //r
    imgData.data[i+1]=0; //g
    imgData.data[i+2]=0; //b
    imgData.data[i+3]=255; //alpha
  }
  ctx.putImageData(imgData, 0, 0);
  return {
    canvas : canvas,
    imgData: imgData
  };
}

testUtils.arraysEqual = function(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
