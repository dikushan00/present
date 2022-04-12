import {Match} from "../../types/match";

export const getWinnerTeamId = (match: Match) => {
    if(!match || (match?.away_team_score === null || !match?.home_team_score === null))
        return null
    let win_team_id = null
    if(match.home_team_score > match.away_team_score)
        win_team_id = match.home_team_id
    if(match.away_team_score > match.home_team_score)
        win_team_id = match.away_team_id

    if (!!match.penalty_series && !win_team_id) {
        if(match.home_penalty_score > match.away_penalty_score)
            win_team_id = match.home_team_id
        if(match.home_penalty_score < match.away_penalty_score)
            win_team_id = match.away_team_id
    }
    return win_team_id
}
