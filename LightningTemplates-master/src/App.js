import {Utils, Router} from '@lightningjs/sdk';
import Colors from './Colors';
import routerconfig from './lib/routerconfig.js';

export default class App extends Router.App {
    static getFonts() {
        return [
            {family: 'Regular', url: Utils.asset('fonts/Poppins-Regular.ttf')},
            {family: 'Italic', url: Utils.asset('fonts/Poppins-Italic.ttf')},
            {family: 'Medium', url: Utils.asset('fonts/Poppins-Medium.ttf')},
            {family: 'Bold', url: Utils.asset('fonts/Poppins-Bold.ttf')},
        ];
    }

    _setup() {
        Router.startRouter(routerconfig, this);
        Colors.add({
            background: 0xff202020,
            darkGrey: 0xff66666F,
            dark: 0xff303030,
            focus: 0xffffffff   ,
            unfocus: 0xff444448,
            label: 0xffE1E1F1,
            labelFocus: 0xff383838
        });
    }

    _getCurrentRouteIndex() {
        const currentRoute = Router.getActiveRoute();
        const routes = routerconfig.routes;
        for(let i = 0; i < routes.length; i++) {
            if(currentRoute === routes[i].path) {
                return i;
            }
        }
        return 0;
    }

    _navigate(dir) {
        const targetIndex = Math.min(Math.max(this._getCurrentRouteIndex() + dir, 0), routerconfig.routes.length) ;
        Router.navigate(routerconfig.routes[targetIndex].path);
    }

    _handleNextRoute() {
        this._navigate(1);
    }

    _handlePreviousRoute() {
        this._navigate(-1);
    }
}
