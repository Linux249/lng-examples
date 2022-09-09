import {Lightning, Utils} from '@lightningjs/sdk';

export default class Loader extends Lightning.Component {
    static _template() {
        return {
            w: 80, h: 80, src: Utils.asset('spinner.png')
        }
    }

    _init() {
        this._loadAnimation = this.animation({duration: 1.2, repeat: -1, actions: [
                {p: 'rotation', v: {sm: 0, 0: 0, 1: Math.PI * 2}}
            ]});
    }

    _active() {
        this._loadAnimation.start();
    }

    _inactive() {
        this._loadAnimation.stop();
    }
}