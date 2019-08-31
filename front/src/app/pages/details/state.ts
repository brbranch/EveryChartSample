import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { pageDetailActions } from './actions';
import {act} from "react-dom/test-utils";
import {defaultNotebookPage, NotebookPage, NotebookPageModel} from "../../../model/notebookPage";
import JsonReader from "../../../utils/jsonReader";
import {createNotebookComment, NotebookComment, NotebookCommentModel} from "../../../model/notebookComment";
import {Notebook} from "../../../model/notebook";

export interface NotebookPageDetailState {
    page: NotebookPage
    hasMoreItems: boolean
    comments: NotebookComment[]
    nextCursor: string
    deleteConfirm: NotebookComment
}

const page:NotebookPage = JsonReader.read<NotebookPage>("page") || {...defaultNotebookPage};

const initialState: NotebookPageDetailState = {
    page: page,
    comments: [],
    hasMoreItems: true,
    nextCursor: "",
    deleteConfirm: null,
};

export const notebookPageDetailReducer = reducerWithInitialState(initialState)
    .case(pageDetailActions.toggleLike, (state, num) => {
        const isLike = state.page.isLike;
        return {...state, page: {...state.page, isLike: !isLike, likes: num}};
    })
    .case(pageDetailActions.showComment, (state) => {
        return {...state, comment: true}
    })
    .case(pageDetailActions.cancelComment, (state) => {
        return {...state, comment: false}
    })
    .case(pageDetailActions.addComment, (state, comment) => {
        const page: NotebookPage = {...state.page}
        const model = new NotebookPageModel(page);
        const commentModel = new NotebookCommentModel(comment, state.page);
        if(commentModel.hasComment()) {
            // コメントが存在している
            const comments : NotebookComment[] = [];
            let contains = false;
            state.comments.forEach((elem) => {
                if(elem.commentId === comment.commentId) {
                    contains = true;
                    comments.push(comment);
                    model.removeSummary(elem);
                } else {
                    comments.push(elem);
                }
            })
            model.appendComment(comment);
            if(contains === false) {
                return {...state, page: {...model.data()}, comments: [comment].concat(comments)}
            }
            return {...state, page: {...model.data()}, comments: comments};
        } else {
            state.comments.forEach((elem) => {
                if(elem.commentId === comment.commentId) {
                    model.removeSummary(elem);
                }
            })
            model.appendComment(comment);
        }
        return {...state, page: {...model.data()}}
    })
    .case(pageDetailActions.commentLike, (state, like) => {
        return {...state, page: {...page}}
    })
    .case(pageDetailActions.addComments, (state, comments) => {
        const comment = state.comments.concat(comments.comments);
        console.log(comment);
        return {...state, comments: comment, hasMoreItems: comments.next.length > 0, nextCursor: comments.next}
    })
    .case(pageDetailActions.deleteComment, (state, comment) => {
        return {...state, deleteConfirm: comment}
    })
    .case(pageDetailActions.executeDeleteComment, (state) => {
        const del = state.deleteConfirm;
        const com: NotebookComment[] = [];
        if (del) {
            state.comments.forEach(elem => {
                if(elem.commentId !== del.commentId) {
                    com.push(elem);
                }
            })
            return {...state, comments: com, deleteConfirm: null}
        }
        return {...state, deleteConfirm: null}
    })



