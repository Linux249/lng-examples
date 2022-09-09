const background = 'rgba(51,0,13, 255)'
const background3 = 'rgb(51,0,13)'
const background2 = 0x8bff9b

export function test(r, g, b, a) {
  return ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff)
  // const color = ;
  // console.log  ({color})
  const alfa = 255;
  const red = 116;
  const green = 195;
  const blue = 101;
  return  ((alfa & 0xff) << 24) | ((red & 0xff) << 16) | ((green & 0xff) << 8) | (blue & 0xff);
  const color = ((alfa & 0xff) << 24) | ((red & 0xff) << 16) | ((green & 0xff) << 8) | (blue & 0xff);
  return color
}

console.log(test(51, 0, 13, 0))

console.log(test(116, 0, 101, 255))

var rgbToHex = function(rgb) {
  var hex = Number(rgb).toString(16)
  if (hex.length < 2) {
    hex = '0' + hex
  }
  return hex
}

var fullColorHex = function(r, g, b) {
  var red = rgbToHex(r)
  var green = rgbToHex(g)
  var blue = rgbToHex(b)
  return red + green + blue
}

console.log(fullColorHex(51,0,13))
