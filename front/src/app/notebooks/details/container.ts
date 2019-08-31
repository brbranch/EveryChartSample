import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { actions } from './actions'
import {Component} from './component';
import {Notebook, NotebookModel} from "../../../model/notebook";
import {NotebookPage} from "../../../model/notebookPage";
import {FetchError} from "../../../client/fetch";
import {NotebookPagesModel} from "../../../model/notebookPages";

export interface Actions {
    update: () => Action<void>;
    getPages: (book: Notebook, callback: ()=>void) => Action<void>;
    nextPages: (pages: NotebookPagesModel) => Action<NotebookPagesModel>;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        update : () => {
        },
        getPages: (book: Notebook, callback: ()=>void ) => {
            const model = new NotebookPagesModel(book);
            model.get((error: FetchError) => {
                dispatch(actions.setPages(model));
                callback();
            });
        },
        nextPages: (pages: NotebookPagesModel) => {
            if(pages.hasNext()) {
                pages.get((error : FetchError) => {
                    dispatch(actions.setPages(pages.clone()));
                })
            }
        }
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.notebookDetail);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
