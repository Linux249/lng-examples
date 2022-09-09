import { Lightning } from '@lightningjs/sdk'
import { formatTime } from '@/lib/helpers'

export default class ProgressBar extends Lightning.Component {
  static _template() {
    return {
      h: 50,
      w: w => w,
      Progress: {
        color: 0x80cccccc,
        rect: true,
        w: w => w - 200,
        h: h => h,
        InnerProgress: {
          rect: true,
          color: 0xbb0078ac,
          x: 8,
          w: 0,
          y: h => (h - 16) / 2,
          h: 16,
        },
      },
      Timer: {
        color: 0x80cccccc,
        x: w => w - 180,
        w: 180,
        rect: true,
        h: 50,
        Text: {
          x: 15,
          y: 8,
          text: {
            textColor: 0xff000000,
            fontSize: 26,
          },
        },
      },
    }
  }

  set progress(v) {
    this.tag('Progress.InnerProgress').setSmooth('w', (this.renderWidth - 16) * v)
  }

  set duration(v) {
    this._duration = v
  }

  get duration() {
    return this._duration || 0.0001
  }

  set currentTime(v) {
    const ratio = Math.round((v / this.duration) * 1000) / 1000
    this.tag('Progress.InnerProgress').setSmooth(
      'w',
      (this.tag('Progress').renderWidth - 16) * ratio
    )
    this.tag('Timer.Text').text = [formatTime(v || 0), formatTime(this.duration || 0)].join(' / ')
  }
}
