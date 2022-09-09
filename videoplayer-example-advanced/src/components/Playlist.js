import { Lightning } from '@lightningjs/sdk'

export default class Playlist extends Lightning.Component {
  static _template() {
    return {
      flex: { direction: 'row' },
    }
  }

  set videos(v) {
    this.children = v.map(item => ({
      type: PlaylistTile,
      flexItem: { marginRight: 20 },
      title: item,
      highlight: false,
    }))
  }

  set selected(v) {
    if (this._selected !== null) {
      this.children[this._selected].highlight = false
    }
    this._selected = v
    if (this._selected !== null) {
      this.children[this._selected].highlight = true
    }
  }

  _init() {
    this._index = 0
    this._selected = null
  }

  _handleLeft() {
    this._index = Math.max(0, this._index - 1)
    this._slideList()
  }

  _handleRight() {
    this._index = Math.min(this.children.length - 1, this._index + 1)
    this._slideList()
  }

  _handleEnter() {
    this.signal('itemSelected', this._index)
  }

  _slideList() {
    this.patch({
      smooth: {
        x: [-320 * this._index],
      },
    })
  }

  _getFocused() {
    return this.children[this._index]
  }
}

class PlaylistTile extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 300,
      h: 100,
      color: 0x80cccccc,
      Text: {
        x: w => w / 2,
        y: h => h / 2,
        mount: 0.5,
        text: {
          text: '',
          fontSize: 26,
          lineHeight: 26,
        },
      },
    }
  }

  set title(v) {
    this.patch({
      Text: {
        text: {
          text: v.slice(v.lastIndexOf('/') + 1, v.length),
        },
      },
    })
  }

  set highlight(v) {
    this._highlighted = v
    this._toggleHighlight(v)
  }

  _toggleHighlight(v) {
    this.patch({
      color: v ? 0x80cccccc : 0x80000000,
    })
  }

  _focus() {
    this._toggleHighlight(true)
  }

  _unfocus() {
    if (!this._highlighted) {
      this._toggleHighlight(false)
    }
  }

  _getFocused() {
    return this
  }
}
