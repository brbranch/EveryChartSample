import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

export interface KeyValue {
    key: string
    value: string
}

export interface KeyBool {
    key: string
    value: boolean
}

export const actions = {
    setImage: actionCreator<string>('NOTEBOOK_CREATE_URL'),
    updateTitle: actionCreator<string>('NOTEBOOK_UPDATE_TITLE'),
    updateState: actionCreator<KeyValue>('NOTEBOOK_UPDATE_STATE'),
    updateBoolean: actionCreator<KeyBool>('NOTEBOOK_UPDATE_BOOL'),
    updateItems: actionCreator<string[]>('NOTEBOOK_UPDATE_ITEMS'),
    addItem: actionCreator<void>('NOTEBOOK_ADD_ITEM'),
    save: actionCreator<void>('NOTEBOOK_ACTION_SAVE')
};
