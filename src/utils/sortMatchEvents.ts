import {getTeamSide} from "./getTeamSide";
import {Match, MatchEvent} from "../../types/match";

export const sortMatchEvents = (events: MatchEvent[], match: Match) => {

    let matchScore = {home: 0, away: 0}
    let matchEvents = events.sort((a, b) => a.minute > b.minute ? 1 : -1)
    matchEvents = matchEvents.map(item => {
        if (item.event_name === "GOAL") {
            let {side} = getTeamSide(item.team_id, match)
            matchScore[side] = matchScore[side] + 1
            return {...item, match_score: matchScore.home + " : " + matchScore.away, matchScore}
        }
        return {...item, match_score: matchScore.home + " : " + matchScore.away, matchScore}
    })
    return matchEvents
}