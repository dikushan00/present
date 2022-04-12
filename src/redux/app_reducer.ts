import {InferActionsTypes, ThunkType} from "./store_redux"
import {
    ModalConfirmPassword,
    ModalInvitation,
    ModalLogin,
    ModalMessage,
    ModalResendActivation,
    ModalReset,
    ModalSign
} from "../components/modals";
import {actionsAuth} from "./auth_reducer";
import {AuthAPI} from "../api/AuthAPI";
import {StaticAPI} from "../api/StaticAPI";
import React from "react";
import {Notification} from "../../types/system";
import {ProfileAPI} from "../api/ProfileAPI";
import {PlayerPosition} from "../../types/player";

let initialState = {
    initialized: false,
    activeModal: null as ModalObjType | null,
    modalMessageText: null as any,
    cities: null as any,
    appSettings: {
        isTablet: false
    },
    notifications: null as Notification[],
    playerPositions: null as PlayerPosition[],
    modals: [
        {id: "modal-sign", show: false, content: ModalSign, blur: true},
        {id: "modal-login", show: false, content: ModalLogin, blur: true},
        {id: "modal-reset", show: false, content: ModalReset, blur: true},
        {id: "modal-confirm-password", show: false, content: ModalConfirmPassword, blur: true},
        {id: "modal-resend-activation", show: false, blur: true, content: ModalResendActivation},
        {id: "modal-invitation", show: false, content: ModalInvitation, blur: true},
        {id: "modal-message", show: false, content: ModalMessage, blur: false},
    ] as ModalObjType[],
}
type ModalObjType = { id: string, show: boolean, content: React.ComponentType, blur?: boolean }
export type ModalNamesType =
    "modal-sign"
    | "modal-login"
    | "modal-reset"
    | "modal-invitation"
    | "modal-message"
    | "modal-resend-activation"
    | "modal-confirm-password"


export type AppInitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsApp>
type getThunkType = ThunkType<ActionsType>

let app_reducer = (state = initialState, action: ActionsType): AppInitialStateType => {

    switch (action.type) {

        case 'APP/INIT': {
            return {
                ...state,
                initialized: true
            }
        }
        case "APP/CLOSE_MODAL": {
            return {
                ...state,
                activeModal: null,
                modals: state.modals.map(item => {
                    return {...item, show: false};
                })
            };
        }
        case "APP/SET_MODAL_MESSAGE": {
            return {
                ...state,
                modalMessageText: action.payload
            };
        }

        case "APP/SET_IS_TABLET": {
            return {
                ...state,
                appSettings: {...state.appSettings, isTablet: action.payload}
            };
        }

        case "APP/SET_CITIES": {
            return {
                ...state,
                cities: action.payload
            };
        }

        case "APP/SET_POSITIONS": {
            return {
                ...state,
                playerPositions: action.payload
            };
        }

        case "APP/SET_NOTIFICATIONS": {
            return {
                ...state,
                notifications: action.payload
            };
        }

        case "APP/READ_NOTIFICATION": {
            return {
                ...state,
                notifications: state.notifications.map(item => item.id === action.payload.id ? ({
                    ...item,
                    read: true
                }) : item)
            };
        }

        case "APP/READ_ALL_NOTIFICATIONS": {
            return {
                ...state,
                notifications: state.notifications.map(item => ({
                    ...item,
                    read: true
                }) )
            };
        }

        case "APP/SET_ACTIVE_MODAL": {
            return {
                ...state,
                activeModal: state.modals.find(item => item.id === action.payload),
                modals: state.modals.map(item => {
                    if (item.id === action.payload)
                        return {...item, show: true};
                    return {...item, show: false};
                })
            };
        }
        default:
            return state
    }
}

export const actionsApp = {
    initialize: () => ({
        type: 'APP/INIT'
    } as const),
    setActiveModal: (modalType: ModalNamesType) => ({
        type: "APP/SET_ACTIVE_MODAL",
        payload: modalType
    } as const),
    setIsTablet: (payload) => ({
        type: "APP/SET_IS_TABLET",
        payload
    } as const),
    setNotifications: (payload) => ({
        type: "APP/SET_NOTIFICATIONS",
        payload
    } as const),
    readNotification: (payload: {id: number}) => ({
        type: "APP/READ_NOTIFICATION",
        payload
    } as const),
    readAllNotifications: () => ({
        type: "APP/READ_ALL_NOTIFICATIONS"
    } as const),
    setCities: (payload) => ({
        type: "APP/SET_CITIES",
        payload
    } as const),
    setPlayerPositions: (positions: PlayerPosition[]) => ({
        type: "APP/SET_POSITIONS", payload: positions
    } as const),
    closeModal: () => ({
        type: "APP/CLOSE_MODAL"
    } as const),
    setModalText: (text) => ({
        type: "APP/SET_MODAL_MESSAGE",
        payload: text
    }),
}

export const init = (): getThunkType => async (dispatch) => {
    let userInfo = dispatch(checkAuthMe()).catch(async () => {
        return null
    })
    Promise.all([userInfo]).then(() => dispatch(actionsApp.initialize()));
}

export const checkAuthMe = () => async (dispatch, getState) => {
    const isAuth = getState().auth.isAuth
    let token = localStorage.getItem("access_token")
    if (token)
        try {
            let response = await AuthAPI.checkAuthMe()
            if (response) {
                !isAuth && dispatch(actionsAuth.setNewAuth(token, true, response.id, null))
            }
        } catch (e) {
        }
}
const refreshToken = async () => {
    try {
        let refreshToken = localStorage.getItem("refresh_token")
        if (refreshToken) {
            let response = await AuthAPI.refreshToken(refreshToken)
            if (response) {
                localStorage.setItem("access_token", response.access)
                return response.access
            }
        }
    } catch (e) {
    }
    return null
}

export const getCities = () => async (dispatch) => {
    try {
        if (refreshToken) {
            let response = await StaticAPI.getCities()
            if (response) {
                dispatch(actionsApp.setCities(response.map(item => ({...item, label: item?.name, value: item?.id}))))
            }
        }
    } catch (e) {
    }
    return null
}

export const getNotifications = () => async (dispatch) => {
    try {
        if (refreshToken) {
            let response = await ProfileAPI.getNotifications()
            if (response) {
                dispatch(actionsApp.setNotifications(response))
            }
        }
    } catch (e) {
    }
    return null
}
export const getPlayerPositions = () => async (dispatch) => {
    try {
        if (refreshToken) {
            let response = await StaticAPI.getPlayerPositions()
            if (response) {
                dispatch(actionsApp.setPlayerPositions(response.map(item => ({...item, label: item.title, value: item.id}))))
            }
        }
    } catch (e) {
    }
    return null
}

export const showNextModal = (type) => async (dispatch) => {
    dispatch(actionsApp.setActiveModal(type))
};

export const closeModal = () => async (dispatch) => {
    dispatch(actionsApp.closeModal())
};
export const openModalMessage = (message) => async (dispatch) => {
    dispatch(actionsApp.setActiveModal("modal-message"))
    dispatch(actionsApp.setModalText(message || ""))
}

export default app_reducer