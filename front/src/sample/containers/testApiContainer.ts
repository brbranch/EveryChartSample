import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { testApiActions } from '../actions/testApiAction';
import { TestApiComponent } from '../components/testApiComponent';

export interface TestApiActions {
    submit: () => Action<{}>;
}

function mapDispatchToProps(dispatch: Dispatch<Action<{}>>) {
    return {
        submit() {
            dispatch(testApiActions.start({}));
            fetch('/test')
                .then(res => {
                    return res.json()
                })
                .then(json => {
                    dispatch(testApiActions.done({ params: {} , result: json }))
                })
                .catch(error => {
                    dispatch(testApiActions.failed({ params: {} , error: error}))
                });
        }
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.fuga);
}

export default connect(mapStateToProps, mapDispatchToProps)(TestApiComponent);
