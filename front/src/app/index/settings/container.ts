import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { settingAction } from './actions'
import {Component} from './component';
import EventDispacher from "../../../eventDispacher";
import {FetchError, UrlFetch} from "../../../client/fetch";

export interface SettingActions {
    bye: (callback: (error: FetchError) => void ) => Action<void>;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        bye : (callback: (error: FetchError) => void ) => {
            UrlFetch.instance.post("/home/goodbye", {}, (json: any, error: FetchError) => {
                if (error) {
                    callback(error);
                    return;
                }
                dispatch(settingAction.goodbye());
                EventDispacher.instance.setDisableMenu(true);
                callback(null);
            })
        }
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.setting);
}

export const SettingPage = connect(mapStateToProps, mapDispatchToProps)(Component);
