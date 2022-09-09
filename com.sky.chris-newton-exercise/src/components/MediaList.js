import { Lightning } from '@lightningjs/sdk'
import MediaListItem from './MediaListItem'

export default class MediaList extends Lightning.Component {
  static _template() {
    return {}
  }
  _init() {
    this.index = 0
  }
  set items(items) {
    this.children = items.map((item, index) => {
      return {
        ref: 'MediaListItem-' + index, //optional, for debug purposes
        type: MediaListItem,
        x: index * 240,
        item, //passing the item as an attribute
      }
    })
  }
  _getFocused() {
    return this.children[this.index]
  }
  _handleLeft() {
    if (this.index > 0) {
      this.index--
    }
    this.signal('updateHeader', this.index)
  }
  _handleRight() {
    // we don't know exactly how many items the list can have
    // so we test it based on this component's child list
    if (this.index < this.children.length - 1) {
      this.index++
    }
    this.signal('updateHeader', this.index)
  }
}
