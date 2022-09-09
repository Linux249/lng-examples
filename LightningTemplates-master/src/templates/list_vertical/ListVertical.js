import {Lightning, Utils} from '@lightningjs/sdk';
import {List} from '@/blocks';
import Colors from '@/Colors';
import Item from '@/components/Item.js';

export default class ListVertical extends Lightning.Component {
    static _template() {
        return {
            w: 1920, h: 1080, rect: true, color: Colors.get('background'),
            Header: {x: 90, y: 100, text: {text: 'Vertical Orientated List', fontFace: 'Medium', fontSize: 50}},
            List: {x: 90, y: 220, type: List}
        }
    }

    _setup() {
        this.tag('List').setItems([
            {type: Item, item: {label: 'Search'}},
            {type: Item, item: {label: 'Home'}},
            {type: Item, item: {label: 'Movies'}},
            {type: Item, item: {label: 'Pictures'}},
            {type: Item, item: {label: 'Settings'}}
        ]);
    }

    easing() {
        return 'fade';
    }

    _getFocused() {
        return this.tag('List');
    }
}