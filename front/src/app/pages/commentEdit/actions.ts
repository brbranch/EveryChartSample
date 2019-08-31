import actionCreatorFactory from 'typescript-fsa';
import {isBoolean} from "util";
import {NotebookPage} from "../../../model/notebookPage";
import {NotebookComment} from "../../../model/notebookComment";
import {IndexNum} from "../edit/actions";
const actionCreator = actionCreatorFactory();

export const commentEditActions = {
    setVisible: actionCreator<boolean>('COMMENTEDIT_SETVISIBLE'),
    showComment: actionCreator<NotebookComment>('COMMENTEDIT_SHOW_COMMENT'),
    changeRate: actionCreator<IndexNum>('COMMENTEDIT_ACTION_CHANGERATE'),
    changeComment: actionCreator<string>('COMMENTEDIT_ACTION_CHNAGECOMMENT'),
    update: actionCreator<NotebookComment>('COMENTEDIT_UPDATE_COMMENT')
};
