import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { actions } from './actions';
import {act} from "react-dom/test-utils";
import JsonReader from "../../utils/jsonReader";
import {AvaterState, defaultAvater} from "./avater/state";
import {defaultAccount} from "../../model/account";

export interface IndexState {
    name: string;
    accountId: string;
}

const avater = JsonReader.read<Account>("avater") || defaultAccount();
const initialState: IndexState = {
    name: avater.name,
    accountId: avater.id,
};


export const indexReducer = reducerWithInitialState(initialState)
