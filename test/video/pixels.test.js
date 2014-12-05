describe('oo.video Pixel functions', function() {
 var fakeSrc,
     realVideo;

  beforeEach('build a fake canvas/video source', function(){
    fakeSrc = testUtils.fakeRedImgSrc();
    realVideo = oo.video(fakeSrc.canvas);
  })

  describe('getPixels', function(){
    it('should return the pixel array of the video at time of calling.', function(){
      var pixelBitArray = fakeSrc.imgData.data

      expect(
        testUtils.arraysEqual(realVideo.getPixels() , pixelBitArray)
      ).to.be.ok
      //expect(realVideo.getPixels()).to.deep.equal(fakeSrc.imgData.data)   the above is faster.
    })
  })

  describe('getPixelCount', function(){
    it('should return the pixel count of the video at time of calling.', function(){
      var pixelCount = fakeSrc.imgData.data.length/4; //4 bits per pixel

      expect(realVideo.getPixelCount()).to.equal(pixelCount)
    
    })
  })

})