import { Action } from 'typescript-fsa';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { testActions } from '../actions/testAction';
import { TestComponent } from '../components/testComponent';

export interface TestActions {
    updateName: (v: string) => Action<string>;
    updateEmail: (v: string) => Action<string>;
}

function mapDispatchToProps(dispatch: Dispatch<Action<string>>) {
    return {
        updateName: (v: string) => dispatch(testActions.updateName(v)),
        updateEmail: (v: string) => dispatch(testActions.updateEmail(v))
    };
}

function mapStateToProps(appState: AppState) {
    return Object.assign({}, appState.hoge);
}

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent);
