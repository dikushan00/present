import {PlayerInfoType, ProfileType} from "./player";
import {CityType} from "./system";
import {Match, MatchEvent} from "./match";

export type Stadium = {
    id: number,
    stadium_type_id: number | null,
    stadium_format_id: number | null,
    city_id: number,
    name: string
    coordinates: [number, number]
    avatar: string | null
    address: string | null
    stadium_type?: StadiumType | null
    stadium_format?: StadiumFormat | null
    city?: CityType | null
}

export type StadiumType = {
    id: number,
    name: string
    title: string | null
    stadiums: Stadium[]
}

export type StadiumFormat = {
    id: number,
    value: number,
    name: string
    count: string
    stadiums: Stadium[]
}

export interface TeamType {
    id: number
    value: number
    key?: number
    captain_id: number
    city_id: number
    name: string
    label?: string
    logo: string
    city?: CityType
    slug: string
    playersCount: number
    players?: PlayerInfoType[]
    matches?: Match[]
    matches_away?: Match[]
    matchEvents?: MatchEvent[]
}

export type TeamStatType = {
    "matches_count": number | null,
    "matches_count_average": number | null,
    "win": number | null,
    "win_average": string | null,
    "draft": number | null,
    "draft_average": string | null,
    "defeat": number | null,
    "defeat_average": string | null,
    "goals": number | null,
    "goals_average": string | null,
    "missed_goals": number | null,
    "missed_goals_average": string | null,
    "points": number | null,
    "points_average": string | null,
    "goals_difference": number | null,
    "goals_difference_average": string | null,
    "yellow_cards": number | null,
    "yellow_cards_average": string | null,
    "db_yellow_cards": number | null,
    "db_yellow_cards_average": string | null,
    "red_cards": number | null,
    "red_cards_average": string | null
}

export type StatsObj = { home: TeamStatType, away: TeamStatType, total: TeamStatType }

export interface PlayerTeamRequest {
    id: number,
    team_id: number | null,
    user_id: number,
    accepted: boolean,
    answered: boolean,
    invitation: boolean,
    user?: ProfileType | null,
    team: TeamType | null
}

export interface TeamsDataSource extends TeamType {
    requested: boolean
}