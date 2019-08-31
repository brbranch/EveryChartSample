import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

export const CommonEvent = {
    AJAX_START: actionCreator<void>('REQUEST_AJAX_START'),
    AJAX_COMPLETE : actionCreator<void>('REQUEST_AJAX_COMPLETE'),
};