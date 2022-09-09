import {Lightning, Utils} from '@lightningjs/sdk';
import {List} from '@/blocks';
import {Item, ImageCell} from '@/components';
import Colors from '@/Colors';

export default class ListCombination extends Lightning.Component {
    static _template() {
        return {
            w: 1920, h: 1080, rect: true, color: Colors.get('background'),
            Header: {x: 90, y: 100, text: {text: 'Horizontal and Vertical Orientated List', fontFace: 'Medium', fontSize: 50}},
            VerticalList: {x: 90, y: 220, type: List},
            HorizontalList: {x: 350, y: 220, type: List, orientation: 'horizontal'},
        }
    }

    _setup() {
        this.tag('VerticalList').setItems([
            {type: Item, item: {label: 'Search'}},
            {type: Item, item: {label: 'Home'}},
            {type: Item, item: {label: 'Movies'}},
            {type: Item, item: {label: 'Pictures'}},
            {type: Item, item: {label: 'Settings'}}
        ]);

        const items = [];
        for (let i = 0; i < 3; i++) {
            items.push({margin: 30, h: 370, w: 450, type: ImageCell, index: 10 + i});
        }
        this.tag('HorizontalList').setItems(items);
        this._setState('VerticalList');
    }

    easing() {
        return 'fade';
    }

    static _states() {
        return [
            class VerticalList extends this {
                _getFocused() {
                    return this.tag('VerticalList');
                }

                _handleRight() {
                    this._setState('HorizontalList');
                }
            },
            class HorizontalList extends this {
                _getFocused() {
                    return this.tag('HorizontalList');
                }

                _handleLeft() {
                    this._setState('VerticalList');
                }
            }
        ]
    }
}