describe('color.colorPalette()', function() {
 var fakeSrc,
     realVideo;

  beforeEach('build a fake canvas/video source', function(){
    fakeSrc = testUtils.fakeRedImgSrc();
    realVideo = oo.video(fakeSrc.canvas);
  })

  it('should get the dominant color from the video/canvas element.', function(){
    var pureRed = {r:255, g:0, b:0},
        errMargin = 5;                //give the algorithm an error margin of 5 pixels.
        thePalette = realVideo.color.colorPalette(2),
        dominantColor = thePalette[0];

    dominantColor = oo._support.toColorObj(dominantColor)

    expect(dominantColor.r).to.be.within(pureRed.r-errMargin, pureRed.r); //250, 255
    expect(dominantColor.g).to.be.within(pureRed.g, pureRed.g+errMargin); //0, 5
    expect(dominantColor.b).to.be.within(pureRed.b, pureRed.b+errMargin); //0, 5
    
  })

})