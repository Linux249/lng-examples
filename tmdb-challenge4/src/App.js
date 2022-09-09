import { Lightning, Utils, Router } from '@lightningjs/sdk';
import provider from "./lib/data-provider";
import routes from "./lib/routes";
import widgets from "./lib/widgets";
import {init as initApi} from "./lib/Api"
import {Logo, Menu} from "./widgets";
import Background from "./Background"


export default class App extends Lightning.Component {

    static getFonts() {
        return [
            {family: 'SourceSansPro-Regular', url: Utils.asset('fonts/SourceSansPro-Regular.ttf'), descriptors: {}},
            {family: 'SourceSansPro-Black', url: Utils.asset('fonts/SourceSansPro-Black.ttf'), descriptors: {}},
            {family: 'SourceSansPro-Bold', url: Utils.asset('fonts/SourceSansPro-Bold.ttf'), descriptors: {}}
        ];
    }

    // when App instance is initialized we call the routes
    // this will setup all pages and attach them to there route
    _setup() {
        initApi(this.stage);

        Router.startRouter({
            appInstance: this, provider, routes, widgets
        });
    }

    static _template() {
        return {
            Background: {
                type: Background
            },
            Pages: {
                forceZIndexContext: true
            },
            Widgets: {
                Logo:{
                    type: Logo, x: 100, y: 100
                },
                Menu:{
                    type: Menu, x: 100, y: 100
                }
            },
            Loading: {
                rect: true, w: 1920, h: 1080, visible: false,
                color: 0xff000000
            }
        };
    }


     static _states() {
        return [
            class Loading extends this {
                $enter() {
                    this.tag("Loading").visible = true;
                }

                $exit() {
                    this.tag("Loading").visible = false;
                }
            },
            class Widgets extends this {
                $enter(args, widget) {
                    // store widget reference
                    this._widget = widget;

                    // since it's possible that this behaviour
                    // is non-remote driven we force a recalculation
                    // of the focuspath
                    this._refocus();
                }

                _getFocused() {
                    // we delegate focus to selected widget
                    // so it can consume remotecontrol presses
                    return this._widget;
                }
            }
        ];
    }

    // tell page router where to store the pages
    get pages() {
        return this.tag("Pages");
    }

    get widgets(){
        return this.tag("Widgets")
    }

    _getFocused() {
        return Router.getActivePage();
    }

}
