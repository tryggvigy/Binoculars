describe('oo.video("elem")', function(){
  var fakeSrc;
  // In order to create the ImageData object we need to go through a canvas.
  beforeEach('build a fake canvas/video source', function(){
    fakeSrc = testUtils.fakeRedImgSrc();
  })

  it('should create a new binoculars video object', function(){
    var fakeVideo = oo.video(fakeSrc.canvas);
    expect(fakeVideo).to.include.keys('color');
  })

  it('should be able to create another seperate instance of the video object', function(){
    var fakeVideo = oo.video(fakeSrc.canvas);
    var fakeVideo2 = oo.video(fakeSrc.canvas);
    fakeVideo.color = null;    
    expect(fakeVideo2.color).to.be.an('object'); //fakeVideo2.color is not affected.
  })

})
