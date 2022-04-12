import React from 'react';
import {MatchAPI} from "../../api/MatchAPI";
import {Match} from "../../../types/match";
import Link from "next/link";
import WrapperScrollbar from "../blocks/WrapperScrollbar/WrapperScrollbar";
import {getMatchDate} from "../../utils/getMatchDate";
import {ImgWrapper} from "../ImgWrapper";
import {cutWord} from "../../utils/cutWord";

export const ComingGames = () => {
    const [games, setGames] = React.useState<Match[] | null>(null)
    React.useEffect(() => {
        const getGames = async () => {
            try {
                let games = await MatchAPI.getMatches()
                if (games)
                    setGames(games)
            } catch (e) {
            }
        }
        getGames()
    }, [])

    if (!games?.length)
        return null

    return <div className="games">
        <div className="title__wrapper">
            <h1 className="main">Ближайшие игры</h1>
        </div>
        <WrapperScrollbar type="thin" className={"games__wrapper overflow"}>
            {
                games?.map((item, i) => {
                    let score = (item.home_team_score || "") + " - " + (item.away_team_score || "")
                    if (!item.home_team_score || !item.away_team_score)
                        score = "-"
                    return <Link key={i} href={`matches/${item.id}`}>
                        <div className="card games__item">
                            <div className="flex">
                                <h5 className="gray">{getMatchDate(item.date)}</h5>
                                <h5 className="gray">{item.status?.title}</h5>
                            </div>
                            <div className="games__item__header flex" style={{justifyContent: "center"}}>
                                <h4>{item.competition.title}</h4>
                            </div>
                            <div className="games__item__content">
                                <div className="games__item__teams flex">
                                    <div className="games__item__team">
                                        <div className={"games__team__wrapper-img"}>
                                            <ImgWrapper defaultSrc="/img/default-logo.png" src={item.home_team?.logo}
                                                        alt="man1"/>
                                        </div>
                                        <span className="team__name">{cutWord(item.home_team.name)}</span>
                                    </div>
                                    <div className="games__score">
                                        {score}
                                    </div>
                                    <div className="games__item__team">
                                        <div className={"games__team__wrapper-img"}>
                                            <ImgWrapper defaultSrc="/img/default-logo.png" src={item.away_team?.logo}
                                                        alt="man1"/>
                                        </div>
                                        <span className="team__name">{cutWord(item.away_team.name)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                })
            }
        </WrapperScrollbar>
    </div>
};