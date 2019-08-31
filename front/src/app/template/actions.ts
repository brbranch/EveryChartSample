import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

export const actions = {
    update: actionCreator<void>('ROOT_ACTION_UPDATE')
};
