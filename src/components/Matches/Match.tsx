import React from 'react';
import {ImgWrapper} from "../ImgWrapper";
import Link from "next/link";
import {Button, Tabs} from "antd";
import {capitalizeFirstLetter} from "../../utils/capitalizeFirstLetter";
import {getMatchDate} from "../../utils/getMatchDate";
import {MatchReview} from "./MatchReview";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {AppStateType} from "../../redux/store_redux";
import {MatchData, MatchTeamsId} from "../../../types/match";
import {sortMatchEvents} from "../../utils/sortMatchEvents";
import {MatchAPI} from "../../api/MatchAPI";
import {MainLayout} from "../Layouts/MainLayout";
import {getTeamSide} from "../../utils/getTeamSide";
import {PlayerDataType} from "../../../types/player";
import {MatchesHistory} from "./MatchesHistory";
import {MatchLineup} from "./MatchLineup";

const {TabPane} = Tabs;

interface PropsType {
    match: MatchData | null
}
export const Match: React.FC<PropsType> = ({match}) => {
    const id = useRouter().query?.id
    const {player} = useSelector((state: AppStateType) => state.profile)
    const [matchData, setMatchData] = React.useState<MatchData | null>(null)
    const [players, setPlayers] = React.useState<PlayerDataType[] | null>(null)

    React.useEffect(() => {
        if (match) {
            let {matchEvents} = match
            if (matchEvents) {
                matchEvents = sortMatchEvents(matchEvents, match)
            }
            setMatchData({...match, matchEvents})
        }
    }, [match])

    React.useEffect(() => {
        const getTeamPlayers = async (id: number) => {
            try {
                let response = id && await MatchAPI.getMatchPlayers(id)
                if (response && !!response.length) {
                    let players = response.map(item => ({
                        ...item,
                        index: item.id,
                        key: item.id,
                        inGame: true,
                        first_name: item.user.first_name,
                        last_name: item.user.last_name
                    }))
                    players && setPlayers(players)
                }
            } catch (e) {
            }
        }
        id && getTeamPlayers(Number(id))
    }, [])

    React.useEffect(() => {
        const getMatchHistory = async (data: MatchTeamsId) => {
            try {
                let response = data && await MatchAPI.getMatchHistory(data)
                if (response) {
                    setMatchData(prevState => ({...prevState, history: response.rows}))
                } else {
                    setMatchData(prevState => ({...prevState, history: [match]}))
                }
            } catch (e) {
                setMatchData(prevState => ({...prevState, history: [match]}))
            }
        }
        if (match) {
            const {home_team_id, away_team_id} = match
            let data = {home_team_id, away_team_id}
            data && getMatchHistory(data)
        }
    }, [match])

    if (!match)
        return <MainLayout title={"Не найдено"}>
            <div className="title__wrapper">
                <h1 className="main">Матч не найден</h1>
            </div>
        </MainLayout>

    let side = getTeamSide(player?.team_id, match).side
    let teamScore = match[`${side}_team_score`]
    return <div className="match__wrapper">
        <div className="team__info match__info">
            <div>
                <div className="team__logo">
                    <ImgWrapper src={matchData?.competition?.logo} defaultSrc="/img/soccer-ball.png" alt="soccer-ball"/>
                </div>
            </div>
            <div style={{width: "100%"}}>
                <div className={"flex"}>
                    <div className="title__wrapper">
                        <h1 className="secondary">{matchData?.competition?.title || "Регулярный матч"}</h1>
                    </div>
                    {!teamScore && <Link href={`/matches/${match.id}/results-edit`}>
                        <a>
                            <Button>Внести результаты</Button>
                        </a>
                    </Link>}
                </div>
                <div className="team__info__list">
                    <div>
                        <span className="team__info__title">Стадион</span>
                        <span
                            className="bold">{matchData?.stadium?.name || capitalizeFirstLetter(matchData?.stadium_other)}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="row block__margin match__row">
            <div className="team__content match__content col-md-8">
                <div className="match__result__wrapper">
                    <div
                        className="match__date center">{matchData?.date && getMatchDate(matchData?.date)}</div>
                    <div
                        className="match__point center">{matchData?.competitionRound && `${matchData.competitionRound} тур`}</div>
                    {matchData?.status && <div className="bold center">{capitalizeFirstLetter(matchData?.status.title)}</div>}
                    <div className="match__teams">
                        <div className="match__team home">
                            <ImgWrapper defaultSrc="/img/default-logo.png" src={matchData?.home_team?.logo} className="match__team__logo" alt="logo"/>
                            <p className="match__team__name">{matchData?.home_team?.name}</p>
                            <p className="match__team__city">{matchData?.home_team?.city?.name}</p>
                        </div>
                        <div className="match__teams__score">
                            <p className={"bold"}>{matchData?.home_team_score !== null ? matchData?.home_team_score : "-"} : {matchData?.away_team_score !== null ? matchData?.away_team_score : "-"}</p>
                            {matchData?.penalty_series && <p className={"penalty"}>{`(по пен. ${matchData?.home_penalty_score || 0}:${matchData?.away_penalty_score || 0})`}</p>}
                        </div>
                        <div className="match__team away">
                            <ImgWrapper defaultSrc="/img/default-logo.png" src={matchData?.away_team?.logo} className="match__team__logo" alt="logo"/>
                            <p className="match__team__name">{matchData?.away_team?.name}</p>
                            <p className="match__team__city">{matchData?.away_team?.city?.name}</p>
                        </div>
                    </div>
                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Обзор матча" key="1">
                        <MatchReview matchData={matchData} players={players}/>
                    </TabPane>
                    <TabPane tab="Составы" key="2">
                        <MatchLineup home_team_id={matchData?.home_team_id} away_team_id={matchData?.away_team_id}
                                     players={players}/>
                    </TabPane>
                </Tabs>
            </div>
            <MatchesHistory matchData={matchData}/>
        </div>
    </div>
}
