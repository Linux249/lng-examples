import {Lightning} from '@lightningjs/sdk';
import Colors from '@/Colors';

export default class Button extends Lightning.Component {
    static _template() {
        return {
            h: h => h,
            Background: {w: w => w, h: h=> h, rect: true, color: Colors.get('darkGrey', 0.3), shader: {type: Lightning.shaders.RoundedRectangle, radius: 3}},
            Label: {
                x: w => w / 2, y: h => h / 2, mountX: 0.5, mountY: 0.4, color: Colors.get('label'), text: {fontFace: 'Regular', fontSize: 30}
            }
        }
    }

    _construct() {
        //resizes the background/button to fit the text
        this._autoResize = true;
        //padding on both sides of text
        this._fontSize = 30;
        this._padding = 5;
        this._label = '';
    }

    set label(str) {
        this._label = str;
        this._update();
    }

    set fontSize(num) {
        this._fontSize = num;
    }

    get fontSize() {
        return this._fontSize;
    }

    set padding(num) {
        this._padding = num;
    }

    get padding() {
        return this._padding;
    }

    set autoResize(bool) {
        this._autoResize = bool;
    }

    get autoResize() {
        return this._autoResize;
    }

    _setup() {
        const label = this.tag('Label');
        label.on('txLoaded', () => {
            if(this._autoResize) {
                this.w = label.renderWidth + this._padding * 2;
            }
        });
    }

    _update() {
        if(!this.active) {
            return;
        }

        this.tag('Label').patch({
            text: {text: this._label, fontSize: this._fontSize}
        });
    }

    _active() {
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
            Background: {smooth: {color: Colors.get('darkGrey', 0.3)}},
            Label: {smooth: {color: Colors.get('label')}}
        });
    }

    static get height() {
        return 64;
    }
}