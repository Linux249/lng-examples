import {Lightning, Utils} from '@lightningjs/sdk';
import Colors from '@/Colors';
import ImageCell from "@/components/ImageCell.js";
import {Grid} from '@/blocks';

export default class GridHorizontal extends Lightning.Component {
    static _template() {
        return {
            w: 1920, h: 1080, rect: true, color: Colors.get('background'),
            HeaderIcon: {x: 90, y: 70, src: Utils.asset('warning_icon_small.png')},
            Header: {x: 180, y: 65, text: {text: 'Horizontal Orientated Grid', fontFace: 'Bold', fontSize: 72}},
            Grid: {x: 90, y: 220, w: 800, h: 730, orientation: 'horizontal', spacing: 30, type: Grid}
        }
    }

    _setup() {
        this.tag('Grid').setItems([
            {type: ImageCell, h: 730, w: 700, index: 10},
            {type: ImageCell, h: 350, w: 500, index: 11},
            {type: ImageCell, h: 350, w: 500, index: 12},
            {type: ImageCell, h: 223, w: 300, index: 13},
            {type: ImageCell, h: 223, w: 300, index: 14},
            {type: ImageCell, h: 223, w: 300, index: 15}
        ]);
    }

    easing() {
        return 'fade';
    }

    _getFocused() {
        return this.tag('Grid');
    }
}