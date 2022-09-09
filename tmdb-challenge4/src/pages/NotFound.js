import {Lightning} from "@lightningjs/sdk";

export default class NotFound extends Lightning.Component{
    static _template(){
        return {
            rect: true, w: 1920, h: 1080,
            color: 0xff615f5d,
            Label:{
                x: 960, y: 540, mount:0.5,
                text:{
                    text:'Not Found'
                }
            }
        }
    }
}
