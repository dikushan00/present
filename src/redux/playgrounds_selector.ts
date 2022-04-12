import {AppStateType} from "./store_redux";


export const getPlaygroundsTypes = (state: AppStateType) => state.playgrounds.playgroundsTypes
export const getPlaygroundsFormats = (state: AppStateType) => state.playgrounds.playgroundsFormats