import { Utils, Router } from "@lightningjs/sdk";

import routes from "./routes";

export default class App extends Router.App {
  static getFonts() {
    return [{ family: "Roboto", url: Utils.asset("fonts/Roboto-Regular.ttf") }];
  }

  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
      },
    };
  }

  _setup() {
    Router.startRouter(routes);
  }

  _getFocus() {
    return this;
  }
}
