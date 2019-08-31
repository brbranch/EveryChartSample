import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {actions} from './actions'
import {CommonEvent} from "../../../consts";
import {UrlFetch} from "../../../client/fetch";
import {AvaterState} from "../../index/avater/state";
import {Notebook} from "../../../model/notebook";
import JsonReader from "../../../utils/jsonReader";

export interface NotebookState extends Notebook {
    changedAt: number;
    disable: boolean;
}

const initialState: NotebookState = {
    id: '',
    title: '',
    account: undefined,
    category: 'none',
    description: '',
    image: '',
    imageUrl: '',
    adult: false,
    items: ['','',''],
    editable: 'loggedin',
    private: false,
    pages: 0,
    changedAt: 0,
    createdAt: 0,
    disable: false
};

const data = JsonReader.read<NotebookState>("notebook") || initialState;
data.changedAt = 0;
data.disable = false;

export const notebookReducer = reducerWithInitialState(data)
    .case(actions.updateTitle, (state, title) => {
        return Object.assign({}, state, { title });
    })
    .case(actions.setImage, (state, image) => {
        return {...state, image: image, imageUrl: ''};
    })
    .case(actions.updateState, (state, value) => {
        const map:any = {};
        map[value.key] = value.value;
        return {...state, ...map};
    })
    .case(actions.updateBoolean, (state, value) => {
        const map:any = {};
        map[value.key] = value.value;
        return {...state, ...map};
    })
    .case(actions.updateItems, (state, values) => {
        if(values.length != state.items.length) {
            return {...state, items: values, changedAt: new Date().getTime()};
        }
        return {...state, items: values};
    })
    .case(actions.addItem, (state) => {
        const items = state.items;
        items.push("");
        return {...state, items: items, changedAt: new Date().getTime()}
    })
    .case(CommonEvent.AJAX_START, (state) => {
        return {...state, disable: true}
    })
    .case(CommonEvent.AJAX_COMPLETE, (state) => {
        return {...state, disable: false}
    })
    .case(actions.save, (state) => {
        const data = {...state};
        delete data.disable;
        delete data.changedAt;
        UrlFetch.instance.post("/posts/new", data, (json: any, error: any) => {
        })
        return {...state}
    })
