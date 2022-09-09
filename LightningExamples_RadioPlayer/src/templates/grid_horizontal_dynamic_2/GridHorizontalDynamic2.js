import {Lightning} from '@lightningjs/sdk';
import {ImageCell, DynamicGrid} from '@/components';
import Colors from '@/Colors';

export default class GridHorizontalDynamic2 extends Lightning.Component {
    static _template() {
        return {
            w: 1920, h: 1080, rect: true, color: Colors.get('background'),
            Header: {x: 90, y: 100, text: {text: 'Horizontal Orientated Grid with Dynamic Focus', fontFace: 'Medium', fontSize: 50}},
            Grid: {x: 90, y: 220, w: 1920-180, h: 730, orientation: 'horizontal', spacing: 30, type: DynamicGrid}
        }
    }

    _setup() {
        this.tag('Grid').setItems([
            {type: ImageCell, h: 250, w: 700, index: 10},
            {type: ImageCell, h: 450, w: 700, index: 11},
            {type: ImageCell, h: 450, w: 700, index: 12},
            {type: ImageCell, h: 250, w: 700, index: 13},
            {type: ImageCell, h: 250, w: 700, index: 14},
            {type: ImageCell, h: 450, w: 700, index: 15},
            {type: ImageCell, h: 450, w: 700, index: 16},
            {type: ImageCell, h: 250, w: 700, index: 17},
            {type: ImageCell, h: 250, w: 700, index: 18},
            {type: ImageCell, h: 450, w: 700, index: 19},
            {type: ImageCell, h: 450, w: 700, index: 20},
            {type: ImageCell, h: 250, w: 700, index: 21},
            {type: ImageCell, h: 250, w: 700, index: 22},
            {type: ImageCell, h: 450, w: 700, index: 23},
            {type: ImageCell, h: 450, w: 700, index: 24},
            {type: ImageCell, h: 250, w: 700, index: 25},
            {type: ImageCell, h: 250, w: 700, index: 26},
            {type: ImageCell, h: 450, w: 700, index: 27},
            {type: ImageCell, h: 450, w: 700, index: 28},
            {type: ImageCell, h: 250, w: 700, index: 29},
        ]);
    }

    easing() {
        return 'fade';
    }

    _getFocused() {
        return this.tag('Grid');
    }
}