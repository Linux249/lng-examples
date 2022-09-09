import { Lightning, Utils } from "@lightningjs/sdk";

export class Logo extends Lightning.Component {
  static _template() {
    return {
      y: 57,
      x: (1920 - 187) / 2,
      texture: Lightning.Tools.getSvgTexture(
        Utils.asset("images/logo.svg"),
        187,
        32
      ),
    };
  }
}
