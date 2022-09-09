import { Color } from "./Color";

describe("Color", () => {
  describe("fn: hexToArgb", () => {
    it("parse color", () => {
      expect(Color.hexToArgb("#ffffff")).toEqual(0xffffffff);
    });

    it("parse color (case 2)", () => {
      expect(Color.hexToArgb("#000000")).toEqual(0xff000000);
    });

    it("parse with opacity", () => {
      expect(Color.hexToArgb("#ffffff", 0.5)).toEqual(0x7fffffff);
    });
  });

  describe("fn: rgbToArgb", () => {
    it("parse color", () => {
      expect(Color.rgbaToArgb(255, 255, 255, 1)).toEqual(0xffffffff);
    });

    it("parse color (case 2)", () => {
      expect(Color.rgbaToArgb(0, 0, 0, 1)).toEqual(0xff000000);
    });

    it("parse with opacity", () => {
      expect(Color.rgbaToArgb(255, 255, 255, 0.5)).toEqual(0x7fffffff);
    });
  });
});
