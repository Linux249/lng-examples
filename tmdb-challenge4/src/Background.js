import {Img, Lightning} from "@lightningjs/sdk";
import {getImgUrl} from "./lib/tools";

export default class Background extends Lightning.Component{
    static _template() {
        const settings = {duration: 2, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'};
        return {
            Background: {
                w: 1920, h: 1080,
                colorTop: 0xff717171, colorBottom: 0xff000000, scale: 1.2, alpha: 0,
                transitions: {
                    alpha: settings,
                    scale: settings
                }
            }
        };
    }

    _init() {
        let bg;
        this.application.on("updateItem", ({item})=> {
            if(item.background === bg){
                return;
            }
            bg = item.background;

            this.tag("Background").patch({
                alpha:0, scale:1.2
            });
            this.tag("Background").patch({
                texture: Img(getImgUrl(bg, 1280)).contain(1920, 1080),
                smooth: {scale: 1, alpha: 1}
            });
        });

        this.application.on("playbackStarted",()=>{
            this.patch({
                smooth:{alpha:0}
            });
        })

        this.application.on("playbackEnded",()=>{
            this.patch({
                smooth:{alpha:1}
            });
        })
    }
}
