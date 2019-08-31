import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { actions } from './actions'
import {Component} from './component';
import {FetchError, UrlFetch} from "../../../client/fetch";
import {ProcessStatus} from "../../common/processStatus";
import {Notebook, NotebookModel} from "../../../model/notebook";
import {NotebooksModel} from "../../../model/notebooks";

export interface Actions {
    receiveData: (accountId: string) => Action<void>;
    nextData: (books: NotebooksModel) => Action<void>;
    update: () => Action<void>;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        receiveData: (accountId: string) => {
            dispatch(actions.updateSatus(ProcessStatus.PROCESSING));
            const model = new NotebooksModel(accountId);
            model.get((error: FetchError) => {
                dispatch(actions.updateSatus(ProcessStatus.DONE));
                if (error) {
                    return;
                }
                dispatch(actions.setNotebooks(model));
            })
        },
        nextData: (books: NotebooksModel) => {
            if(books.hasNext()) {
                books.get((error: FetchError) => {
                    if (error) {
                        return;
                    }
                    dispatch(actions.setNotebooks(books.clone()));
                })
            }
        },
        update : () => {
        }
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.mynotebook);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
