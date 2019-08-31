import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { actions } from './actions';
import {act} from "react-dom/test-utils";
import {defaultNotebook, Notebook} from "../../../model/notebook";
import JsonReader from "../../../utils/jsonReader";
import {NotebookPage, NotebookPageModel} from "../../../model/notebookPage";
import {NotebookPagesModel} from "../../../model/notebookPages";

export interface NotebookDetailState {
    notebook: Notebook;
    pages: NotebookPagesModel;
}

const book:Notebook = JsonReader.read<Notebook>("notebook") || {...defaultNotebook};
const initialState: NotebookDetailState = {
    notebook : book,
    pages: null
};


export const notebookDetailReducer = reducerWithInitialState(initialState)
    .case(actions.update, (state) => {
        return state;
    })
    .case(actions.setPages, (state, pages) => {
        return {...state, pages: pages};
    })
