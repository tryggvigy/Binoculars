describe('oo_CanvasImage', function(){
  var fakeSrc;
  // In order to create the ImageData object we need to go through a canvas.
  beforeEach('build a fake canvas/video source', function(){
    fakeSrc = testUtils.fakeRedImgSrc();
  })

  it('should create a temporary canvas element under body', function(){
    var image = new oo._support.CanvasImage(fakeSrc.canvas)
    var canvas = image.canvas
    expect(document.body.contains(canvas)).to.be.ok
  })

  it('should return its imageData correctly', function(){
    var image = new oo._support.CanvasImage(fakeSrc.canvas)
    var aImgData = image.getImageData().data
    var eImgData = fakeSrc.imgData.data

    expect(
      testUtils.arraysEqual(aImgData,eImgData)
    ).to.be.ok
  })

  it('should be able to remove its canvas from the DOM', function(){
    var image = new oo._support.CanvasImage(fakeSrc.canvas)
    var canvas = image.canvas

    image.removeCanvas();
    expect(document.body.contains(canvas)).to.not.be.ok
  })

})
