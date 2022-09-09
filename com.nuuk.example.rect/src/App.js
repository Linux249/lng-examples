import { Lightning } from '@lightningjs/sdk'

const COLOR = 0x80ffffff // 50% opacity white

export default class App extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      Test: {
        x: w => w / 4,
        y: h => h / 4,
        mount: 0.5,
        texture: Lightning.Tools.getRoundRect(400, 400, 0, 0, null, true, COLOR),
      },
      Test2: {
        x: w => (w / 4) * 3,
        y: h => h / 4,
        mount: 0.5,
        texture: Lightning.Tools.getRoundRect(300, 300, 0, 0, null, true, COLOR),
      },
      Test3: {
        x: w => w / 4,
        y: h => (h / 4) * 3,
        mount: 0.5,
        texture: Lightning.Tools.getRoundRect(200, 200, 0, 0, null, true, COLOR),
      },
      Test4: {
        x: w => (w / 4) * 3,
        y: h => (h / 4) * 3,
        mount: 0.5,
        texture: Lightning.Tools.getRoundRect(100, 100, 8, 0, null, true, COLOR),
      },
    }
  }
}
