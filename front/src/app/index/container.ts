import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { actions } from './actions'
import {Component} from './component';

export interface Actions {
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {};
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.index);
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
