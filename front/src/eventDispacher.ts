import {store} from './index'
import {routerActions} from "./app/routerActions";
import {CommonEvent} from "./consts";

export default class EventDispacher {
    private static _instance:EventDispacher;
    private constructor() {

    }

    showProgress() {
        store.dispatch(routerActions.showProgress());
        store.dispatch(CommonEvent.AJAX_START());
    }

    hideProgress() {
        store.dispatch(routerActions.hideProgress());
        store.dispatch(CommonEvent.AJAX_COMPLETE());
    }

    showToast(text: string) {
        store.dispatch(routerActions.showToast(text));
    }

    setBackPath(path: string) {
        store.dispatch(routerActions.setBack(path));
    }

    setDisableMenu(disable: boolean)  {
        store.dispatch(routerActions.setDisableMenu(disable));
    }

    public static get instance(): EventDispacher {
        if(!this._instance) {
            this._instance = new EventDispacher();
        }
        return this._instance;
    }
}



