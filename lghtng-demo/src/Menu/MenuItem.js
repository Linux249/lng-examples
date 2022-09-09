import { Lightning } from '@lightningjs/sdk'
import {
  MENU_ITEM_HEIGHT,
  MENU_ITEM_TEXT_COLOR,
  MENU_WIDTH,
  SELECTED_BG_OFFSET,
  MENU_GUTTER,
} from './constants'

export default class MenuItem extends Lightning.Component {
  static $label = MenuItem.bindProp('label')
  static $showSlideLine = MenuItem.bindProp('_showSlideLine', (menuItem) => {
    const { _showSlideLine } = menuItem

    if (_showSlideLine) menuItem._slideLineAnimation.start()
    else menuItem._slideLineAnimation.stop()

    return _showSlideLine
  })

  static _template() {
    return {
      SlideLine: {
        rect: true,
        visible: this.$showSlideLine,
        w: 0,
        h: SELECTED_BG_OFFSET,
        x: -MENU_GUTTER,
        y: MENU_ITEM_HEIGHT - SELECTED_BG_OFFSET * 2,
        color: MENU_ITEM_TEXT_COLOR,
      },
      Label: {
        text: { text: this.$label, fontFace: 'Regular', fontSize: 50, color: MENU_ITEM_TEXT_COLOR },
      },
    }
  }

  _constructor() {
    this._label = ''
  }

  _init() {
    this._visible = false
    this._slideLineAnimation = this.tag('SlideLine').animation({
      delay: 0.1,
      duration: 0.3,
      repeat: 0,
      stopMethod: 'immediate',
      actions: [{ p: 'w', v: { 0: 0, 1: MENU_WIDTH } }],
    })
  }

  set value(v) {
    this._val = v
  }

  get value() {
    return this._val
  }

  _focus() {
    this.signal('itemFocussed', this._val, this.label)
    this._showSlideLine = true
  }

  _unfocus() {
    this.signal('itemUnfocussed', this._val, this.label)
    this._showSlideLine = false
  }

  _handleUp() {
    this.signal('previousItem')
  }

  _handleDown() {
    this.signal('nextItem')
  }

  _handleLeft() {
    this.signal('leftSelect', this._val, this.label)
  }

  _handleRight() {
    this.signal('rightSelect', this._val, this.label)
  }

  _handleEnter() {
    this.signal('enterSelect', this._val, this.label)
  }
}
