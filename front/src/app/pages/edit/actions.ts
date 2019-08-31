import actionCreatorFactory from 'typescript-fsa';
import {KeyValue} from "../../notebooks/create/actions";
const actionCreator = actionCreatorFactory();

export interface IndexNum {
    index: number
    num: number
}

export interface IndexValue {
    index: number
    value: string
}

export const actions = {
    updateState: actionCreator<KeyValue>('PAGEEDIT_ACTION_UPDATESTATE'),
    setImage: actionCreator<string>('PAGEEDIT_ACTION_SETIMAGE'),
    setRadarImage: actionCreator<string>('PAGEEDIT_ACTION_SETRADAR'),
    changeRate: actionCreator<IndexNum>('PAGEEDIT_ACTION_CHANGERATE'),
    changeItemValue: actionCreator<IndexValue>('PAGEEDIT_ACTION_CHANGEITEMVALUE'),
    toggleSwitch: actionCreator<string>('PAGEEDIT_ACTION_TOGGLESWITCH')
};
