import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { loginActions } from './actions';
import {act} from "react-dom/test-utils";
import JsonReader from "../../../utils/jsonReader";
import {NotebookPage} from "../../../model/notebookPage";
import {Notebook} from "../../../model/notebook";
import {initialRecentNotebooks, RecentNotebooks} from "../../notebooks/recents/state";

export interface ErrorResult {
    error : string
}

export interface LoginState {
    error : string
    pages: NotebookPage[]
    books: RecentNotebooks
    cursor: string
    hasNext: boolean
    loadBooks: boolean
}

const res: ErrorResult =  JsonReader.read<LoginState>("login") || { error : "" }

const initialState: LoginState = {
    error: res.error,
    pages: [],
    books: initialRecentNotebooks(),
    cursor: "",
    hasNext: true,
    loadBooks: false
};

export const loginReducer = reducerWithInitialState(initialState)
    .case(loginActions.addRecentPages, (state, pages) => {
        return {...state, pages: state.pages.concat(pages)}
    })
    .case(loginActions.setCursor, (state, cursor) => {
        return {...state, cursor: cursor, hasNext: cursor.length > 0}
    })
    .case(loginActions.setRecentNotebooks, (state, books) => {
        return {...state, books}
    })
    .case(loginActions.setBookLoading, (state, load) => {
        return {...state, loadBooks: load}
    })
