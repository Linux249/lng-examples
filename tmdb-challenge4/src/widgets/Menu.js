import {Lightning, Router} from '@lightningjs/sdk';

export default class Menu extends Lightning.Component {

    static _template() {
        return {
            Items: {
                y: 68,
                flex: {},
                Movies: {
                    type: MenuItem,
                    label: "Movies", url: "home/browse/movies"
                },
                Series: {
                    type: MenuItem,
                    label: "Series", url: "home/browse/series"
                },
                Exit: {
                    type: MenuItem,
                    label: "Exit", url: "exit"
                }
            },
            Focus: {
                rect: true, colorLeft: 0xff8ecea2, colorRight: 0xff03b3e4,
                h: 6, y: 128,
                transitions: {
                    alpha: {duration: .3, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'},
                    w: {duration: .3, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'}
                }
            }
        };
    }

    _init() {
        this._index = 0;
    }

    _focus() {
        this.tag("Focus").w = 0;
        this.tag("Focus").setSmooth("alpha", 1);

        this.setIndex();
    }

    _unfocus() {
        this.tag("Focus").setSmooth("alpha", 0);
    }

    setIndex(index = this._index) {
        this._index = index;
        this.tag("Focus").patch({
            smooth: {x: this.activeItem.finalX, w: this.activeItem.finalW}
        });
    }

    _handleEnter(){
        this.onItemClick();
    }

    onItemClick(){
        const item = this.activeItem;
        if(item.url === "exit"){
            this.application.closeApp();
        }else if(item.url){
            Router.navigate(item.url);
        }
    }

    _handleTouchStart(){
        this.onItemClick();
    }

    _handleTouchMove(){

    }

    _handleLeft() {
        if (this._index > 0) {
            this.setIndex(this._index - 1);
        }
    }

    _handleRight() {
        if (this._index < this.tag("Items").children.length - 1) {
            this.setIndex(this._index + 1);
        }
    }

    _handleDown() {
        // delegate focus back to the page we got focus from
        Router.restoreFocus();
    }

    get activeItem() {
        return this.tag("Items").children[this._index];
    }

    _getFocused(){
        return this.activeItem;
    }

}

class MenuItem extends Lightning.Component {

    static _template() {
        return {
            flexItem: {marginRight: 40},
            text: {text: "", fontSize: 48, fontFace: "SourceSansPro-Regular"}
        };
    }

    set label(v) {
        this._label = v;
        this.patch({
            text: {text: this._label}
        });
    }

    set url(v) {
        this._url = v;
    }

    get url() {
        return this._url;
    }

}
