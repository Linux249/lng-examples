import {Lightning} from '@lightningjs/sdk';
import Colors from '@/Colors';

export default class Item extends Lightning.Component {
    static _template() {
        return {
            w: w => w, h: 70,
            Background: {w: w => w, h: h=> h, rect: true, color: Colors.get('darkGrey'), shader: {type: Lightning.shaders.RoundedRectangle, radius: 3}},
            Label: {x: w => w / 2, y: h => h / 2, color: Colors.get('label'), mountX: 0.5, mountY: 0.4, text: {fontFace: 'Medium', fontSize: 32}}
        }
    }

    set item(obj) {
        this._item = obj;
        this._update();
    }

    _update() {
        if(!this.active) {
            return;
        }
        const {label = 'X'} = this._item || {};
        this.patch({
            Label: {text: {text: label}}
        });
    }

    _firstActive() {
        this._update();
    }

    _focus() {
        this.patch({
            Background: {smooth: {color: Colors.get('focus')}},
            Label: {smooth: {color: Colors.get('labelFocus')}}
        });
    }

    _unfocus() {
        this.patch({
            Background: {smooth: {color: Colors.get('darkGrey')}},
            Label: {smooth: {color: Colors.get('label')}}
        });
    }

    static get width() {
        return 70;
    }

    static get height() {
        return 70;
    }

    static get margin() {
        return 5;
    }
}