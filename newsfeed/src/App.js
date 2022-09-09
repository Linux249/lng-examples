import { Router, Utils } from '@lightningjs/sdk'
// import all the configured routes
import routes from './lib/routes'
import { Notification } from './widgets'

export default class App extends Router.App {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  /**
   * Start the Router and provide with:
   * - routes configuration
   * - App instance (optional)
   */
  _setup() {
    Router.startRouter(routes, this)
  }

  static _template() {
    return {
      ...super._template(),
      Widgets: {
        Notification: {
          type: Notification,
        },
      },
      rect: true,
      color: 0xff000000,
      w: 1920,
      h: 1080,
    }
  }

  static _states() {
    const states = super._states()
    states.push(class ExampleState extends this {})
    return states
  }

  _handleAppClose() {
    console.log('Show exit dialogue')
  }
}
