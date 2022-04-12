import {ProfileType} from "./player";

export interface Role {
    value: string,
    description: string,
    id: number
    users?: ProfileType[]
}

export interface CityType {
    id: number
    country_id: number
    name: string
    code: string
    country_name: string
    country?: Country
}

export interface Country {
    name: string,
    code: string,
    id: number
    cities?: CityType[]
}

export interface Notification {
    id: number
    message: string
    createdAt: string
    updatedAt: string
    type: string
    read: boolean
    object_id: number
    sender_id: number
    sender?: ProfileType | null
    receiver_id: number
    receiver?: ProfileType | null
}