import {instance} from "./API";
import {Match, MatchTeamsId} from "../../types/match";
import {Options} from "../../types/request-params";

export const MatchAPI = {
    getMatchSettings() {
        return instance.get('matches/settings').then(res => {
            return res.data
        })
    },
    getTeamMatchesScore(params: {limit?: number} = {}) {
        return instance.get('/matches/team/score', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then(res => {
            return res.data
        })
    },
    getMatches(params: {limit?: number} = {}) {
        return instance.get('matches', {
            params
        }).then(res => {
            return res.data
        })
    },
    getMatch(id: number) {
        return instance.get(`matches/${id}`).then(res => {
            return res.data
        })
    },
    getMatchEventMetrics() {
        return instance.get(`match-events-metrics`).then(res => {
            return res.data
        })
    },
    async getMatchPlayers(matchId: number) {
        return await instance.get(`matches/players/${matchId}`).then(res => {
            return res.data
        })
    },
    async getMatchHistory(data: MatchTeamsId, params: Options = {}) {
        return await instance.post<{ rows: Match[], count: number }>("matches/history", data, {params}).then(res => {
            return res.data
        })
    },
    async getTeamMatchHistory(teamId: number, params: Options = {}) {
        return await instance.get<{ rows: Match[], count: number }>(`matches/history/team/${teamId}`, {
            params
        }).then(res => {
            return res.data
        })
    },
    async getMatchRequests(data: { player_id: number, team_id: number }) {
        return await instance.post("matches/requests", data, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then(res => {
            return res.data
        })
    },
    async declineMatchRequest(data: { player_id: number, team_id: number, match_id: number }) {
        return await instance.post("matches/decline-request", data, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then(res => {
            return res.data
        })
    },
    async acceptMatchRequest(data: { player_id: number, team_id: number, match_id: number }) {
        return await instance.post("matches/accept-request", data, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then(res => {
            return res.data
        })
    },
}
