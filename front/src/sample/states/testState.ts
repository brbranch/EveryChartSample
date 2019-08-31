import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { testActions } from '../actions/testAction';

export interface TestState {
    name: string;
    email: string;
}

const initialState: TestState = {
    name: '',
    email: ''
};


export const testReducer = reducerWithInitialState(initialState)
    .case(testActions.updateName, (state, name) => {
        return Object.assign({}, state, { name });
    })
    .case(testActions.updateEmail, (state, email) => {
        return Object.assign({}, state, { email });
    });