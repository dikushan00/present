import Link from "next/link";
import {getMatchDate} from "../../utils/getMatchDate";
import {ImgWrapper} from "../ImgWrapper";
import React from "react";

export const MatchesHistory = ({matchData}) => (
    <div className="col-md-4 match__content__sidebar__wrapper">
        <div className="match__content__sidebar material">
            <h2>Личные встречи</h2>
            <div className="match__history">
                {
                    matchData?.history?.map(item => {
                        return <Link key={item.id} href={`/matches/${item.id}`}>
                            <div
                                className={`match__history__item cursor__pointer ${item.id === matchData?.id ? "active" : ""}`}>
                                <p className="gray">{item?.competitionRound ? `${item?.competitionRound} тур` : ""}</p>
                                <p className="gray">{getMatchDate(item.date)}</p>
                                <div className="match__history__item__teams">
                                    <div>
                                        <div className="match__history__item__team">
                                            <ImgWrapper src={item.home_team?.logo}
                                                        defaultSrc="/img/default-logo.png"
                                                        alt=""/>
                                            <span
                                                className="team__name">{item.home_team?.name}</span>
                                        </div>
                                        <div className="match__history__item__team">
                                            <ImgWrapper src={item.away_team?.logo}
                                                        defaultSrc="/img/default-logo.png"
                                                        alt=""/>
                                            <span
                                                className="team__name">{item.away_team?.name}</span>
                                        </div>
                                    </div>
                                    <div>
                                        {item.home_team_score !== null ? item.home_team_score : "-"} : {item.away_team_score !== null ? item.away_team_score : "-"}
                                        {matchData?.penalty_series && <p className={"penalty gray"}>{`(${matchData?.home_penalty_score || 0}:${matchData?.away_penalty_score || 0})`}</p>}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    })
                }
            </div>
        </div>
    </div>)