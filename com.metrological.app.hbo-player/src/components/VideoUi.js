import { Lightning, Utils } from '@lightningjs/sdk'
import Button from './Button'
import { formatTime } from '../helpers.js'

const interfaceTimeout = 5000000

export default class VideoUi extends Lightning.Component {
  static _template() {
    return {
      w: w => w,
      BackgroundTop: {
        w: w => w,
        h: 503,
        src: Utils.asset('images/bg-top.png'),
      },
      BackgroundBottom: {
        w: w => w,
        h: 656,
        mountY: 1,
        y: h => h,
        src: Utils.asset('images/bg-bottom.png'),
      },
      Title: {
        x: 120,
        y: 122,
        text: {
          text: '',
          fontSize: 62,
        },
      },
      Subtitle: {
        x: 119,
        y: 212,
        text: {
          text: '',
          fontSize: 44,
        },
      },
      Buttons: {
        x: w => w / 2,
        y: h => h - 288,
        mountX: 0.5,
        mountY: 1,
        flex: {
          alignItems: 'center',
        },
        Rewind: {
          flexItem: { marginRight: 21 },
          icon: 'play',
          type: Button,
          action: '$rewind',
          scaleX: -1,
        },
        PlayPause: {
          w: 108,
          h: 108,
          flexItem: { marginRight: 21 },
          icon: 'play',
          type: Button,
          action: '$playPause',
          bg: 0x999e86ff,
          bgFocus: 0xff9e86ff,
        },
        Forward: {
          icon: 'play',
          type: Button,
          action: '$forward',
        },
        Stop: {
          flexItem: { marginLeft: 21 },
          icon: 'stop',
          type: Button,
          action: '$stop',
        },
      },
      ProgressBar: {
        y: h => h - 204,
        h: 22,
        w: w => w,
        Background: {
          y: h => h / 2,
          mountY: 0.5,
          h: 6,
          w: w => w,
          rect: true,
          color: 0xcc371b5f,
        },
        InnerProgress: {
          rect: true,
          colorLeft: 0x00ffffff,
          colorRight: 0xffbda4f5,
          x: 0,
          w: 0,
          y: h => h / 2,
          mountY: 0.5,
          h: 6,
        },
        Indicator: {
          w: 22,
          h: 22,
          mount: 0.5,
          color: 0x999e86ff,
          x: 0,
          y: h => h / 2,
          rect: true,
          texture: Lightning.Tools.getRoundRect(22, 22, 11, 0, undefined, true, 0xffffffff),
          InnerIndicator: {
            w: 10,
            h: 10,
            mount: 0.5,
            x: w => w / 2,
            y: h => h / 2,
            rect: true,
            texture: Lightning.Tools.getRoundRect(10, 10, 5, 0, undefined, true, 0xffffffff),
          },
        },
      },
      CurrentTime: {
        x: 120,
        y: h => h - 234,
        mountY: 1,
        text: {
          fontWeight: 200,
          fontSize: 26,
          text: '',
        },
      },
      Duration: {
        x: w => w - 120,
        y: h => h - 234,
        mount: 1,
        text: {
          fontSize: 26,
          text: '',
        },
      },
    }
  }

  set duration(v) {
    this._duration = v
  }

  get duration() {
    return this._duration || 0.0001
  }

  set currentTime(v) {
    const ratio = Math.round((v / this.duration) * 1000) / 1000
    this.tag('InnerProgress').setSmooth('w', this.tag('ProgressBar').renderWidth * ratio)
    this.tag('Indicator').setSmooth('x', this.tag('ProgressBar').renderWidth * ratio)
    this.tag('CurrentTime').text = formatTime(v || 0)
    this.tag('Duration').text = formatTime(this.duration || 0)
  }

  set playing(v) {
    this.tag('PlayPause').icon = v === true ? 'pause' : 'play'
  }

  set muted(v) {
    this.tag('Mute').icon = v === true ? 'muted' : 'unmuted'
  }

  set size(v) {
    this.tag('Resize').icon = v === 'small' ? 'unshrink' : 'shrink'
  }

  set loop(v) {
    this.tag('Loop').icon = v === true ? 'loop' : 'unloop'
  }

  set visible(v) {
    this.tag('Visible').icon = v === true ? 'hidden' : 'visible'
  }

  set title(v) {
    this.tag('Title').text = v
  }

  set subtitle(v) {
    this.tag('Subtitle').text = v
  }

  _init() {
    this._index = 0
    this._interfaceVisible = true
    this._timeout = null
    this._setInterfaceTimeout()
  }

  _toggleInterface(visible) {
    this.patch({
      smooth: {
        y: [visible ? 0 : 50],
        alpha: [visible ? 1 : 0],
      },
    })
    this.transition('y').on('finish', () => {
      this._interfaceVisible = visible
    })
    if (visible) {
      this._setInterfaceTimeout()
    }
  }

  _setInterfaceTimeout() {
    // Clear timeout if it already exists
    if (this._timeout) {
      clearTimeout(this._timeout)
    }

    this._timeout = setTimeout(() => {
      this._toggleInterface(false)
    }, interfaceTimeout)
  }

  _captureKey() {
    this._toggleInterface(true)
    return !this._interfaceVisible
  }

  _handleLeft() {
    this._index = Math.max(0, this._index - 1)
  }

  _handleRight() {
    this._index = Math.min(this.tag('Buttons').children.length - 1, this._index + 1)
  }

  _getFocused() {
    return this.tag('Buttons').children[this._index]
  }
}
