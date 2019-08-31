import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { actions } from './actions';
import {act} from "react-dom/test-utils";

export interface XXXState {
    name: string;
    email: string;
}

const initialState: XXXState = {
    name: '',
    email: ''
};

export const xxxReducer = reducerWithInitialState(initialState)
    .case(actions.update, (state) => {
        return state;
    })
