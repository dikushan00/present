import {getWinnerTeamId} from "./getWinnerTeamId";
import {Match} from "../../types/match";

const sortByCode = (arr) => arr && arr.sort((a, b) => a.playoff_index > b.playoff_index ? 1 : -1)
const findPrevMatches = (arr: Match[], edited: Match[]) => {
    if(!arr?.length)
        return []
    return arr.map(item => {
        if(!item.home_team_id || !item.away_team_id) {
            let prevMatches = edited.filter(prev => prev.next_round_match_id === item.id)
            let homePrevMatch
            let awayPrevMatch
            if(!item.home_team_id) {
                let prevMatch = prevMatches.find(item => item.playoff_index % 2 === 1)
                homePrevMatch = prevMatch ? `(${prevMatch.home_team?.name || prevMatch?.homePrevMatch}-${prevMatch?.away_team?.name || prevMatch?.awayPrevMatch})` : ""
            }
            if(!item.away_team_id) {
                let prevMatch = prevMatches.find(item => item.playoff_index % 2 === 0)
                awayPrevMatch = prevMatch ? `(${prevMatch.home_team?.name || prevMatch?.homePrevMatch}-${prevMatch?.away_team?.name || prevMatch?.awayPrevMatch})` : ""
            }
            return {...item, awayPrevMatch, homePrevMatch}
        }
        return item
    })
}

export const getSortedTournamentMatches = (matches: Match[]) => {

    if (!matches?.length) {
        let quarter = new Array(4).fill(null)
        let eighth = new Array(8).fill(null)
        let semi = new Array(2).fill(null)
        let final = null
        return {
            quarter,
            eighth,
            semi,
            final
        }
    }
    let edited = matches.map(item => {
        if (!!item.penalty_series) {
            return {
                ...item,
                win_team_id: getWinnerTeamId(item),
                home_team_score_value: item.home_team_score?.toString() + ` (${item.home_penalty_score || 0})`,
                away_team_score_value: item.away_team_score?.toString() + ` (${item.away_penalty_score || 0})`
            }
        }
        if (item.home_team_score !== null && item.away_team_score !== null) {
            return {
                ...item,
                win_team_id: getWinnerTeamId(item),
                home_team_score_value: item.home_team_score.toString(),
                away_team_score_value: item.away_team_score.toString()
            }
        }
        return {
            ...item,
            win_team_id: null,
            home_team_score_value: item.home_team_score,
            away_team_score_value: item.away_team_score
        }
    })
    let eighth = edited.filter(item => {
        return item.playoff_round === "E"
    })
    eighth = sortByCode(eighth)
    let quarter = edited.filter(item => {
        return item.playoff_round === "Q"
    })
    //@ts-ignore
    quarter = findPrevMatches(sortByCode(quarter), eighth)
    let semi = edited.filter(item => {
        return item.playoff_round === "S"
    })
    //@ts-ignore
    semi = findPrevMatches(sortByCode(semi), quarter)
    let final = edited.find(item => item.playoff_round === "F")

    return {
        quarter,
        eighth,
        semi,
        final
    }
}