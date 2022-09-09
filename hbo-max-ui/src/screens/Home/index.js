import { Lightning, Utils } from "@lightningjs/sdk";
import { Header } from "./components/Header";

export class Home extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset("images/sitebg.png"),
      },
      Header: {
        type: Header,
      },
    };
  }

  _getFocus() {
    return this;
  }
}
