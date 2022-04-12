import {instance} from "./API";
import {GetPlayersParams} from "../../types/request-params";
import {Competition, CompetitionType, Match} from "../../types/match";
import {TeamType} from "../../types/teams";


export const TournamentAPI = {
    getTournaments: (params: GetPlayersParams = {free: false}) => {
        return instance.get<Competition[]>(`competitions`).then(res => res.data)
    },
    updateTournament: (id: number, body) => {
        return instance.patch<Competition>(`competitions/${id}`, body, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then(res => res.data)
    },
    getCompetitionsTypes: () => {
        return instance.get<CompetitionType[]>(`competition-types`).then(res => res.data)
    },
    getTournamentById: (id: number) => {
        return instance.get<Competition>(`competitions/${id}`).then(res => res.data)
    },
    getTournamentBySlug: (slug: string) => {
        return instance.get<Competition>(`competitions/slug/${slug}`).then(res => res.data)
    },
    getTournamentMatches: (slug: string) => {
        return instance.get<Match[]>(`competitions/matches/${slug}`).then(res => res.data)
    },
    getTournamentTeams: (slug: string) => {
        return instance.get<{ team?: TeamType, competition_id: number, team_id: number }[]>(`competitions/teams/${slug}`).then(res => res.data)
    },
}