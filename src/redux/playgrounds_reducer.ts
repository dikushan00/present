import {InferActionsTypes, ThunkType} from "./store_redux"
import {PlaygroundsAPI} from "../api/PlaygroundsAPI";
import {Stadium, StadiumFormat, StadiumType} from "../../types/teams";

let initialState = {
    playgroundsTypes: [] as StadiumType[],
    playgroundsFormats: [] as StadiumFormat[],
    playgrounds: [] as Stadium[],
    initialized: false
}

export type PlaygroundInitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsPlayground>
type getThunkType = ThunkType<ActionsType>

let playgrounds_reducer = (state = initialState, action: ActionsType): PlaygroundInitialStateType => {

    switch (action.type) {

        case 'GSL/PLAYGROUNDS/SET_PLAYGROUNDS': {
            return {
                ...state,
                playgrounds: action.payload
            }
        }
        case 'GSL/PLAYGROUNDS/SET_PLAYGROUNDS_TYPES': {
            return {
                ...state,
                playgroundsTypes: action.payload
            }
        }
        case 'GSL/PLAYGROUNDS/SET_PLAYGROUNDS_FORMATS': {
            return {
                ...state,
                playgroundsFormats: action.payload
            }
        }
        default:
            return state
    }
}

export const actionsPlayground = {
    setPlaygrounds: (playgrounds: Stadium[]) => ({
        type: "GSL/PLAYGROUNDS/SET_PLAYGROUNDS",
        payload: playgrounds
    } as const),
    setPlaygroundsTypes: (playgroundsTypes: StadiumType[]) => ({
        type: "GSL/PLAYGROUNDS/SET_PLAYGROUNDS_TYPES",
        payload: playgroundsTypes
    } as const),
    setPlaygroundsFormats: (playgroundsFormats: StadiumFormat[]) => ({
        type: "GSL/PLAYGROUNDS/SET_PLAYGROUNDS_FORMATS",
        payload: playgroundsFormats
    } as const)
}

export default playgrounds_reducer

export const getStadiums = (): getThunkType => async (dispatch) => {
    try {
        let res = await PlaygroundsAPI.getPlaygrounds()
        if(res) {
            dispatch(actionsPlayground.setPlaygrounds(res.map(item => ({...item, value: item.id, label: item.name}))))
        }
    } catch (e ) {}
}

export const getPlaygroundsSetup = (): getThunkType => async (dispatch) => {
    try {
        let response = await PlaygroundsAPI.getPlaygroundTypes()
        response && dispatch(actionsPlayground.setPlaygroundsTypes(response))
        let responseFormats = await PlaygroundsAPI.getPlaygroundFormats()
        responseFormats && dispatch(actionsPlayground.setPlaygroundsFormats(responseFormats))
    } catch (e) {
    }
}