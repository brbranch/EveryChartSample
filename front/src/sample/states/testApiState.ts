import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { testApiActions } from '../actions/testApiAction';
import {TestState } from './testState'

const initialState: TestState = {
    name : 'aaa',
    email: ''
}

export const testApiReducer = reducerWithInitialState(initialState)
    .case(testApiActions.start, (state, payload: any) => {
        return { ...state , name : 'test', email: 'start'  };
    })
    .case(testApiActions.done, (state, payload: any) => {
        return { ...state, name : payload.result.test };
    })
    .case(testApiActions.failed, (state, payload) => {
        return state;
    });

