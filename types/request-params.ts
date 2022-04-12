export interface Options {
    limit?: number
    page?: number
}

export interface GetPlayersParams extends Options {
    free?: boolean
    stats?: boolean
}

export interface GetTeamsParams extends Options {
    not_self?: boolean
}
export interface GetTeamsStats extends Options {
    min?: boolean
}