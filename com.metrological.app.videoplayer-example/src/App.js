import { Utils, Router } from '@lightningjs/sdk'
import Menu from './widgets/Menu'
import routes from './lib/routes'

export default class App extends Router.App {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      ...super._template(),
      Widgets: {
        Menu: {
          type: Menu,
          zIndex: 99,
        },
      },
    }
  }

  // when App instance is initialized we call the routes
  // this will setup all pages and attach them to there route
  _setup() {
    Router.startRouter(routes, this)
  }

  _handleUp() {
    Router.focusWidget('menu')
  }
}
