import {MatchAPI} from "../api/MatchAPI";
import {InferActionsTypes, ThunkType} from "./store_redux";
import {MatchEventMetrics, MatchSettingsType} from "../../types/match";

const initialState = {
    matchSettings: null as MatchSettingsType | null,
    eventMetrics: null as MatchEventMetrics[] | null
};

type MatchInitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actionsMatch>;
type getThunkType = ThunkType<ActionsType>;

export const match_reducer = (
    state = initialState,
    action: ActionsType
): MatchInitialStateType => {
    switch (action.type) {
        case "GSLF/MATCH/SET_MATCH_SETTINGS": {
            return {
                ...state,
                matchSettings: action.payload,
            };
        }
        case "GSLF/MATCH/SET_MATCH_EVENT_METRICS": {
            return {
                ...state,
                eventMetrics: action.payload,
            };
        }
        default:
            return {...state};
    }
};

export const actionsMatch = {
    setMatchSettings: (settings: MatchSettingsType) =>
        ({type: "GSLF/MATCH/SET_MATCH_SETTINGS", payload: settings} as const),
    setMatchEventMetrics: (metrics: MatchEventMetrics[]) =>
        ({type: "GSLF/MATCH/SET_MATCH_EVENT_METRICS", payload: metrics} as const),
};

export const getMatchSettings = (): getThunkType => async (dispatch) => {
    try {
        let res = await MatchAPI.getMatchSettings()
        if (res) {
            dispatch(actionsMatch.setMatchSettings({
                ...res,
                stadiumFormats: res.stadiumFormats?.map(item => ({...item, value: item.id, label: item.name})),
                stadiumTypes: res.stadiumTypes?.map(item => ({...item, value: item.id, label: item.title})),
                timeFormats: res.timeFormats?.map(item => ({...item, value: item.id, label: item.value})),
            }))
        }
    } catch (e) {

    }
}

export const getMatchEventsMetrics = (): getThunkType => async (dispatch, getState) => {
    let metrics = getState().match.eventMetrics
    try {
        let res = !metrics && await MatchAPI.getMatchEventMetrics()
        if (res) {
            dispatch(actionsMatch.setMatchEventMetrics(res?.map(i => ({...i, value: i.id, label: i.title}))))
        }
    } catch (e) {

    }
}

