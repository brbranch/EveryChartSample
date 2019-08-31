import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { actions, KeyValue, KeyBool } from './actions'
import {Component} from './component';
import {act} from "react-dom/test-utils";
import {NotebookState} from "./state";
import {FetchError, UrlFetch} from "../../../client/fetch";
import {Notebook} from "../../../model/notebook";
import Session from "../../../utils/session";

export interface Actions {
    setImage: (v: string) => Action<void>;
    save: (state: NotebookState) => Action<void>;
    updateTitle: (v: string) => Action<string>;
    updateState: (key: string, value: string) => Action<KeyValue>;
    changeSwitch: (key: string, value: boolean) =>Action<KeyBool>;
    updateItems: (values: string[]) => Action<string[]>;
    addItem: ()=>Action<void>;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        setImage: (v: string) => {
            dispatch(actions.setImage(v));
        },
        save : (state: NotebookState) => {
            const notebookState: Notebook = {
                id: state.id,
                account: state.account,
                title: state.title,
                imageUrl: state.imageUrl,
                category: state.category,
                description: state.description,
                adult: state.adult,
                image: state.image,
                items: state.items,
                pages: state.pages,
                editable: state.editable,
                private: state.private,
                createdAt: state.createdAt,
            };

            const items = notebookState.items.map((val, idx) => {
                if (val.length === 0) {
                    return "項目" + (idx + 1);
                }
                return val;
            })
            notebookState.items = items;

            var callback = (json: any, error: FetchError) => {
                if (error) {
                    return;
                }
                const resp: Notebook = json as Notebook;
                location.href = "/" + resp.account.id + "/notebooks/" + resp.id;
            }

            if(notebookState.id) {
                UrlFetch.instance.post("/" + notebookState.account.id + "/notebooks/" + notebookState.id, notebookState, callback);
                return;
            }
            const session: Session = new Session();
            UrlFetch.instance.post("/" + session.getId() + "/notebooks/new", notebookState, callback);
        },
        updateTitle: (v: string) => {
            dispatch(actions.updateTitle(v));
        },
        updateState: (k: string, v:string) => {
            dispatch(actions.updateState({key: k, value: v}));
        },
        changeSwitch: (k: string, v:boolean) => {
            dispatch(actions.updateBoolean({key: k, value:v}));
        },
        updateItems: (values: string[]) => {
            dispatch(actions.updateItems(values));
        },
        addItem: () => {
            dispatch(actions.addItem());
        }
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.notebookCreate);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
