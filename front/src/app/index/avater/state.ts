import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { actions } from './actions';
import {Account, defaultAccount} from "../../../model/account";
import JsonReader from "../../../utils/jsonReader";


/** アバターのState */
export interface AvaterState {
    account: Account
}

const account: Account = JsonReader.read<Account>("avater") || defaultAccount();

export const defaultAvater: AvaterState = {
    account: account
}

export const avaterReducer = reducerWithInitialState(defaultAvater)
    .case(actions.update, (state) => {
        return state;
    })
