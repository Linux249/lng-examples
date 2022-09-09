import { Lightning, Utils } from '@lightningjs/sdk'

export default class Button extends Lightning.Component {
  static _template() {
    return {
      w: 50,
      h: 50,
      Background: {
        w: w => w,
        h: h => h,
        color: 0x80cccccc,
        rect: true,
        alpha: 0,
        texture: Lightning.Tools.getRoundRect(108, 108, 54, 0, undefined, true, 0xffffffff),
      },
      Icon: {
        mount: 0.5,
        x: w => w / 2,
        y: h => h / 2,
        color: 0xffffffff,
        w: 40,
        h: 40,
      },
    }
  }

  set bgFocus(v) {
    this._bgFocus = v
  }

  set bg(v) {
    this._bg = v
    this.tag('Background').color = v
    this.tag('Background').alpha = 1
  }

  set icon(v) {
    this.tag('Icon').src = Utils.asset('images/' + v + '.png')
  }

  _handleEnter() {
    this.action && this.fireAncestors(this.action)
  }

  _focus() {
    if (this._bg && this._bgFocus) {
      this.tag('Background').setSmooth('color', this._bgFocus)
    } else {
      this.tag('Background').setSmooth('alpha', 1.0)
    }
  }

  _unfocus() {
    if (this._bg && this._bgFocus) {
      this.tag('Background').setSmooth('color', this._bg)
    } else {
      this.tag('Background').setSmooth('alpha', 0)
    }
  }
}
