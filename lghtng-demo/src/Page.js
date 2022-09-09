import { Lightning } from '@lightningjs/sdk'

import { APP_HEIGHT } from './constants'
import Carousel from './Carousel'
import Menu, { MENU_GUTTER, MENU_WIDTH } from './Menu'
import { generateItems, generateImages } from './utils'

const slidePaneTransition = {
  focused: {
    x: 0,
  },
  unfocused: {
    x: -MENU_WIDTH + MENU_GUTTER,
  },
}

export default class Page extends Lightning.Component {
  static $subMenuItems = Page.bindProp('_subMenuItems')
  static $carouselItems = Page.bindProp('_carouselItems')
  static $slidePaneSmooth = Page.bindProp('_sideMenuActive', ({ _sideMenuActive }) =>
    _sideMenuActive ? slidePaneTransition.focused : slidePaneTransition.unfocused
  )

  static _template() {
    return {
      SlidePane: {
        smooth: this.$slidePaneSmooth,
        Carousel: {
          type: Carousel,
          y: 250,
          x: MENU_WIDTH * 2,
          items: this.$carouselItems,
          signals: {
            deselect: '_deselectCarousel',
          },
        },
        MenuBackground: {
          rect: true,
          w: MENU_WIDTH * 2,
          h: APP_HEIGHT,
          color: 0xff000000,
        },
        SubMenu: {
          type: Menu,
          y: 250,
          x: MENU_WIDTH,
          items: this.$subMenuItems,
          signals: {
            leftSelect: '_subItemLeftSelected',
            rightSelect: '_subItemRightSelected',
            enterSelect: '_subItemEnterSelected',
            itemFocussed: '_subItemFocussed',
          },
        },
        SideMenu: {
          type: Menu,
          y: 250,
          showTouched: true,
          items: [
            { label: 'one', value: generateItems(1) },
            { label: 'two', value: generateItems(2) },
            { label: 'three', value: generateItems(3) },
            { label: 'four', value: generateItems(4) },
          ],
          signals: {
            rightSelect: '_sideItemRightSelected',
            enterSelect: '_sideItemEnterSelected',
            itemFocussed: '_sideItemFocussed',
            itemUnfocussed: '_sideItemUnfocussed',
          },
        },
      },
    }
  }

  _constructor() {
    this._subMenuItems = []
    this._carouselItems = []
    this._sideMenuActive = false
  }

  _init() {
    this._setState('SideMenu')
  }

  static _states() {
    return [
      class SideMenu extends this {
        _getFocused() {
          return this.tag('SideMenu')
        }
      },
      class SubMenu extends this {
        _getFocused() {
          return this.tag('SubMenu')
        }
      },
      class Carousel extends this {
        _getFocused() {
          return this.tag('Carousel')
        }
      },
    ]
  }

  _sideItemRightSelected() {
    this._setState('SubMenu')
  }

  _sideItemEnterSelected(value, label) {
    console.log('_sideItemEnterSelected', label, value)
  }

  _sideItemFocussed(value) {
    this._subMenuItems = value
    this._sideMenuActive = true;
  }

  _sideItemUnfocussed() {
    this._sideMenuActive = false;
  }


  _subItemLeftSelected() {
    this._setState('SideMenu')
  }

  _subItemRightSelected() {
    this._setState('Carousel')
  }

  _subItemEnterSelected(value, label) {
    console.log('_subItemEnterSelected', value, label)
  }

  _subItemFocussed(value) {
    this._carouselItems = generateImages(value)
  }

  _deselectCarousel() {
    this._setState('SubMenu')
  }
}
