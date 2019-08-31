import { Dispatch } from "redux";
import actionCreatorFactory, {ActionCreator, Success, Failure} from "typescript-fsa";

const actionCreator = actionCreatorFactory();

const submit = actionCreator.async<{},{},{}>('ACTION_SUBMIT')

export interface TestAsyncActions {
    start : ActionCreator<{}>;
    failed : ActionCreator<Failure<{},{}>>;
    done : ActionCreator<Success<{}, {}>>;
}

export const testApiActions = {
    start : submit.started,
    failed : submit.failed,
    done: submit.done
};
