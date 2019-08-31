import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import {actions, IndexNum, IndexValue} from './actions'
import {Component} from './component';
import {KeyValue} from "../../notebooks/create/actions";
import {NotebookPageEditState} from "./state";
import {UrlFetch} from "../../../client/fetch";
import {NotebookEditPageModel, NotebookPage, NotebookPageModel} from "../../../model/notebookPage";

export interface Actions {
    updateState: (key: string, value: string) => Action<KeyValue>;
    setImage: (key: string) => Action<string>;
    setRadar: (base64: string) => Action<string>;
    changeRate: (index: number, rate: number) => Action<IndexNum>;
    changeItemValue: (index: number, value: string) => Action<IndexValue>;
    update: (state: NotebookPageEditState, callback: (error: any)=> void) => Action<void>;
    toggleSwitch: (key: string) => Action<string>;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        updateState : (key: string, value: string) => {
            dispatch(actions.updateState({key: key, value: value}));
        },
        setImage: (key: string) => {
            dispatch(actions.setImage(key));
        },
        changeRate: (index: number, rate: number) => {
            dispatch(actions.changeRate({index: index, num: rate}));
        },
        changeItemValue: (index: number, value: string) => {
            dispatch(actions.changeItemValue({index: index, value: value}));
        },
        setRadar: (base64: string) => {
            dispatch(actions.setRadarImage(base64));
        },
        update: (state: NotebookPageEditState, callback: (error: any) => void) => {
            const request : NotebookPageEditState = {
                page: state.page,
                image: state.image || '',
                isNew: state.isNew
            };
            const model = new NotebookEditPageModel(request);
            model.update((state: NotebookPage, error: any) => {
                callback(error);
                if(!error) {
                    const newModel = new NotebookPageModel(state);
                    location.href = newModel.getUrl("");
                }
            });
        },
        toggleSwitch: (key: string) => {
            dispatch(actions.toggleSwitch(key));
        }
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.notebookPageEdit);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
