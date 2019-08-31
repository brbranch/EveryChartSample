import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { commentEditActions } from './actions';
import {act} from "react-dom/test-utils";
import {createNotebookComment, NotebookComment, NotebookCommentModel} from "../../../model/notebookComment";
import JsonReader from "../../../utils/jsonReader";

export interface NotebookCommentEditState {
    myComment: NotebookComment
    visible: boolean
    edit: boolean
}


const initialState: NotebookCommentEditState = {
    myComment: undefined,
    visible: false,
    edit: false,
};

export const notebookCommentEditReducer = reducerWithInitialState(initialState)
    .case(commentEditActions.setVisible, (state, visible) => {
      return {...state, visible}
    })
    .case(commentEditActions.update, (state, comment) => {
        return {...state, myComment: comment, visible: false, edit: false}
    })
    .case(commentEditActions.showComment, (state, newState) => {
        return {...state, myComment: newState, visible: true};
    })
    .case(commentEditActions.changeRate, (state, value) => {
        const items = state.myComment.values;
        if (items.length <= value.index) {
            console.error("index is over than length.");
            return {...state, myComment: {...state.myComment }}
        }

        items[value.index] = value.num;
        return {...state, edit: true, myComment: {...state.myComment , values: items.concat([])}}
    })
    .case(commentEditActions.changeComment, (state, value) => {
        state.myComment.comment = value;
        const model = new NotebookCommentModel(state.myComment, null);
        return {...state,edit:true, myComment: {...model.data(), comment: value}}
    })
