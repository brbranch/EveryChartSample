import actionCreatorFactory from 'typescript-fsa';
import {NotebookPage} from "../../../model/notebookPage";
import {RecentNotebooks} from "../../notebooks/recents/state";
const actionCreator = actionCreatorFactory();

export const loginActions = {
    addRecentPages : actionCreator<NotebookPage[]>('LOGIN_ACTION_ADD_PAGES'),
    setCursor: actionCreator<string>('LOGIN_ACTION_SET_NEXT_CURSOR'),
    setRecentNotebooks: actionCreator<RecentNotebooks>('LOGIN_ADD_RECENT_NOTEBOOKS'),
    setBookLoading: actionCreator<boolean>('LOGIN_ADD_SET_BOOKLOADING')
};
