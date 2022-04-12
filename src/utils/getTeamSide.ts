import {Match, MatchResultType} from "../../types/match";

export const getTeamSide = (teamId: number, match: Match): {
    side: "home" | "away" | null, result: MatchResultType
} => {
    let side = null
    if (match.home_team_id === teamId) {
        side = "home"
    }
    if (match.away_team_id === teamId) {
        side = "away"
    }

    let result: MatchResultType = null
    if (match.home_team_score !== null && match.away_team_score !== null) {
        let oppositeSide = side === "home" ? "away" : "home"
        if (match[side + "_team_score"] > match[oppositeSide + "_team_score"]) {
            result = "win"
        }
        if (match[side + "_team_score"] < match[oppositeSide + "_team_score"]) {
            result = "defeat"
        }
        if (match[side + "_team_score"] === match[oppositeSide + "_team_score"]) {
            result = "draw"
        }
    }

    return {side, result}
}