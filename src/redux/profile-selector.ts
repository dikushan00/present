import {AppStateType} from "./store_redux";

export const getProfile = (state: AppStateType) => state.profile?.profile
export const getPlayer = (state: AppStateType) => state.profile?.player