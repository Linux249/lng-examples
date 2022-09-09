import { Lightning } from '@lightningjs/sdk'
import NoiseShader from '@/shaders/NoiseShader'

export default class ErrorScreen extends Lightning.Component {
  static _template() {
    return {
      w: w => w,
      h: h => h,
      Background: {
        w: w => w,
        h: h => h,
        rect: true,
        color: 0xff000000,
        shader: {
          type: NoiseShader,
          time: 0,
        },
      },
      Popup: {
        x: w => w / 2,
        y: h => h / 2,
        mount: 0.5,
        texture: Lightning.Tools.getRoundRect(700, 220, 8, 0, null, true, 0xbb000000),
        flex: {
          direction: 'column',
          alignItems: 'center',
        },
        Title: {
          flexItem: {
            marginTop: 40,
          },
          text: {
            text: 'Error',
            fontSize: 50,
          },
        },
        Subtitle: {
          text: {
            text: "Couldn't open video. Please try again.",
            fontSize: 35,
          },
        },
      },
    }
  }

  updateNoise() {
    const time = new Date().getTime() % 1000
    this.patch({
      Background: {
        shader: {
          time,
        },
      },
    })
  }

  _active() {
    this._updateNoiseInterval = setInterval(() => this.updateNoise(), 100)
  }

  _inactive() {
    clearInterval(this._updateNoiseInterval)
  }
}
