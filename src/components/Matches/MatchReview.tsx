import React from "react";
import {MatchEventMetricEnum} from "../../../types/enums";

export const MatchReview = ({matchData, players}) => {
    if(!matchData?.matchEvents?.length)
        return <div />
    return <div className="match__events__wrapper">
        <h2 className="center">События</h2>
        <div className="match__events">
            {
                matchData?.matchEvents?.map(item => {
                    let player = players?.find(player => player.id === item.player_id)
                    let team_side = "home_team"
                    if (matchData.away_team.id === item.team_id)
                        team_side = "away_team"
                    return <div key={item.id} className={`match__events__item ${team_side}`}>
                        {
                            team_side === "home_team"
                                ? <React.Fragment key={item.id}>
                                    <div
                                        className="match__events__name">{player?.last_name + " " + player?.first_name}</div>
                                    <div className={"flex"}>
                                        {item.event_name === MatchEventMetricEnum.GOAL &&
                                        <div className="match__events__item-info">
                                            <div className="match__events__score">
                                                {item.match_score}
                                            </div>
                                        </div>}
                                        {item.event_name === MatchEventMetricEnum.YELLOW_CARD &&
                                        <div className="match__events__item-info">
                                            <div
                                                className="game__card game__card__yellow"/>
                                        </div>}
                                        {item.event_name === MatchEventMetricEnum.RED_CARD &&
                                        <div className="match__events__item-info">
                                            <div className="game__card game__card__red"/>
                                        </div>}
                                        <div className="match__events__time bold">{item?.minute || 0 + "'"}</div>
                                    </div>
                                </React.Fragment>
                                : <React.Fragment key={item.id}>
                                    <div className={"flex"}>
                                        <div className="match__events__time bold">{item?.minute || 0 + "'"}</div>
                                        {item.event_name === MatchEventMetricEnum.GOAL &&
                                        <div className="match__events__item-info">
                                            <div className="match__events__score">
                                                {item.match_score}
                                            </div>
                                        </div>}
                                        {item.event_name === MatchEventMetricEnum.YELLOW_CARD &&
                                        <div className="match__events__item-info">
                                            <div
                                                className="game__card game__card__yellow"/>
                                        </div>}
                                        {item.event_name === MatchEventMetricEnum.RED_CARD &&
                                        <div className="match__events__item-info">
                                            <div
                                                className="game__card game__card__red"/>
                                        </div>}
                                    </div>
                                    <div
                                        className="match__events__name">{player?.last_name + " " + player?.first_name}</div>
                                </React.Fragment>
                        }
                    </div>
                })
            }
        </div>
    </div>
}