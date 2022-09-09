import {Lightning, Router} from "@lightningjs/sdk";
import {Item} from "../";

export default class List extends Lightning.Component {
    static _template() {
        return {
            Items: {
                y: 102, forceZIndexContext: true, boundsMargin: [500, 100, 500, 100],
                transitions: {
                    x: {duration: .3, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'}
                }
            },
            Indicator: {
                alpha: 0, x: -32, y: 102, colorLeft: 0xff8ecea2, colorRight: 0xff03b3e4,
                texture: Lightning.Tools.getRoundRect(236, 344, 16, 6, 0xffffffff, true, 0x00ffffff)
            },
            Metadata: {
                x: -32, y: 60, mountY: 1,
                flex: {direction: "column"},
                Title: {
                    text: {fontSize: 64, fontFace: "SourceSansPro-Bold", wordWrapWidth: 960, maxLines: 1}
                },
                ReleaseDate: {
                    flexItem: {marginTop: -24},
                    colorLeft: 0xff8ecea2, colorRight: 0xff03b3e4,
                    text: {fontSize: 32, fontFace: "SourceSansPro-Regular", wordWrapWidth: 960, maxLines: 1}
                }
            }

        }
    }

    _init() {
        this._index = 0;
    }

    _handleLeft(){
        this.setIndex(Math.max(0, --this._index));
    }

    _handleRight(){
        this.setIndex(Math.min(++this._index, this.items.length - 1));
    }

    _handleEnter() {
        const {item:{type, id}} = this.activeItem;
        Router.navigate(`details/${type}/${id}`);
    }

    updateMetadata({item}){
        // first hide
        this.tag("Metadata").alpha = 0;
        this.tag("Metadata").y = 80;

        this.patch({
            Metadata: {
                Title: {
                    text: {text: item.title}
                },
                ReleaseDate: {
                    text: {text: item.releaseDate}
                },
                smooth:{
                    alpha:[1, {duration:0.4, delay:0.1}],
                    y:[50, {duration:0.4, delay:0.1}],
                }
            }
        });

        this.application.emit("updateItem", {item});
    }


    /**
     * @todo:
     * Implement working setIndex method
     * that stores index and position movie component to focus
     * on selected item
     */
    setIndex(idx){
        // store new index
        this._index = idx;

        // update position
        this.tag("Items").setSmooth("x",  idx * -220 );
    }

    set label(v) {
        // @todo: update list title
    }

    set movies(v) {
        // we add an array of object with type: Item
        this.tag("Items").children = v.map((movie, index)=>{
            return {
                type: Item,
                item: movie,
                x: index * (Item.width + Item.offset),
                signals:{
                    updateMetadata: true
                }
            };
        });
    }

    _focus(){
        this.patch({
            Indicator:{smooth:{alpha:1}},
            Metadata:{smooth:{alpha:1}}
        });
    }

    _unfocus(){
        this.patch({
            Indicator:{smooth:{alpha:0}},
            Metadata:{smooth:{alpha:0}}
        });
    }

    get items() {
        return this.tag("Items").children;
    }

    get activeItem() {
        return this.items[this._index];
    }

    _getFocused() {
        return this.activeItem;
    }
}
