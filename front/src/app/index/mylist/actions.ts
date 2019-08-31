import actionCreatorFactory from 'typescript-fsa';
import {ProcessStatus} from "../../common/processStatus";
import {Notebook} from "../../../model/notebook";
import {Notebooks, NotebooksModel} from "../../../model/notebooks";
const actionCreator = actionCreatorFactory();

export const actions = {
    updateSatus: actionCreator<ProcessStatus>('MYLIST_UPDATE_PROCESS'),
    setNotebooks: actionCreator<NotebooksModel>('MYLIST_SET_NOTEBOOKS'),
    update: actionCreator<void>('ROOT_ACTION_UPDATE')
};
