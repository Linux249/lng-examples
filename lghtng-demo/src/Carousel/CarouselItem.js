import { Lightning } from '@lightningjs/sdk'

import { IMAGE_WIDTH, IMAGE_HEIGHT, EXPANDED_IMAGE_WIDTH, EXPANDED_IMAGE_HEIGHT } from './constants'

const ImageStatus = {
  LOADED: 'LOADED',
  LOADING: 'LOADING',
}
const ImageStatusAlpha = {
  [ImageStatus.LOADING]: 0.05,
  [ImageStatus.LOADED]: 1
}

const FocusTranistions = {
  focused: {
    w: EXPANDED_IMAGE_WIDTH,
    h: EXPANDED_IMAGE_HEIGHT,
    x: -(EXPANDED_IMAGE_WIDTH - IMAGE_WIDTH) / 2,
    y: -(EXPANDED_IMAGE_HEIGHT - IMAGE_HEIGHT) / 2,
  },
  unfocused: {
    w: IMAGE_WIDTH,
    h: IMAGE_HEIGHT,
    x: 0,
    y: 0,
  }
}

export default class CarouselItem extends Lightning.Component {
  static $imageSrc = CarouselItem.bindProp('_src', ({ _src }) => _src)
  static $imageAlpha = CarouselItem.bindProp('_loaded', ({ _loaded }) => ImageStatusAlpha[_loaded])
  static $focusTransition = CarouselItem.bindProp('_isFocused', ({ _isFocused }) =>
    _isFocused ? FocusTranistions.focused : FocusTranistions.unfocused
  )

  static _template() {
    return {
      Background: {
        ...FocusTranistions.unfocused,
        smooth: this.$focusTransition,
        rect: true,
        color: 0xff333333,
      },
      Image: {
        ...FocusTranistions.unfocused,
        alpha: this.$imageAlpha,
        smooth: this.$focusTransition,
        src: this.$imageSrc,
      },
    }
  }

  _constructor() {
    this._src = undefined
  }

  _init() {
    this._loaded = ImageStatus.LOADING

    this.tag('Image').on('txLoaded', () => {
      this._loaded = ImageStatus.LOADED
    })

    this.tag('Image').on('txError', () => {
      console.error('texture failed to load: ' + this.tag('Image').src)
    })
  }

  set imgSrc(s) {
    this._src = s
  }

  _focus() {
    this._isFocused = true
  }

  _unfocus() {
    this._isFocused = false
  }

  _handleLeft() {
    this.signal('leftSelect', this._src)
  }

  _handleRight() {
    this.signal('rightSelect', this._src)
  }
}
