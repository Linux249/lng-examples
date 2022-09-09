import { Lightning } from '@lightningjs/sdk'

export default class Item extends Lightning.Component {
  static _template() {
    return {
      text: { text: '', fontFace: 'pixel', fontSize: 50 },
    }
  }

  // will be automatically called
  set label(v) {
    this.text.text = v
  }

  // will be automatically called
  set action(v) {
    this._action = v
  }

  // will be automatically called
  get action() {
    return this._action
  }

  set value(v) {
    this._value = v
  }

  get value() {
    return this._value
  }

  set details(v) {
    this._details = v
  }

  get details() {
    return this._details
  }
}
