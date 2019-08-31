import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { loginActions } from './actions'
import {Component} from './component';
import {FetchError, UrlFetch} from "../../../client/fetch";
import {NotebookPage} from "../../../model/notebookPage";
import {RecentNotebooks, RecentNotebooksModel} from "../../notebooks/recents/state";

export interface Actions {
    loadNextPage : (cursor: string) => Action<void>;
    loadNote : (books: RecentNotebooks) => Action<RecentNotebooks>;
}

interface PageResponse {
    items: NotebookPage[],
    next: string
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        loadNextPage: (cursor: string) => {
            let path = "/index/pages.json"
            if (cursor.length > 0) {
                path += "?cursor=" + cursor
            }
            UrlFetch.instance.get(path, (json: any, error: FetchError) => {
                if (error) {
                    return;
                }
                const resp = json as PageResponse;
                dispatch(loginActions.setCursor(resp.next))
                dispatch(loginActions.addRecentPages(resp.items))
            })
        },
        loadNote: (books: RecentNotebooks) => {
            const model = new RecentNotebooksModel(books);
            dispatch(loginActions.setBookLoading(true));
            model.get((error: FetchError) => {
                dispatch(loginActions.setRecentNotebooks(model.data()));
                dispatch(loginActions.setBookLoading(false));
            });
        }
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.login);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
