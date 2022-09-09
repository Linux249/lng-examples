import {Lightning, Utils} from '@lightningjs/sdk';
import Colors from '@/Colors';
import List from '@/blocks/List.js';
import Button from '../../components/Button.js';

export default class InputDisplay extends Lightning.Component {
    static _template() {
        return {
            DisplayBlocks: {type: List, orientation: 'horizontal', spacing: 140}
        }
    }

    _init() {
        const items = ['', '', '', ''].map(() => {
            return {type: DisplayBlock, w: 175, h: 175, fontSize: 90, autoResize: false}
        });
        this.tag('DisplayBlocks').addItems(items);
    }

    feed(value, reset) {
        let targetValue = value;
        if(reset) {
            this.tag('DisplayBlocks').items[targetValue.length].label = '';
        }
        else {
            if(isNaN(targetValue) || targetValue.length > 4) {
                return this._value;
            }
            this.tag('DisplayBlocks').items[targetValue.length - 1].label = targetValue.charAt(targetValue.length - 1);
            if(targetValue.length === 4) {
                this.signal('onPinComplete');
            }
        }
        this._value = targetValue;
    }

    reset() {
        this.tag('DisplayBlocks').items.forEach((item) => {
            item.reset();
        });
        this._value = '';
    }
}

class DisplayBlock extends Button {
    _init() {
        super._init();
        this.patch({
            Icon: {mount: 0.5, x: w => w / 2, y: h => h / 2, color: Colors.get('label'), src: Utils.asset('images/mask.png')}
        });
    }

    _setup() {
        const label = this.tag('Label');
        label.on('txLoaded', () => {
            const text = label.text.text;
            if(this._label.length !== 0 && text !== '\u2022') {
                setTimeout(() => {
                    this.tag('Icon').alpha = 1;
                    this.tag('Label').alpha = 0;
                }, 400)
            }
        });
    }

    _update() {
        if(!this.active) {
            return;
        }

        this.patch({
            Background: {color: Colors.get('black')},
            Label: {
                alpha: 1, text: {text: this._label, fontSize: this._fontSize}
            },
            Icon: {alpha: 0}
        });
    }

    reset() {
        this.label = '';
        this.patch({
            Icon: {alpha: 0}
        });
    }
}