import {Lightning, Utils} from '@lightningjs/sdk';
import Colors from '@/Colors';
import {DynamicList, Item} from '@/components';

export default class ListExtendedExample1 extends Lightning.Component {
    static _template() {
        return {
            w: 1920, h: 1080, rect: true, color: Colors.get('background'),
            List: {type: DynamicList, x: 90, y: 220, w: 400, h: 780},
            FadeTop: {w: 1920, h: 230, rect: true, colorTop: Colors.get('background'), colorBottom: Colors.get('black', 0)},
            Header: {x: 90, y: 100, text: {text: 'Vertical List with Dynamic Focus', fontFace: 'Medium', fontSize: 50}}
        }
    }

    _setup() {
        const abc = 'abcdefghijklmnopqrstuvwxyz';
        const items = [];

        for(let i = 0; i < abc.length; i++) {
            items.push({type: Item, item: {label: abc.charAt(i).toUpperCase()}})
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