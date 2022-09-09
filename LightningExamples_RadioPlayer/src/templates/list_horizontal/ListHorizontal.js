import {Lightning} from '@lightningjs/sdk';
import {List} from '@/blocks';
import {ImageCell} from '@/components';
import Colors from '@/Colors';


export default class ListHorizontal extends Lightning.Component {
    static _template() {
        return {
            w: 1920, h: 1080, rect: true, color: Colors.get('background'),
            Header: {x: 90, y: 100, text: {text: 'Horizontal Orientated List', fontFace: 'Medium', fontSize: 50}},
            List: {x: 90, y: 220, type: List, orientation: 'horizontal'}
        }
    }

    _setup() {
        const items = [];
        for(let i = 0; i < 4; i++) {
            items.push({margin: 30, type: ImageCell, index: 10 + i});
        }
        this.tag('List').setItems(items);
    }

    easing() {
        return 'fade';
    }

    _getFocused() {
        return this.tag('List');
    }
}