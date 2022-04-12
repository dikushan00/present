import {instance} from "./API";
import {PlayerTeamRequest, TeamType} from "../../types/teams";
import {PlayerInfoType, ProfileType} from "../../types/player";
import {PlayerStats} from "../components/Teams/PlayersStats";
import {Match} from "../../types/match";
import {GetPlayersParams} from "../../types/request-params";

export const PlayerAPI = {
    getPlayers: (params: GetPlayersParams = {free: false})=> {
        return instance.get<{ rows: PlayerInfoType[], count: number }>(`players`, {
            params
        }).then(res => res.data)
    },
    getPlayersStats: (params: GetPlayersParams = {free: false})=> {
        return instance.get<{ rows: PlayerStats[], count: number }>(`players`, {
            params
        }).then(res => res.data)
    },
    getPlayerInfo: (id: number) => {
        return instance.get<TeamType>(`players/info/${id}`).then(res => res.data)
    },
    getPlayerStats: (id: number) => {
        return instance.get<{  PlayerStats }>(`players/stats/${id}`).then(res => res.data)
    },
    getPlayerMatchHistory: (id: number) => {
        return instance.get<{ status: boolean, matches: Match[] }>(`players/matches/${id}`).then(res => res.data)
    },
    findPlayer: (search: string, params = {free: true}) => {
        return instance.post<{ results: ProfileType[] }>(`users/search`, {search}, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            },
            params
        }).then(res => res.data)
    },
    acceptInvitation: (token: string) => {
        return instance.get<{ status: boolean }>(`users/activate/invitation/${token}`).then(res => res.data)
    },
    acceptActivation: (token: string) => {
        return instance.get<{ status: boolean }>(`users/activate/account/${token}`).then(res => res.data)
    },
    getPlayerRequests: (id: number, invitation: boolean = false) => {
        return instance.get<PlayerTeamRequest[]>(`teams-player-requests/player/${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            },
            params: {
                invitation
            }
        }).then(res => res.data)
    },
    getDetailRequest: (data: { user_id: number, team_id: number }) => {
        return instance.post<PlayerTeamRequest>(`teams-player-requests/player/detail`, data, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then(res => res.data)
    },
    deleteOwnTeam: () => {
        return instance.post<{status: boolean}>(`teams/delete-team`, {}, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then(res => res.data)
    },
}