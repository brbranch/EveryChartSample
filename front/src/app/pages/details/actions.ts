import actionCreatorFactory from 'typescript-fsa';
import {CommentsResponse, NotebookComment} from "../../../model/notebookComment";
const actionCreator = actionCreatorFactory();

export const pageDetailActions = {
    toggleLike: actionCreator<number>('PAGE_DETAILS_TOGGLE_LIKE'),
    showComment: actionCreator<void>('PAGE_DETAILS_ADD_COMMENT'),
    cancelComment: actionCreator<void>('PAGE_DETAILS_CANCEL_COMMENT'),
    addComment: actionCreator<NotebookComment>('PAGE_DETAILS_POST_COMMENT'),
    addComments: actionCreator<CommentsResponse>('PAGE_DETAILS_ADD_COMMENTS'),
    commentLike: actionCreator<string>('PAGE_DETAILS_COMMENT_LIKE'),
    deleteComment: actionCreator<NotebookComment>('PAGE_DETAILS_DELETE_COMMENT'),
    executeDeleteComment: actionCreator<void>('PAGE_DETAILS_EXECUTE_DELETE_COMMENT'),
};
