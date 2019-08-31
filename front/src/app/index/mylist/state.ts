import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { actions } from './actions';
import {act} from "react-dom/test-utils";
import {ProcessStatus} from "../../common/processStatus";
import {Notebook, NotebookModel} from "../../../model/notebook";
import {Notebooks, NotebooksModel} from "../../../model/notebooks";

export interface MylistState {
    status: ProcessStatus,
    books: NotebooksModel
}

const initialState: MylistState = {
    status: ProcessStatus.NONE,
    books: null,
};

export const mylistReducer = reducerWithInitialState(initialState)
    .case(actions.updateSatus, (state, status) => {
        return {...state, status: status}
    })
    .case(actions.setNotebooks, (state, books) => {
        return {...state, books: books}
    })
    .case(actions.update, (state) => {
        return state;
    })
