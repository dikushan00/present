import {AppStateType} from "./store_redux";

export const getToken = (state: AppStateType) => state.auth.token