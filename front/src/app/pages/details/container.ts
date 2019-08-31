import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { pageDetailActions } from './actions'
import {Component} from './component';
import {NotebookComment, NotebookCommentModel} from "../../../model/notebookComment";
import {commentEditActions} from "../commentEdit/actions";
import {NotebookPage, NotebookPageModel} from "../../../model/notebookPage";
import {FetchError} from "../../../client/fetch";

export interface Actions {
    showComment: (page: NotebookPage) => Action<void>;
    showEvaluate: (page: NotebookPage) => Action<void>;
    like: (model: NotebookPageModel) => Action<string>;
    loadNext: (cursor: string, model: NotebookPageModel) => Action<NotebookComment[]>;
    setDeleteComment: (comment: NotebookComment) => Action<NotebookComment>;
    executeDelete: (comment: NotebookCommentModel, callback: (error: FetchError) => void) => Action<void>;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        showComment: (page: NotebookPage) => {
            const model = new NotebookPageModel(page);
            model.editComment((comment, error) => {
                if (comment) {
                    console.log(comment);
                    dispatch(commentEditActions.showComment(comment));
                }
            })
        },
        showEvaluate: (page: NotebookPage) => {
            const model = new NotebookPageModel(page);
            model.editEvaluate((comment, error) => {
                if (comment) {
                    console.log(comment);
                    dispatch(commentEditActions.showComment(comment));
                }
            })

        },
        like: (model: NotebookPageModel) => {
            model.toggleLike( (num, err) => {
                if (!err) {
                    dispatch(pageDetailActions.toggleLike(num));
                }
            })
        },
        loadNext: (cursor: string, model: NotebookPageModel) => {
            model.getComments(cursor, (resp, err) => {
                if (err) {
                    dispatch(pageDetailActions.addComments({next: "", comments: []}));
                    return;
                }
                dispatch(pageDetailActions.addComments(resp));
            });
        },
        setDeleteComment: (comment: NotebookComment) => {
            dispatch(pageDetailActions.deleteComment(comment));
        },
        executeDelete : (comment: NotebookCommentModel, callback: (error: FetchError) => void) => {
            comment.delete((error: FetchError) => {
                if(!error) {
                    dispatch(pageDetailActions.executeDeleteComment());
                }
                callback(error);
            })
        }
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.notebookPageDetail);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
