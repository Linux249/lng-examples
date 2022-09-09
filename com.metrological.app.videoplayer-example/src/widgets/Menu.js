import { Lightning, Router } from '@lightningjs/sdk'

const menuItems = [
  { label: 'Simple', route: 'simple' },
  { label: 'Advanced', route: 'advanced' },
]

export default class Menu extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 100,
      rect: true,
      color: 0x44000000,
      Items: {
        x: 60,
        y: h => h / 2,
        mountY: 0.5,
        flex: {},
      },
      Focus: {
        y: h => h / 2 + 25,
        h: 4,
        rect: true,
        color: 0x00ffffff,
      },
    }
  }

  get activeItem() {
    return this.tag('Items').children[this._index]
  }

  _init() {
    this._index = 0
    this._activeIndex = 0
    this.tag('Items').children = menuItems.map(item => {
      return { type: MenuItem, item }
    })
    this.tag('Items').children[this._index].on('txLoaded', () => {
      this._setActiveItem(0, true)
    })
  }

  _handleDown() {
    Router.restoreFocus()
  }

  _handleEnter() {
    this._activeIndex = this._index
    Router.navigate(this.activeItem.route)
  }

  _handleLeft() {
    if (this._index > 0) {
      this._setActiveItem(this._index - 1)
    }
  }

  _handleRight() {
    if (this._index < this.tag('Items').children.length - 1) {
      this._setActiveItem(this._index + 1)
    }
  }

  _setActiveItem(index, immediate) {
    this.activeItem.setFocus(false, immediate)
    this._index = index
    this.activeItem.setFocus(true, immediate)
    this.tag('Focus').patch({
      smooth: {
        x: 60 + this.activeItem.finalX,
        w: [this.activeItem.finalW, { duration: immediate ? 0 : 0.2 }],
      },
    })
  }

  _focus() {
    this.tag('Focus').setSmooth('color', 0xffffffff)
    this.tag('Focus').patch({
      x: 60 + this.activeItem.finalX,
      w: this.activeItem.finalW,
    })
  }

  _unfocus() {
    this.tag('Focus').color = 0x00ffffff
    this._setActiveItem(this._activeIndex)
  }

  _getFocused() {
    return this.activeItem
  }
}

class MenuItem extends Lightning.Component {
  static _template() {
    return {
      flexItem: { marginRight: 72 },
      color: 0xff666666,
      text: {
        fontSize: 30,
      },
    }
  }

  set item(v) {
    this._item = v

    this.patch({
      text: {
        text: this._item.label,
      },
    })
  }

  get item() {
    return this._item
  }

  get route() {
    return this._item.route
  }

  setFocus(state, immediate) {
    this.setSmooth('color', state ? 0xffffffff : 0xff666666, { duration: immediate ? 0 : 0.2 })
  }
}
