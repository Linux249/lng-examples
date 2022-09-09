import {Lightning, Img} from '@lightningjs/sdk';
import {Border} from '@/blocks';
import Colors from '@/Colors';

export default class ImageCell extends Lightning.Component {
    static _template() {
        return {
            Image: {alpha: 0.0001, w: w => w, h: h => h},
            Border: {alpha: 0, w: w => w, h: h => h, stroke: 5, strokeColor: Colors.get('focus'), mountStroke: 0, type: Border}
        }
    }

    _init() {
        const image = this.tag('Image');
        image.on('txLoaded', () => {
            image.setSmooth('alpha', 1);
        });

        this._focusAnimation = this.animation({duration: 0.2, actions: [
                {p: 'scale', v: {0: 1, 1: 1.04}},
                {t: "Border", p: 'alpha', v: {0: 0, 1: 1}},
                {t: "Border", p: 'mountStroke', v: {0: 0, 1: 1}}
            ]});
    }

    _update() {
        const {w, h, index} = this;
        this.patch({
            Image: {alpha: 0.0001, texture: Img(`https://picsum.photos/id/${index}/${h}/${w}?`).contain(w, h)}
        });
    }

    _firstActive() {
        this._update();
    }

    _focus() {
        this._focusAnimation.start();
    }

    _unfocus() {
        this._focusAnimation.stop();
    }

    static get width() {
        return 400;
    }

    static get height() {
        return 300;
    }
}