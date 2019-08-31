import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { routerActions } from './routerActions';
import {act} from "react-dom/test-utils";

export interface RootState {
    progress: boolean
    toastTexts: string[]
    currentToast: string
    toastOpen: boolean
    backPath: string,
    disableMenu: boolean
}

const disable = document.getElementById("data-register") !== null;

const initialState: RootState = {
    progress: false,
    toastTexts: [],
    currentToast: "",
    toastOpen: false,
    backPath: "",
    disableMenu: disable
};

export const rootReducer = reducerWithInitialState(initialState)
    .case(routerActions.showProgress, (state) => {
        return {...state, progress: true};
    })
    .case(routerActions.hideProgress, (state) => {
        return {...state, progress: false};
    })
    .case(routerActions.showToast, (state, text) => {
        const texts = state.toastTexts;
        if (state.currentToast.length > 0) {
            texts.push(text);
            return {...state, toastTexts: texts}
        }
        return {...state, currentToast: text, toastOpen: true}
    })
    .case(routerActions.hideToast, (state) => {
        return {...state, toastOpen:false}
    })
    .case(routerActions.nextToast, (state) => {
        const texts = state.toastTexts;
        if(texts.length === 0) {
            return {...state, currentToast: "", toastOpen:false}
        }
        const current = texts.shift();
        return {...state, currentToast: current, toastTexts: texts, toastOpen: true}
    })
    .case(routerActions.setBack, (state, back) => {
        return {...state, backPath: back}
    })
    .case(routerActions.setDisableMenu, (state, menu) => {
        return {...state, disableMenu: menu}
    })

