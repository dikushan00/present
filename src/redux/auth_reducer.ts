import {InferActionsTypes, ThunkType} from "./store_redux"
import {Role} from "../../types/system";

const initialState = {
    isAuth: false,
    token: null,
    passToken: null as string | null,
    roles: null,
    userId: null
}

type AuthInitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsAuth>

const auth_reducer = (state = initialState, action: ActionsType):AuthInitialStateType => {

    switch (action.type) {

        case 'NS/AUTH/SET_NEW_AUTH': {
            return {
                ...state,
                ...action.data
            }
        }
        default:
            return state
    }
}

export const actionsAuth = {
    setNewAuth : (token: string | null, isAuth: boolean, userId: number, roles: Role[]) => ({type: 'NS/AUTH/SET_NEW_AUTH', data: { roles, token, isAuth, userId}} as const)
}

export const logout = ():getThunkType => async () => {
    localStorage.setItem("access_token", "")
    localStorage.setItem("refresh_token", "")
    location.reload()
}

type getThunkType = ThunkType<ActionsType>

export default auth_reducer