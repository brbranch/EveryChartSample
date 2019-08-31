import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

export const settingAction = {
    goodbye: actionCreator<void>('SETTING_ACTION_GOODBYE')
};
