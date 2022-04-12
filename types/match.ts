import {Stadium, StadiumFormat, StadiumType, TeamType} from "./teams";
import {PlayerInfoType} from "./player";

export interface Match extends MatchTeamsId {
    id: number,
    date: string,
    stadium_id: number | null,
    next_round_match_id: number | null,
    playoff_index: number | null,
    stadium_other: string | null,
    home_team_score: number | null,
    away_team_score: number | null,
    home_team_score_value?: number | string | null,
    away_team_score_value?: number | string | null,
    status_id: number,
    win_team_id?: number | null,
    accepted: boolean,
    penalty_series: boolean | null,
    home_penalty_score: number | null,
    away_penalty_score: number | null,
    time_format_id: number,
    stadium_format_id: number,
    competition_id: number,
    competition_round_id: number | null,
    createdAt: string,
    updatedAt: string,
    playoff_round?: string | null,
    homePrevMatch?: string ,
    awayPrevMatch?: string ,
    group_code?: string | null,
    stadium?: Stadium | null,
    status?: EventStatus | null,
    home_team?: TeamType | null
    timeFormat?: MatchTimeFormat | null,
    stadiumFormat?: StadiumFormat | null,
    away_team?: TeamType | null,
    competition?: Competition | null,
    competitionRound?: CompetitionRound | null,
    matchEvents?: MatchEvent[]
    lineups?: MatchLineup[]
}

export interface MatchLineup {
    id: number
    match_id: number
    player_id: number
    player?: PlayerInfoType
    team_id: number
}
export interface MatchEvent {
    id: number,
    event_name: string,
    title: string,
    minute: number | null,
    player_id: number,
    player?: PlayerInfoType,
    team_id: number,
    team?: TeamType,
    match_id: number,
    match?: Match | null,
    event_metric_id: number,
    eventMetric?: MatchEventMetrics | null,
    createdAt: string,
    updatedAt: string
}

export interface Competition {
    id: number,
    name: string,
    title: string | null,
    date: string | null,
    finish_date: string,
    logo: string | null,
    status_id: number,
    season_id: number,
    competition_type_id: number,
    time_format_id: number,
    stadiums: Stadium[] | null,
    stadium_other: string | null,
    stadium_format_id: number,
    stadium_type_id: number | null,
    max_teams_count: number | null,
    createdAt: string,
    updatedAt: string,
    description: string | null,
    cost: number | null,
    status?: EventStatus,
    season?: PlaySeason,
    competitionType?: CompetitionType,
    timeFormat?: MatchTimeFormat,
    stadiumFormat?: StadiumFormat,
    stadiumType?: StadiumType,
    disq?: CompetitionsPlayersDisq[],
    rounds?: CompetitionRound[],
    matches?: Match[]
}

export interface CompetitionData extends Competition {
    tournament?: Competition,
    teams?: TeamType[]
    matchesSort?: { semi: Match[], final: Match, quarter: Match[], eighth: Match[], sixteenth?: Match[] }
}

export interface CompetitionsPlayersDisq {
    id: number
    competition_id: number
    player_id: number
    count: number | null
    reason: string | null
    competition?: Competition | null
    player?: PlayerInfoType | null
}

export interface CompetitionRound {
    id: number
    name: string
    competition_id: number
    competition?: Competition
    matches?: Match[]
}

export interface CompetitionType {
    id: number,
    name: string,
    format: string,
    createdAt: string,
    updatedAt: string
}

export interface EventStatus {
    id: number,
    name: string,
    title: string,
    createdAt: string,
    updatedAt: string
}

export interface PlaySeason {
    id: number,
    name: string,
    year: string,
    createdAt: string,
    updatedAt: string
}

export type MatchSettingsType = {
    timeFormats: MatchTimeFormat[]
    stadiumFormats: StadiumFormat[]
    stadiumTypes: StadiumType[]
};

export type MatchTimeFormat = {
    id: number
    value: number,
};

export interface MatchEventMetrics {
    id: number,
    value: number,
    name: string,
    title: string,
    createdAt: string,
    updatedAt: string
}

export interface MatchTeamsId {
    home_team_id: number,
    away_team_id: number
}

export type MatchResultType = "win" | "draw" | "defeat" | null

export interface TeamMatchType extends Match {
    result: MatchResultType
}

interface MatchEventsData extends MatchEvent {
    match_score?: string
}

export interface MatchData extends Match {
    history?: Match[]
    matchEvents?: MatchEventsData[]
}