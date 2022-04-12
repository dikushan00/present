import {InferActionsTypes, ThunkType} from "./store_redux";
import {PlayerInfoType, ProfileType} from "../../types/player";
import {ProfileAPI} from "../api/ProfileAPI";
import {TeamType} from "../../types/teams";
import {PlayerAPI} from "../api/PlayerAPI";

const initialState = {
    profile: null as ProfileType | null,
    player: null as PlayerInfoType | null,
    isFetching: false as boolean,
    isFetchingProfile: false as boolean
};

type ProfileInitialStateType = typeof initialState;
type ActionsType = InferActionsTypes<typeof actionsProfile>;
type getThunkType = ThunkType<ActionsType>;

export const profile_reducer = (
    state = initialState,
    action: ActionsType
): ProfileInitialStateType => {
    switch (action.type) {
        case "GSLF/PROFILE/SET_PROFILE": {
            return {
                ...state,
                profile: action.profile,
            };
        }
        case "GSLF/PROFILE/UPDATE_PROFILE": {
            return {
                ...state,
                profile: {...state.profile, ...action.profile},
            };
        }
        case "GSLF/PROFILE/SET_PLAYER_INFO": {
            return {
                ...state,
                player: action.player,
            };
        }
        case "GSLF/PROFILE/UPDATE_PLAYER_INFO": {
            return {
                ...state,
                player: {...state.player, ...action.player},
            };
        }
        case "GSLF/PROFILE/JOIN_TEAM": {
            return {
                ...state,
                player: {
                    ...state.player,
                    team: action.payload.team,
                    team_id: action.payload.team.id,
                    isCaptain: action.payload.isCaptain
                },
            };
        }
        case "GSLF/PROFILE/CHANGE_TEAM_CAPTAIN": {
            return {
                ...state,
                player: {...state.player, isCaptain: false},
            };
        }
        case "GSLF/PROFILE/LEFT_TEAM": {
            return {
                ...state,
                player: {...state.player, team: null, team_id: null},
            };
        }
        case "GSLF/PROFILE/SET_FETCHING": {
            return {
                ...state,
                isFetching: action.isFetching,
            };
        }
        case "GSLF/PROFILE/SET_FETCHING_PROFILE": {
            return {
                ...state,
                isFetchingProfile: action.isFetching,
            };
        }
        default:
            return {...state};
    }
};

export const actionsProfile = {
    setProfile: (profile: ProfileType) =>
        ({type: "GSLF/PROFILE/SET_PROFILE", profile} as const),
    updateProfile: (profile: ProfileType) =>
        ({type: "GSLF/PROFILE/UPDATE_PROFILE", profile} as const),
    setPlayerInfo: (player: PlayerInfoType) =>
        ({type: "GSLF/PROFILE/SET_PLAYER_INFO", player} as const),
    updatePlayerInfo: (player: PlayerInfoType) =>
        ({type: "GSLF/PROFILE/UPDATE_PLAYER_INFO", player} as const),
    leftTeam: () =>
        ({type: "GSLF/PROFILE/LEFT_TEAM"} as const),
    joinTeam: (team: TeamType, isCaptain: boolean = false) =>
        ({type: "GSLF/PROFILE/JOIN_TEAM", payload: {team, isCaptain: !!isCaptain}} as const),
    changeTeamCaptain: () =>
        ({type: "GSLF/PROFILE/CHANGE_TEAM_CAPTAIN"} as const),
    setIsFetching: (isFetching: boolean) =>
        ({
            type: "GSLF/PROFILE/SET_FETCHING",
            isFetching,
        } as const),
    setIsFetchingProfile: (isFetching: boolean) =>
        ({
            type: "GSLF/PROFILE/SET_FETCHING_PROFILE",
            isFetching,
        } as const),
};

export const getProfile = (): getThunkType => async (dispatch) => {
    try {
        dispatch(actionsProfile.setIsFetchingProfile(true))
        let response = await ProfileAPI.getProfile()
        dispatch(actionsProfile.setIsFetchingProfile(false))
        if (response) {
            let player = {...response.player, isCaptain: response.player?.team?.captain_id === response.player?.id}
            dispatch(actionsProfile.setPlayerInfo(player))

            let isAdmin = !!response.profile?.roles?.find(item => item.value === "ADMIN")
            response.profile && dispatch(actionsProfile.setProfile({...response.profile, isAdmin}))
        }
    } catch (e) {
        dispatch(actionsProfile.setIsFetchingProfile(false))
    }
}
export const deleteOwnTeam = (): getThunkType => async (dispatch) => {
    try {
        dispatch(actionsProfile.setIsFetching(true))
        let response = await PlayerAPI.deleteOwnTeam()
        dispatch(actionsProfile.setIsFetching(false))
        if (response?.status)
            dispatch(actionsProfile.leftTeam())

    } catch (e) {
        dispatch(actionsProfile.setIsFetching(false))
        throw e
    }
}
