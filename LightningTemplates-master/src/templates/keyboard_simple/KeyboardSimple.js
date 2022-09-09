import Colors from '@/Colors';
import Keyboard from '@/blocks/Keyboard.js';
import {Lightning, Utils} from '@lightningjs/sdk';

export default class KeyboardSimple extends Lightning.Component {
    static _template() {
        return {
            w: 1920, h: 1080, rect: true, color: Colors.get('background'),
            Header: {x: 90, y: 100, text: {text: 'Simple Keyboard with Input Field', fontFace: 'Medium', fontSize: 50}},
            InputField: {x: 960, mountX: 0.5, y: 230, type: InputField},
            Keyboard: {
                y: 380, w: 1920, type: Keyboard, layout: 'ABC', config: keyboardConfig, signals: {onValueChanged: true}
            }
        }
    }

    _setup() {
        this.tag('Keyboard').inputField = this.tag('InputField');
    }

    _getFocused() {
        return this.tag('Keyboard');
    }
}

class InputField extends Lightning.Component {
    static _template() {
        return {
            w: 700, h: 80, rect: true, color: Colors.get('black'),
            Label: {
                x: 30, y: 40, mountY: 0.4, text: {fontFace: 'Regular', fontSize: 52}
            },
            Cursor: {
                x: 30, y: 15, h: 50, w: 2, rect: true, color: Colors.get('focus')
            }
        }
    }

    _construct() {
        this._value = '';
    }

    _init() {
        this._blinkAnimation = this.tag('Cursor').animation({
            duration: 1, repeat: -1, actions: [
                {p: 'alpha', v: {0: 1, 0.5: 0, 1: 1}}
            ]
        });

        const label = this.tag('Label');
        label.on('txLoaded', () => {
            this.tag('Cursor').x = label.x + label.renderWidth;
        });
    }

    _active() {
        this._blinkAnimation.start();
    }

    _inactive() {
        this._blinkAnimation.stop();
    }

    feed(value, reset) {
        this.tag('Label').text.text = value;
        this._value = value;

        if(reset && value.length === 0) {
            this.tag('Cursor').x = 30;
        }

        // return this._value;
    }

    get maxCharacters() {
        return 30;
    }

    get value() {
        return this._value;
    }
}

class Key extends Lightning.Component{
    static _template() {
        return {
            Background: {alpha: 0, w: w => w, h: h => h, rect: true, color: Colors.get('focus'), shader: {type: Lightning.shaders.RoundedRectangle, radius: 3}},
            Label: {mountX: 0.5, x: w => w / 2, color: Colors.get('label'), mountY: 0.4, y: h => h / 2, text: {fontFace: 'Medium', fontSize: 32}}
        }
    }

    set label(str) {
        this._label = str;
        if(this.active) {
            this.tag('Label').text.text = str.toUpperCase();
        }
    }

    get label() {
        return this._label;
    }

    _update() {
        if(!this.active) {
            return;
        }
        this.patch({
            Label: {text: this._label}
        });
    }

    _firstActive() {
        this._update();
    }

    _focus() {
        this.patch({
            Background: {smooth: {alpha: 1}},
            Label: {smooth: {color: Colors.get('labelFocus')}}
        });
    }

    _unfocus() {
        this.patch({
            Background: {smooth: {alpha: 0}},
            Label: {smooth: {color: Colors.get('label')}}
        });
    }

    static get width() {
        return 60;
    }
    static get height() {
        return 60;
    }
}

class ActionKey extends Key {
    _update() {
        if(!this.active) {
            return;
        }
        this.patch({
            Background: {alpha: 1, color: Colors.get('dark'), shader: {radius: 30}},
            Label: {text: this._label}
        });
    }

    _focus() {
        this.patch({
            Background: {smooth: {color: Colors.get('focus')}},
            Label: {smooth: {color: Colors.get('labelFocus')}}
        });
    }

    _unfocus() {
        this.patch({
            Background: {smooth: {color: Colors.get('dark')}},
            Label: {smooth: {color: Colors.get('label')}}
        });
    }

    static get width() {
        return 160;
    }
}

class ImgKey extends ActionKey{
    static _template() {
        return {
            ...super._template(),
            Img: {mount: 0.5, x: w => w / 2, y: h => h / 2}
        }
    }

    set img(src){
        this._imgSrc = src;
        this._update();
    }

    _update() {
        super._update();
        if(!this.active) {
            return;
        }
        this.patch({
            Img: {src: Utils.asset(this._imgSrc), color: Colors.get('label')},
            Label: {alpha: 0}
        });
    }

    _focus() {
        super._focus();
        this.tag('Img').setSmooth('color', Colors.get('labelFocus'));
    }

    _unfocus() {
        super._unfocus();
        this.tag('Img').setSmooth('color', Colors.get('label'));
    }

    _firstActive() {
        this._update();
    }
}

const keyboardConfig = {
    layouts: {
        'ABC': [
            ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            ['onLayout:123', 'onSpace', 'onClear', 'onDelete']
        ],
        '123': [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['onLayout:ABC', 'onSpace', 'onClear', 'onDelete']
        ]
    },
    offsets: {
        align: 'center',
        buttonLeft: 5,
        buttonTop: 20,
        Row2: {
            buttonLeft: 10
        }
    },
    buttonTypes: {
        default: {
            type: Key,
        },
        onDelete: {
            type: ImgKey, w: 90, img: 'images/delete.png'
        },
        onLayout: {
            type: ActionKey
        },
        onSpace: {
            type: ActionKey, w: 360, label: 'spatie',
        },
        onClear: {
            type: ActionKey, label: 'clear'
        }
    }
};

