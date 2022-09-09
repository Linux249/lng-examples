import {Lightning, Utils} from '@lightningjs/sdk';
import {Loader} from '@/blocks';
import Colors from '@/Colors';

export default class Splash extends Lightning.Component {
    static _template() {
        return {
            w: 1920, h: 1080, rect: true, color: Colors.get('background'),
            Wrapper: {x: 440, y: 320,
                WarningIcon: {y: 20, src: Utils.asset('warning_icon_2.png')},
                Bar: {x: 330, h: 340, w: 6, rect: true},
                Labels: {x: 380,
                    // Warning: {text: {text: 'WARNING', fontFace: 'Bold', fontSize: 62}},
                    Splash: {y: 10, text: {text: 'SPLASH', fontFace: 'Bold', fontSize: 142}},
                    Information: {y: 200, text: {text: 'Components for Lightning;\nFeel free to use or copy any of the used \ncomponents at own risk.', fontFace: 'Italic', fontSize: 28}}
                }
            },
            Loader: {
                x: 960, y: 800, mount: 0.5, type: Loader
            }
        }
    }

    easing() {
        return 'fade';
    }
}