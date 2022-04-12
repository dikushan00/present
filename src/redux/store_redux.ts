import {useMemo} from 'react'
import {Action, applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunkMiddleware, {ThunkAction} from 'redux-thunk'
import app_reducer from "./app_reducer";
import auth_reducer from "./auth_reducer";
import {profile_reducer} from "./profile_reducer";
import {competition_reducer} from "./competition_reducer";
import playgrounds_reducer from "./playgrounds_reducer";
import {match_reducer} from "./match_reducer";

let store
let reducers = combineReducers({
    app: app_reducer,
    auth: auth_reducer,
    profile: profile_reducer,
    playgrounds: playgrounds_reducer,
    match: match_reducer,
    competition: competition_reducer
})

type RootReducerType = typeof reducers
export type AppStateType = ReturnType<RootReducerType>


type PropertiesTypes<T> = T extends {[key: string]: infer U} ? U : never
export type InferActionsTypes<T extends {[key: string]: (...args: any[])=>any}> = ReturnType<PropertiesTypes<T>>

export type ThunkType<A extends Action> = ThunkAction<Promise<void>, AppStateType, unknown, A >

function initStore(initialState) {
    return createStore(
        reducers,
        initialState,
        composeWithDevTools(applyMiddleware(thunkMiddleware))
    )
}

export const initializeStore = (preloadedState) => {
    let _store = store ?? initStore(preloadedState)

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = initStore({
            ...store.getState(),
            ...preloadedState,
        })
        // Reset the current store
        store = undefined
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store
    // Create the store once in the client
    if (!store) store = _store

    return _store
}

export function useStore(initialState) {
    return useMemo(() => initializeStore(initialState), [initialState])
}