import {instance} from "./API";
import {PlayerTeamRequest, StatsObj, TeamStatType, TeamType} from "../../types/teams";
import {PlayerInfoType, ProfileType} from "../../types/player";
import {PlayerStats} from "../components/Teams/PlayersStats";
import {GetTeamsParams, GetTeamsStats} from "../../types/request-params";
export const TeamAPI = {
    getTeams: (params: GetTeamsParams = {
        not_self: false
    }) => {
        return instance.get<{ rows: TeamType[], count: number }>(`teams`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            },
            params
        }).then(res => res.data)
    },
    findTeam: (search: string, params = {free: true}) => {
        return instance.post<{ results: TeamType[] }>(`teams/search`, {search}, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            },
            params
        }).then(res => res.data)
    },
    getTeam: (id: number) => {
        return instance.get<TeamType>(`teams/${id}`).then(res => res.data)
    },
    updateTeam: (body) => {
        return instance.put<TeamType>(`teams`, body, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then(res => res.data)
    },
    getTeamPlayers: (id: number) => {
        return instance.get<PlayerInfoType[]>(`teams/players/${id}`).then(res => res.data)
    },
    getTeamPlayersStats: (id: number) => {
        return instance.get<PlayerStats[]>(`teams/players/stats/${id}`).then(res => res.data)
    },
    getTeamsStats: (params: GetTeamsStats) => {
        return instance.get<{rows: { stats: StatsObj, team: TeamType }[], count: number}>(`teams/stats/all`, {
            params
        }).then(res => res.data)
    },
    getTeamStats: (id: number) => {
        return instance.get<{ stats: { home: TeamStatType, away: TeamStatType, total: TeamStatType } }>(`teams/stats/${id}`).then(res => res.data)
    },
    getTeamGroupPlayers: async (body: { teams: number[] }) => {
        return await instance.post<PlayerInfoType[]>(`teams/players`, body).then(res => res.data)
    },
    getTeamRequests: (id: number, options: { invitation: boolean } = {invitation: false}) => {
        return instance.get<PlayerTeamRequest[]>(`teams-player-requests/team/${id}`, {
            params: options,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then(res => res.data)
    },
}