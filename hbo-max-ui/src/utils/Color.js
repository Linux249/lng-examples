const baseOpacity10 = 255;

function numberToHexCode(opacity = 1) {
  return Number(parseInt(opacity * baseOpacity10)).toString(16);
}

function hexNumberToHexCode(hex) {
  const result = hex.toString(16);
  return result.length === 1 ? `0${result}` : result;
}

export const Color = {
  hexToArgb(hex, opacity = 1) {
    const hexNoHash = hex.replace("#", "");
    const finalOpacity = numberToHexCode(opacity);

    return parseInt(`0x${finalOpacity}${hexNoHash}`, 16);
  },
  rgbaToArgb(r, g, b, a = 1) {
    const red = hexNumberToHexCode(r);
    const green = hexNumberToHexCode(g);
    const blue = hexNumberToHexCode(b);
    const alpha = numberToHexCode(a);

    return parseInt(`0x${alpha}${red}${green}${blue}`);
  },
};
