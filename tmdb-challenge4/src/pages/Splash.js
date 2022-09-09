import {Lightning, Utils, Router} from "@lightningjs/sdk";

export default class Splash extends Lightning.Component{
    static _template() {
        const timingFunction = 'cubic-bezier(0.20, 1.00, 0.80, 1.00)';
        return {
            Background: {
                w: 1920, h: 1080, colorBottom: 0xff000000, scale: 1.2,
                src: Utils.asset("images/background.png"),
                transitions: {
                    scale: {duration: 1, timingFunction},
                    x:{duration:3, delay:1.2, timingFunction:'ease-in'}
                }
            },
            Logo: {
                src: Utils.asset("images/logo-large.png"),
                mount: .5, x: 960, y: 640, alpha: 0.0001,
                transitions: {
                    alpha: {duration: 1, timingFunction},
                    y: {duration: 1, timingFunction}
                }
            },
            Spinner: {
                src: Utils.asset("images/spinner.png"),
                mountX: .5, x: 960, y: 920, alpha: 0.001, color: 0xaaffffff,
                transitions: {
                    alpha: {duration: 1, timingFunction}
                }
            }
        };
    }

    _init() {
        this.tag("Logo").on("txLoaded", ()=> {
            this.patch({
                Logo:{smooth:{alpha:1, y: 540}},
                Background:{smooth:{scale:1}}
            })
        });

        this.tag("Spinner").on("txLoaded", ()=> {
            this.tag("Spinner").setSmooth("alpha", 1);
        });

        this._spinnerAnimation = this.animation({duration: 1, repeat: -1, actions: [
            {t: 'Spinner', p: "rotation", sm: 0, v:{sm:0, 0:0, 1: Math.PI * 2} }
        ]});
    }

    _handleEnter(){
        Router.navigate("home/browse/movies")
    }

    _active() {
        this._spinnerAnimation.start()
    }

    _inactive() {
        this._spinnerAnimation.stop()
    }

}
