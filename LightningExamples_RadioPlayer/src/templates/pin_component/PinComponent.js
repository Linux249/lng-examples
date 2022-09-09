import {Lightning} from '@lightningjs/sdk';
import Colors from '@/Colors';
import Button from '@/components/Button.js';
import InputDisplay from './InputDisplay.js';
import {Keyboard, List, Border} from '@/blocks';
import {keyboardConfig} from './PinKeyboard.js';

export default class PinComponent extends Lightning.Component {
    static _template() {
        return {
            w: 1920, h: 1080, rect: true, color: Colors.get('background'),
            Pin: {alpha: 1,
                Message: {mountX: 0.5, x: 960, y: 211, color: Colors.get('label'), text: {text: 'Security Check', fontFace: 'Bold', fontSize: 72}},
                Description: {mountX: 0.5, x: 960, y: 302, color: Colors.get('label'),text: {text: 'To modify your account, enter your pin', fontFace: 'Italic', fontSize: 36 }},
                InputDisplay: {type: InputDisplay, x: 410, y: 423, signals: {onPinComplete: true}},
                Keyboard: {x: 375, y: 671, type: Keyboard, config: keyboardConfig, layout: 'pin'},
                Cancel: {
                    mountX: 0.5, x: 960, y: 795, padding: 30, type: Button, w: 170, h: 64, label: 'Cancel'
                }
            },
            Dialog: {
                mount: 0.5, x: 960, y: 540, w: 1030, h: 472, type: Dialog
            }
        }
    }

    onPinComplete() {
        //lock component to start doing checks. This prevents any unwanted actions on component.
        this._setState('Lock');
    }

    _setup() {
        this.tag('Keyboard').inputField = this.tag('InputDisplay');
        this._setState('Keyboard');
    }

    static _states() {
        return [
            class Lock extends this {
                $enter() {
                    console.log('doing security checks');
                    //faking incorrect pin after 2 seconds
                    setTimeout(() => {
                        this._setState('WrongPin');
                    }, 500)
                }
            },
            class WrongPin extends this {
                _getFocused() {
                    return this.tag("Dialog");
                }

                $enter() {
                    this.tag('Pin').setSmooth('alpha', 0, {delay: 0.0});
                    this.tag('Dialog').open({
                        message: 'Wrong Pin',
                        description: 'Entered the wrong pin. Try again?',
                        actions: [
                            {label: 'Try again', action: () => {this._setState('Keyboard')}},
                            {label: 'Cancel', action: () => {console.log('end cycle')}}
                        ]
                    })
                }

                $exit() {
                    this.tag('Keyboard').reset();
                    this.tag('InputDisplay').reset();
                    this.tag('Dialog').close();
                    this.tag('Pin').setSmooth('alpha', 1, {delay: 0.2});
                }
            },
            class Keyboard extends this {
                _getFocused() {
                    return this.tag('Keyboard');
                }

                _handleDown() {
                    this._setState('Cancel');
                }
            },
            class Cancel extends this {
                _getFocused() {
                    return this.tag('Cancel');
                }

                _handleUp() {
                    this._setState('Keyboard');
                }

                _handleEnter() {
                    console.log('end cycle');
                }
            }
        ]
    }
}

class Dialog extends Lightning.Component {
    static _template() {
        return {
            alpha: 0,
            Border: {type: Border, stroke: 5, strokeColor: Colors.get('label')},
            Message: {mountX: 0.5, x: w => w / 2, y: 97, color: Colors.get('label'), text: {text: '', fontFace: 'Bold', fontSize: 72}},
            Description: {mountX: 0.5, x: w => w / 2, y: 193, color: Colors.get('label'), text: {text: '', fontFace: 'Italic', fontSize: 36 }},
            Buttons: {
                mountX: 0.5, x: w => w / 2, y: 319, spacing: 115, type: List, orientation: 'horizontal'
            }
        }
    }

    open({message, description, actions = []}) {
        if(!actions.length) {
            //if there are no buttons add a cancel button
            actions.push({label: 'Cancel', action: () => {console.log('end cycle')}});
        }

        //patch dialog with parameters
        this.patch({
            smooth: {alpha: [1, {delay: 0.2}]},
            Message: {text: {text: message}},
            Description: {text: {text: description}},
            Buttons: {items: actions.map((item) => {
                    return {type: Button, padding: 30, w: 170, h: 64, label: item.label, action: item.action}
                })}
        });
    }

    close() {
        this.setSmooth('alpha', 0, {delay: 0.0});
    }

    _getFocused() {
        return this.tag('Buttons');
    }

    _handleEnter() {
        const {action} = this.tag('Buttons').currentItem;
        if(action && action.call && action.apply) {
            //if there is a callable function, fire it.
            action.call();
        }
    }
}