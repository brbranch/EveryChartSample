import {createStore, combineReducers, applyMiddleware} from 'redux';
import { testReducer, TestState } from './sample/states/testState';
import { testApiReducer } from './sample/states/testApiState';
import { rootReducer, RootState } from "./app/routerState";
import thunk from 'redux-thunk'
import { avaterReducer, AvaterState} from "./app/index/avater/state";
import {connectRouter, LocationChangeAction, RouterState} from 'connected-react-router'
import {notebookReducer, NotebookState} from "./app/notebooks/create/state";
import {mylistReducer, MylistState} from "./app/index/mylist/state";
import {loginReducer, LoginState} from "./app/tops/login/state";
import {notebookDetailReducer, NotebookDetailState} from "./app/notebooks/details/state";
import {NotebookPageEditState, notebookPageEditReducer} from "./app/pages/edit/state";
import {notebookPageDetailReducer, NotebookPageDetailState} from "./app/pages/details/state";
import {notebookCommentEditReducer, NotebookCommentEditState} from "./app/pages/commentEdit/state";
import {indexReducer, IndexState} from "./app/index/state";
import {settingReducer, SettingState} from "./app/index/settings/state";

export type AppState = {
    login: LoginState,

    router: RouterState,
    // Root部分
    root: RootState,
    // Avater
    avater: AvaterState,
    // Index
    index: IndexState,
    // 設定
    setting: SettingState,

    notebookCreate: NotebookState,
    notebookDetail: NotebookDetailState,
    notebookPageEdit: NotebookPageEditState,
    notebookPageDetail: NotebookPageDetailState,
    notebookComment: NotebookCommentEditState
    mynotebook: MylistState,

    // 以下はテスト
    hoge: TestState,
    fuga: TestState
};


export default (history: any) =>  combineReducers<AppState>({
    router: connectRouter(history),
    login: loginReducer,
    root: rootReducer,
    index:indexReducer,
    setting: settingReducer,
    avater: avaterReducer,
    notebookCreate: notebookReducer,
    notebookDetail: notebookDetailReducer,
    notebookPageEdit: notebookPageEditReducer,
    notebookPageDetail: notebookPageDetailReducer,
    notebookComment: notebookCommentEditReducer,
    mynotebook: mylistReducer,
    hoge: testReducer,
    fuga: testApiReducer,
    }
);

