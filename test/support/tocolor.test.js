describe('oo._support.toColorObj()', function(){
  it('should convert a rgb array to a rgb obj', function(){
    var colorObj = oo._support.toColorObj([66,66,66])
    var expectedVal = {r : 66, g :66, b: 66}

    expect(colorObj).to.deep.equal(expectedVal)
  })
})
