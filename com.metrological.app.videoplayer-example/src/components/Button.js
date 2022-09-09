import { Lightning, Utils } from '@lightningjs/sdk'

export default class Button extends Lightning.Component {
  static _template() {
    return {
      h: 50,
      w: 50,
      color: 0x80cccccc,
      rect: true,
      Icon: {
        w: 40,
        h: 40,
        x: 5,
        y: 5,
      },
      Label: {
        x: w => w / 2,
        y: h => h / 2,
        mount: 0.5,
        text: {
          text: '',
          textColor: 0xff000000,
        },
      },
    }
  }

  set index(v) {
    this.x = v * 70
  }

  set icon(v) {
    if (v) {
      this.tag('Icon').src = Utils.asset('images/' + v + '.png')
    }
  }

  set label(v) {
    if (v) {
      this.tag('Label').text.text = v
    }
  }

  _handleEnter() {
    this.action && this.fireAncestors(this.action)
  }

  _focus() {
    this.setSmooth('color', 0xbb0078ac)
  }

  _unfocus() {
    this.setSmooth('color', 0x80cccccc)
  }
}
