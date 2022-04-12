import {CityType, Role} from "./system";
import {TeamType} from "./teams";
import {CompetitionsPlayersDisq, MatchEvent, MatchLineup} from "./match";
import {GenderEnum, HandTypeEnum} from "./enums";

export type ProfileType = {
    id: number;
    first_name: string;
    last_name: string;
    patronymic: string | null;
    full_name: string | null;
    email: string | null;
    avatar: string | null
    invitation_link?: string | null
    birthday: string
    city_id: number
    gender: GenderEnum | null
    activated: boolean
    isAdmin?: boolean
    banned: boolean
    banReason: string | null
    roles?: Role[]
    city?: CityType
    player?: PlayerInfoType
};

export interface PlayerInfoType  {
    id: number
    number: number | null
    position_id: number | null
    position: PlayerPosition
    avatar: string
    isCaptain: boolean
    banned: boolean
    banExpires: string | null
    city: CityType
    team_id: number | null,
    hand_type: HandTypeEnum | null,
    team?: TeamType | null
    height: number
    weight: number
    disq: CompetitionsPlayersDisq[]
    events?: MatchEvent | null
    games?: MatchLineup | null
    user_id: number
    user?: ProfileType
}

export interface PlayerPosition {
    id: number
    value: number
    name: string
    label: string
    code: string | null
    title: string
    players: PlayerInfoType[]
}

export interface PlayerDataType extends PlayerInfoType {
    inGame?: boolean,
    index: number
    key: number
    last_name?: string,
    first_name?: string
    label?: string
    goalsCount?: number[]
}

export interface PlayerOptionType extends PlayerDataType {
    value: number
}