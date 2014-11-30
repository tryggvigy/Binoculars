/**
 * Converts a single rgb color array to
 * a single rgb object
 * @example [234, 124, 45] => {r:234, g:124, b:45}
 */
 oo._support.toColorObj = function (colorArr) {
  var color = {};
  color.r = colorArr[0];
  color.g = colorArr[1];
  color.b = colorArr[2];
  return color;
}
