import {Router} from "@lightningjs/sdk";

/**
 * @see docs: https://github.com/rdkcentral/Lightning-SDK/blob/feature/router/docs/plugins/router.md
 */

import {
     Main, Splash, Details, Player, NotFound
} from '../pages';

export default () =>{

    // define where the browser should point to on boot
    Router.root('splash', Splash);
    Router.route('home/browse/movies', Main);
    Router.route('home/browse/series', Main);
    Router.route('details/:itemType/:itemId', Details);
    Router.route('details/:itemType/:itemId/play', Player);

    Router.route('*', NotFound);

    Router.start();
}
