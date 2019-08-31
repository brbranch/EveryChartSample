import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

export const routerActions = {
    showToast: actionCreator<string>('ROOT_ACTION_SHOW_TOAST'),
    hideToast: actionCreator<void>('ROOT_ACTION_HIDE_TOAST'),
    showProgress: actionCreator<void>('ROOT_ACTION_SHOW_PROGRESS'),
    hideProgress: actionCreator<void>('ROOT_ACTION_HIDE_PROGRESS'),
    nextToast: actionCreator<void>('ROOT_ACTION_NEXT_TOAST'),
    setBack: actionCreator<string>('ROOT_ACTION_SET_BACK_BUTTON'),
    setDisableMenu: actionCreator<boolean>('ROOT_ACTION_DISABLE_MENU')
};
