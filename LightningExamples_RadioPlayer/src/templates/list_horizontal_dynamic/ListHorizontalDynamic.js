import {Lightning, Utils} from '@lightningjs/sdk';
import Colors from '@/Colors';
import {DynamicList, ImageCell} from '@/components';

export default class ListHorizontalDynamic extends Lightning.Component {
    static _template() {
        return {
            w: 1920, h: 1080, rect: true, color: Colors.get('background'),
            List: {type: DynamicList, orientation: 'horizontal', x: 90, y: 220, w: 1740, h: 370},
            Header: {x: 90, y: 100, text: {text: 'Horizontal List with Dynamic Focus', fontFace: 'Medium', fontSize: 50}}
        }
    }

    _setup() {
        const items = [];
        for(let i = 0; i < 14; i++) {
            items.push({margin: 30, type: ImageCell, index: 10 + i});
        }

        this.tag('List').setItems(items);
    }

    _getFocused() {
        return this.tag('List');
    }

    easing() {
        return 'fade';
    }
}