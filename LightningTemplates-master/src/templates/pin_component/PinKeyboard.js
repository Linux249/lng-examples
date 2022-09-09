import Button from '../../components/Button.js';
import {Utils} from '@lightningjs/sdk';
import Colors from '@/Colors';

class Key extends Button {
    _init() {
        this._autoResize = false;
        this.tag('Label').y = 31;
    }

    _focus() {
        super._focus();
        this.setSmooth('h', 64);
    }

    _unfocus() {
        super._unfocus();
        this.setSmooth('h', 62);
    }

    static get width() {
        return 90;
    }

    static get height() {
        return 62;
    }
}

class DeleteKey extends Key {
    _init() {
        super._init();
        this.patch({
            w: 100,
            Background: {color: Colors.get('dark'), shader: {radius: 32}},
            Icon: {mount: 0.5, x: w => w / 2, color: Colors.get('label'), y: 31, src: Utils.asset('images/delete.png')}
        });
    }

    _focus() {
        super._focus();
        this.tag('Icon').setSmooth('color', Colors.get('labelFocus'))
    }

    _unfocus() {
        this.patch({
            Background: {color: Colors.get('dark'), shader: {radius: 32}},
            Icon: {color: Colors.get('label')}
        })
    }

    _update() {
        //overwrite so nothing happens
    }
}

export const keyboardConfig = {
    layouts: {
        'pin': [
            ['1','2','3', '4','5','6','7','8','9', '0', 'onDelete']
        ]
    },
    offsets: {
        buttonLeft: 20
    },
    buttonTypes: {
        'default': {type: Key},
        'onDelete': {type: DeleteKey}
    }
}