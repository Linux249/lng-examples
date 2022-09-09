import {Router} from "@lightningjs/sdk";

export default () =>{
    Router.widget("splash")
    Router.widget("home/browse/movies", ["Menu", "Logo"])
    Router.widget("home/browse/series", ["Menu", "Logo"])
}
