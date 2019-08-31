import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { actions } from './actions'
import {Component} from './component';

export interface AvaterActions {
    update: () => Action<void>;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        update : () => {
        }
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.avater);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
