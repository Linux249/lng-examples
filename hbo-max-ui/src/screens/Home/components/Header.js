import { Lightning } from "@lightningjs/sdk";
import { Logo } from "./Logo";

export class Header extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 32,
      Logo: {
        type: Logo,
      },
    };
  }
}
