import { Lightning, Utils } from '@lightningjs/sdk'
import { APP_HEIGHT, APP_WIDTH } from './constants'
import Page from './Page'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      Background: {
        rect: true,
        w: APP_WIDTH,
        h: APP_HEIGHT,
        color: 0xff000000,
      },
      MainPage: {
        type: Page,
        x: 5,
      },
    }
  }

  _init() {}

  _getFocused() {
    return this.tag('MainPage')
  }
}
