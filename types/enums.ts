export enum NotificationEnum {
    FriendlyMatch = "friendly_match",
    FriendlyMatchScore = "friendly_match_score",
    FriendlyMatchAccepted = "friendly_match_accepted",
    FriendlyMatchDeclined = "friendly_match_declined",
    TeamPlayerRequest = "team_player_request",
    TeamPlayerRequestReject = "team_player_request_reject",
    TeamPlayerRequestAccept = "team_player_request_accept",
    TeamInvitation = "team_invitation",
    TeamInvitationAccept = "team_invitation_accept",
    TeamInvitationReject = "team_invitation_reject"
}

export enum HandTypeEnum {
    L = "L", R = "R"
}

export enum GenderEnum {
    M = "M", W = "W"
}

export enum MatchEventMetricEnum {
    GOAL = "GOAL", YELLOW_CARD = "YELLOW_CARD", RED_CARD = "RED_CARD",
    DB_YELLOW_CARD = "DB_YELLOW_CARD", AUTO_GOAL = "AUTO_GOAL", FOUL = "FOUL", PENALTY = "PENALTY",
    DB_PENALTY = "DB_PENALTY", PLAYER_REPLACEMENT = "PLAYER_REPLACEMENT", GOAL_CANCELED = "GOAL_CANCELED", TIME_OUT = "TIME_OUT", VAR = "VAR"
}

export enum PlayoffRoundEnum {
    F = 'Финал', S = '1/2', Q = '1/4', E = '1/8', SX = '1/16', TT = '1/32', SF = '1/64'
}
export enum MatchesPlayoffEnum {
    F = 'F', S = 'S', Q = 'Q', E = 'E', SX = 'SX', TT = 'TT', SF = 'SF'
}