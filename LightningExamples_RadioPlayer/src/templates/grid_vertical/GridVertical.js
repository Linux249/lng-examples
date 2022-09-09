import {Lightning, Utils} from '@lightningjs/sdk';
import Colors from '@/Colors';
import ImageCell from "@/components/ImageCell.js";
import {Grid} from '@/blocks';

export default class GridVertical extends Lightning.Component {
    static _template() {
        return {
            w: 1920, h: 1080, rect: true, color: Colors.get('background'),
            Header: {x: 90, y: 100, text: {text: 'Vertical Orientated Grid', fontFace: 'Medium', fontSize: 50}},
            Grid: {x: 90, y: 220, w: 800, h: 600, orientation: 'vertical', spacing: 20, type: Grid}
        }
    }

    _setup() {
        this.tag('Grid').setItems([
            {type: ImageCell, h: 300, w: 730, index: 10},
            {type: ImageCell, h: 295, w: 350, index: 11},
            {type: ImageCell, h: 295, w: 350, index: 12},
            {type: ImageCell, h: 193, w: 230, index: 13},
            {type: ImageCell, h: 193, w: 230, index: 14},
            {type: ImageCell, h: 193, w: 230, index: 15}
        ]);
    }

    easing() {
        return 'fade';
    }

    _getFocused() {
        return this.tag('Grid');
    }
}