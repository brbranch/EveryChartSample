import actionCreatorFactory from 'typescript-fsa';
import {NotebookPage, NotebookPageModel} from "../../../model/notebookPage";
import {NotebookPagesModel} from "../../../model/notebookPages";
const actionCreator = actionCreatorFactory();

export const actions = {
    update: actionCreator<void>('ROOT_ACTION_UPDATE'),
    setPages: actionCreator<NotebookPagesModel>('ROOT_NOTEBOOK_DETAILS_SETPAGES')
};
