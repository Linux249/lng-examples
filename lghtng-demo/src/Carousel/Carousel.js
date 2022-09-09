import { Lightning } from '@lightningjs/sdk'

import CarouselItem from './CarouselItem'
import { IMAGE_WIDTH, IMAGE_MARGIN } from './constants'

export default class Carousel extends Lightning.Component {
  static $itemsX = Carousel.bindProp('_itemsX');
  static $itemsXSmooth = Carousel.bindProp('_itemsXSmooth', ({_itemsXSmooth}) => ({ x: _itemsXSmooth }))
  static $itemsAlpha = Carousel.bindProp('_isFocussed', ({ _isFocussed }) => _isFocussed ? 1 : 0.5 );

  static _template() {
    return {
      Items: {
        x: this.$itemsX,
        smooth: this.$itemsXSmooth,
        alpha: this.$itemsAlpha,
      },
    }
  }

  _constructor() {
    this._itemsX = IMAGE_MARGIN
    this._itemsXSmooth = undefined
  }

  _init() {
    this._selectedIndex = 0
    this._isFocussed = false
  }

  get items() {
    return this.tag('Items').children
  }

  set items(v) {
    this.tag('Items').children = v.map((img, i) => {
      return {
        type: CarouselItem,
        imgSrc: img.imgSrc,
        x: i * (IMAGE_WIDTH + IMAGE_MARGIN) + IMAGE_MARGIN,
        signals: {
          leftSelect: '_previousItem',
          rightSelect: '_nextItem',
        },
      }
    })
    this._resetItems()
  }

  _resetItems() {
    this._itemsX = 0;
    this._selectedIndex = 0
  }

  _setIndex(i) {
    this._itemsXSmooth = -(i * (IMAGE_WIDTH + IMAGE_MARGIN)) + 2 * IMAGE_MARGIN
    this._selectedIndex = i
  }

  _previousItem() {
    if (this._selectedIndex === 0) {
      this.signal('deselect')
    } else {
      this._setIndex(Math.max(0, this._selectedIndex - 1))
      this._refocus()
    }
  }

  _nextItem() {
    this._setIndex(Math.min(this.items.length - 1, this._selectedIndex + 1))
    this._refocus()
  }

  _focus() {
    this._isFocussed = true
  }

  _unfocus() {
    this._isFocussed = false
  }

  _getFocused() {
    return this.tag('Items').children[this._selectedIndex]
  }
}
