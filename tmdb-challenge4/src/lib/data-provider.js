import {Router} from "@lightningjs/sdk";
import {getPopular, getDetails} from './api';

/**
 *  bind a data request to a specific route, before a page load
 *  the router will test for any data-binding. If there is, it will
 *  wait for the promise to resolve and load the correct page.
 *
 * @see docs: https://github.com/rdkcentral/Lightning-SDK/blob/feature/router/docs/plugins/router.md
 *
*/
export default () => {

    Router.boot(async()=> {
        // this will always be called
    });

    /**
     * @todo: inside this data-provider for the movies route
     * you must await for the getMovies() and invoke the data on the page
     */

    Router.before("home/browse/movies", async ({page})=>{
        page.data = await getPopular('movie');
    }, 10 * 60 /* expires */);

    Router.before("home/browse/series", async ({page})=>{
        page.data = await getPopular('tv');
    }, 10 * 60 /* expires */);

    Router.before("details/:itemType/:itemId", async ({page, itemType, itemId})=>{
        page.details = await getDetails(itemType, itemId);
    });

    Router.before("details/:itemType/:itemId/play", async ({page, itemType, itemId})=>{
        page.item = await getDetails(itemType, itemId);
    });
}
