import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { routerActions } from './routerActions'
import {Component} from './component';

export interface RootActions {
    showProgress: () => Action<void>;
    hideProgress: () => Action<void>;
    hideToast: () => Action<void>;
    nextToast: () => Action<void>;
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        showProgress: () => dispatch(routerActions.showProgress()),
        hideProgress: () => dispatch(routerActions.hideProgress()),
        hideToast: () => dispatch(routerActions.hideToast()),
        nextToast: () => dispatch(routerActions.nextToast())
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.root);
}



export default connect(mapStateToProps, mapDispatchToProps)(Component);
