import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { actions } from './actions';
import {act} from "react-dom/test-utils";
import {defaultNotebookPage, NotebookPage} from "../../../model/notebookPage";
import JsonReader from "../../../utils/jsonReader";

export interface NotebookPageEditState {
    page: NotebookPage
    image?: string
    radarImage?: string
    isNew: boolean
}

const initialState: NotebookPageEditState = JsonReader.read<NotebookPageEditState>("page") || {
    page: defaultNotebookPage,
    image: '',
    radarImage: '',
    isNew: false
};

export const notebookPageEditReducer = reducerWithInitialState(initialState)
    .case(actions.updateState, (state, value) => {
        const map:any = {};
        map[value.key] = value.value;
        return {...state, page: {...state.page, ...map}}
    })
    .case(actions.setImage, (state, image) => {
        return {...state, image: image, page: {...state.page, image: ''}};
    })
    .case(actions.changeRate, (state, rate) => {
        const items = state.page.items;
        if (items.length <= rate.index) {
            console.error("index is over than length.");
            return {...state, page: {...state.page }}
        }

        items[rate.index].value = rate.num;
        const average = items.length === 0 ? 0 : items.map(e => e.value).reduce((a, b)=> a + b) / items.length;

        return {...state, page: {...state.page , items: items.concat([]), average: average}}
    })
    .case(actions.changeItemValue, (state, value) => {
        const items = state.page.items;
        if (items.length <= value.index) {
            console.error("index is over than length.");
            return {...state, page: {...state.page }}
        }

        items[value.index].name = value.value;

        return {...state, page: {...state.page , items: items.concat([])}}
    })
    .case(actions.setRadarImage, (state, value) => {
        return {...state, radarImage: value}
    })
    .case(actions.toggleSwitch, (state, key) => {
        if(key === 'comment') {
            const value = state.page.comment;
            return {...state, page: {...state.page, comment: !value}}
        }
        const value = state.page.evaluate;
        return {...state, page: {...state.page, evaluate: !value}}
    })
