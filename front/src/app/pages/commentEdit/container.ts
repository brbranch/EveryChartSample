import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { commentEditActions } from './actions'
import {Component} from './component';
import {IndexNum, IndexValue} from "../edit/actions";
import {NotebookComment, NotebookCommentModel} from "../../../model/notebookComment";
import {pageDetailActions} from "../details/actions";
import {FetchError} from "../../../client/fetch";

export interface Actions {
    update: (comment: NotebookCommentModel) => Action<void>;
    setVisible: (visible: boolean) => Action<boolean>;
    changeComment: (value: string) => Action<string>;
    changeRate: (index: number, value: number) => Action<IndexNum>;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        update : (comment: NotebookCommentModel) => {
            comment.update((res: NotebookComment, error: FetchError) => {
                if (error === null) {
                    dispatch(commentEditActions.update(res));
                    dispatch(pageDetailActions.addComment(res));
                }
            });
        },
        setVisible: (visible: boolean) => {
            dispatch(commentEditActions.setVisible(visible));
        },
        changeComment: (value: string) => {
            dispatch(commentEditActions.changeComment(value));
        },
        changeRate: (index: number, value: number) => {
            dispatch(commentEditActions.changeRate({index: index, num: value}));
        }
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.notebookComment);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
