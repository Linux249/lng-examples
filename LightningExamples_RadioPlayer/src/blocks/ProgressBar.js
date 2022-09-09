import {Lightning} from '@lightningjs/sdk';

export default class ProgressBar extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            Progress: {rect: true, h: h => h}
        }
    }

    _construct() {
        this._value = 0;
        this._tColor = 0x58ffffff;
        this._pColor = 0xffffffff;
    }

    set thresholdColor(argb) {
        this._tColor = argb;
        if(this.active) {
            this.color = argb;
        }
    }

    set progressColor(argb) {
        this._pColor = argb;
        if(this.active) {
            this.tag('Progress').color = argb;
        }
    }

    setProgress(p, immediate) {
        const pBar = this.tag('Progress');
        if(!immediate) {
            if(pBar.transition('w').isRunning()) {
                pBar.transition('w').reset(this.w * p, 0.2);
            }
            else{
                pBar.setSmooth('w', this.w * p);
            }
        }
        else {
            pBar.w = this.w * p;
        }
        this._value = p;
    }

    _update() {
        this.patch({
            color: this._tColor,
            Progress: {color: this._pColor, w: (this.w * this._value)}
        });
    }

    _firstActive() {
        this._update();
    }
}