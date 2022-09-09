import { Lightning } from '@lightningjs/sdk'
import isEqual from 'lodash/isEqual'

import {
  MENU_ITEM_HEIGHT,
  MENU_ITEM_WIDTH,
  MENU_ITEM_TEXT_COLOR,
  SELECTED_BG_OFFSET,
  MENU_GUTTER,
  MENU_WIDTH,
} from './constants'
import MenuItem from './MenuItem'

const FOCUS_BG_COLOR = 0xffcc0033
const TOUCHED_BG_COLOR = 0xff04b2d9

export default class Menu extends Lightning.Component {
  static $itemsY = Menu.bindProp('_itemsY');
  static $itemsYSmooth = Menu.bindProp('_itemsYSmooth', ({_itemsYSmooth}) => ({y: _itemsYSmooth}))
  static $isItemFocussed = Menu.bindProp('_isItemFocussed');
  static $touchedVisible = Menu.bindProp('_touchedVisible');

  static _template() {
    return {
      TouchedBackground: {
        rect: true,
        color: TOUCHED_BG_COLOR,
        w: MENU_WIDTH,
        h: MENU_ITEM_HEIGHT,
        y: -SELECTED_BG_OFFSET,
        visible: this.$touchedVisible,
      },
      FocusBackground: {
        rect: true,
        color: FOCUS_BG_COLOR,
        w: MENU_WIDTH,
        h: MENU_ITEM_HEIGHT,
        y: -SELECTED_BG_OFFSET,
        visible: this.$isItemFocussed,
      },
      Items: {
        x: MENU_GUTTER,
        y: this.$itemsY,
        smooth: this.$itemsYSmooth
      },
      FocusArrow: {
        x: MENU_ITEM_WIDTH + MENU_GUTTER,
        visible: this.$isItemFocussed,
        text: { text: '>', fontFace: 'Regular', fontSize: 50, color: MENU_ITEM_TEXT_COLOR },
      },
    }
  }

  _init() {
    this._selectedIndex = 0
    this._itemsY = 0
    this._itemsYSmooth = 0
    this._isItemFocussed = false
    this._touchedVisible = false
  }

  set showTouched(showTouched) {
    this._showTouched = showTouched
  }

  get items() {
    return this.tag('Items').children
  }

  set items(v) {
    if (!isEqual(v, this.dataItems)) {
      this.dataItems = v
      this.tag('Items').children = v.map((el, idx) => {
        return {
          type: MenuItem,
          label: el.label,
          value: el.value,
          y: idx * MENU_ITEM_HEIGHT,
          signals: {
            previousItem: '_previousItem',
            nextItem: '_nextItem',
            itemFocussed: '_itemFocussed',
            itemUnfocussed: '_itemUnfocussed',
          },
          passSignals: {
            leftSelect: true,
            rightSelect: true,
            enterSelect: true,
          },
        }
      })
      this._resetItems()
    }
  }

  _resetItems() {
    this._itemsY = 0
    this._touchedVisible = false
    this._selectedIndex = 0
  }

  _setIndex(i) {
    this._itemsYSmooth = i * -90
    this._selectedIndex = i
  }

  _getFocused() {
    return this.tag('Items').children[this._selectedIndex]
  }

  _previousItem() {
    this._setIndex(Math.max(0, this._selectedIndex - 1))
    this._refocus()
  }

  _nextItem() {
    this._setIndex(Math.min(this.items.length - 1, this._selectedIndex + 1))
    this._refocus()
  }

  _itemFocussed(value, label) {
    this.signal('itemFocussed', value, label)
    this._isItemFocussed = true
    if (this._showTouched) this._touchedVisible = true
  }

  _itemUnfocussed(value, label) {
    this.signal('itemUnfocussed', value, label)
    this._isItemFocussed = false
  }
}
