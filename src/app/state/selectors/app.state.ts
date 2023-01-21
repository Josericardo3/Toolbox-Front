import { ActionReducerMap } from "@ngrx/store";
import { stateReducer } from "../reducer/example.reducer";

export interface AppState{
    dataLogin: any;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
    dataLogin:stateReducer
}