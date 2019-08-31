import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { settingAction } from './actions';
import {act} from "react-dom/test-utils";
import {Account, defaultAccount} from "../../../model/account";
import JsonReader from "../../../utils/jsonReader";

export interface SettingState {
    account: Account
    goodbye: boolean
}

const account: Account = JsonReader.read<Account>('avater') || defaultAccount();
const initialState: SettingState = {
    account: account,
    goodbye: false,
}

export const settingReducer = reducerWithInitialState(initialState)
    .case(settingAction.goodbye, (state) => {
        return {...state, goodbye: true}
    })
