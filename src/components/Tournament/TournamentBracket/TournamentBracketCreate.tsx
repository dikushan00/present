import React, {useEffect, useState} from 'react';
import {getMatchDate} from "../../../utils/getMatchDate";
import {CompetitionData, Match} from "../../../../types/match";
import Link from "next/link"
import styles from "./TournamentBracket.module.css"
import {Button, Select} from "antd";
import {TeamType} from "../../../../types/teams";
import {MatchesPlayoffEnum} from "../../../../types/enums";
import {useNotification} from "../../../utils/hooks/useNotification";
import {useHttp} from "../../../utils/hooks/http.hook";

type Props = {
    data: CompetitionData
    teams?: TeamType[]
}
export const TournamentBracketCreate: React.FC<Props> = ({data, teams}) => {

    const {setErrorNotification, setSucceedNotification} = useNotification()
    const [teamsState, setTeamsState] = useState(null)
    const {request, loading, error} = useHttp()

    useEffect(() => {
        if(teams && !teamsState)
            setTeamsState(teams)

    }, [teams, teamsState])

    useEffect(() => {
        if(error)
            setErrorNotification(error)
    }, [error])

    const onSelectChange = (id: number, index: number, position: number) => {
        setTeamsState(prev => prev.map(item => {
            if(item.id === id)
                return {...item, disabled: true, index, position}
            else if(item?.index === index && item?.position === position)
                return {...item, disabled: false, index: null, position: null}
            return item
        }))
    }

    let selectRoundCode = MatchesPlayoffEnum.E
    if(data?.max_teams_count === 32)
        selectRoundCode = MatchesPlayoffEnum.SX
    else if(data?.max_teams_count === 64)
        selectRoundCode = MatchesPlayoffEnum.TT

    const onSubmit = async () => {
        let selected = teamsState?.filter(i => i?.index >= 0)
        if(data?.max_teams_count && selected?.length < data?.max_teams_count - 6)
            return setErrorNotification("Недостаточно выбранных команд")

        let matches = []
        for(let i = 0; i < data?.max_teams_count / 2; i++) {
            let matchTeams = teamsState?.filter(item => item.index === i)
            if(matchTeams?.length === 2) {
                let homeTeam = matchTeams.find(match => match.position === 1)
                let awayTeam = matchTeams.find(match => match.position === 2)
                matches.push({
                    home_team_id: homeTeam.id,
                    away_team_id: awayTeam.id,
                    index: i + 1
                })
            }else
                matches.push({
                    home_team_id: 0,
                    away_team_id: 0,
                    index: i + 1
                })
        }
        let body = {
            competition_id: data.id,
            matches
        }
        try {
            let res = await request("competitions/matches-grid", "post", body)
            if(res) {
                setTeamsState([])
                setSucceedNotification("Сетка команд построена!")
            }
        } catch (e) {}
    }

    return (
        <div>
            <div className="flex">
                <h2>Турнирная сетка</h2>
                <Button onClick={onSubmit} disabled={loading} type ={"primary"}>Сохранить</Button>
            </div>
            <section className={styles.bracket}>
                <div className={`${styles.container} container`}>
                    <div className={`${styles.split} ${styles.split_one}`}>
                        {data.matchesSort?.sixteenth &&
                        <div className={`${styles.round} ${styles.round_one} ${styles.current}`}>
                            <div className={`${styles.round_details}`}>1/16<br/><span className={styles.date}/></div>
                            {
                                data.matchesSort?.sixteenth.map((item, i) => {
                                    return i < 8 &&
                                        <TournamentGridMatchScore index={i} isSelectMode = {selectRoundCode === MatchesPlayoffEnum.SX} onSelectChange={onSelectChange} teams={teamsState} key={item?.id || i} match={item}/>
                                })}
                        </div>}

                        {
                            data.matchesSort?.eighth &&
                            <div className={`${styles.round} ${styles.round_two} ${styles.current}`}>
                                <div className={`${styles.round_details}`}>1/8<br/><span className={styles.date}/></div>
                                {
                                    data.matchesSort?.eighth.map((item, i) => {
                                        return i < 4 &&
                                            <TournamentGridMatchScore index={i} isSelectMode = {selectRoundCode === MatchesPlayoffEnum.E} onSelectChange={onSelectChange} teams={teamsState} key={item?.id || i} match={item}/>
                                    })}
                            </div>
                        }
                        {
                            data.matchesSort?.quarter &&
                            <div className={`${styles.round} ${styles.round_three} ${styles.current}`}>
                                <div className={`${styles.round_details}`}>1/4<br/><span className={styles.date}/></div>
                                {
                                    data.matchesSort?.quarter.map((item, i) => {
                                        return i < 2 &&
                                            <TournamentGridMatchScore index={i} isSelectMode = {selectRoundCode === MatchesPlayoffEnum.Q} onSelectChange={onSelectChange} teams={teamsState} key={item?.id || i} match={item}/>
                                    })}
                            </div>
                        }
                    </div>
                    <div className={`${styles.champion}`}>
                        <div className={`${styles.semis_l} ${styles.current}`}>
                            <div className={`${styles.round_details}`}>Полуфинал <br/>
                                <span className={styles.date}/></div>
                            {
                                data.matchesSort?.semi &&
                                <TournamentGridMatchScore isSelectMode = {false} onSelectChange={onSelectChange} teams={teamsState} key={data.matchesSort?.semi[0]?.id}
                                                          match={data.matchesSort?.semi[0]} championship/>
                            }
                        </div>
                        <div className={`${styles.final} ${styles.current}`}>
                            <i className="fa fa-trophy"/>
                            <div className={`${styles.round_details}`}>Турнир <br/>
                                <span
                                    className={styles.date}>{getMatchDate(data.date, false, true)}{data.finish_date ? " - " + getMatchDate(data.finish_date, false, true) : ""}</span>
                            </div>
                            <TournamentGridMatchScore isSelectMode = {false} onSelectChange={onSelectChange} teams={teamsState} key={data.matchesSort?.final?.id}
                                                      match={data.matchesSort?.final} championship/>
                        </div>
                        <div className={`${styles.semis_r} ${styles.current}`}>
                            <div className={`${styles.round_details}`}>Полуфинал <br/>
                                <span className={styles.date}/></div>
                            {
                                data.matchesSort?.semi &&
                                <TournamentGridMatchScore isSelectMode = {false} onSelectChange={onSelectChange} teams={teamsState} key={data.matchesSort?.semi[1]?.id}
                                                          match={data.matchesSort?.semi[1]} championship/>
                            }
                        </div>
                    </div>


                    <div className={`${styles.split} ${styles.split_two}`}>
                        {
                            data.matchesSort?.quarter &&
                            <div className={`${styles.round} ${styles.round_three} ${styles.current}`}>
                                <div className={`${styles.round_details}`}>1/4<br/><span className={styles.date}/></div>
                                {
                                    data.matchesSort?.quarter.map((item, i) => {
                                        return i > 1 &&
                                            <TournamentGridMatchScore index={i} isSelectMode = {selectRoundCode === MatchesPlayoffEnum.Q} onSelectChange={onSelectChange} teams={teamsState} key={item?.id || i} match={item}/>
                                    })}
                            </div>
                        }

                        {
                            data.matchesSort?.eighth &&
                            <div className={`${styles.round} ${styles.round_two} ${styles.current}`}>
                                <div className={`${styles.round_details}`}>1/8<br/><span className={styles.date}/></div>
                                {
                                    data.matchesSort?.eighth.map((item, i) => {
                                        return i > 3 &&
                                            <TournamentGridMatchScore index={i} isSelectMode = {selectRoundCode === MatchesPlayoffEnum.E} onSelectChange={onSelectChange} teams={teamsState} key={item?.id || i} match={item}/>
                                    })}
                            </div>
                        }
                        {data.matchesSort?.sixteenth &&
                        <div className={`${styles.round} ${styles.round_one} ${styles.current}`}>
                            <div className={`${styles.round_details}`}>1/16<br/><span className={styles.date}/></div>
                            {
                                data.matchesSort?.sixteenth.map((item, i) => {
                                    return i > 7 &&
                                        <TournamentGridMatchScore index={i} isSelectMode = {selectRoundCode === MatchesPlayoffEnum.SX} onSelectChange={onSelectChange} teams={teamsState} key={item?.id || i} match={item}/>
                                })}
                        </div>
                        }
                    </div>
                </div>
            </section>
        </div>
    );
};

type PropsMatch = {
    championship?: boolean,
    teams?: TeamType[],
    match: Match
    isSelectMode?: boolean
    index?: number
    onSelectChange?: (e: any, index: number, position: number) => void
}
const TournamentGridMatchScore: React.FC<PropsMatch> = ({championship, match, teams, onSelectChange, index,isSelectMode}) => {

    return <ul className={`${styles.matchup} ${championship ? styles.championship : ""}`}>
        <li className={`${styles.team} ${styles.team_top} ${match?.home_team_id === match?.win_team_id ? "bold" : ""}`}>
            {
                match
                    ? <>
                        <Link href={`/teams/${match?.home_team_id}`}><a>{match?.home_team?.name || ""}</a></Link>
                        <span className={`${styles.score}`}>{match?.home_team_id ? match?.home_team_score_value || "-" : ""}</span>
                    </>
                    : isSelectMode && <>
                        <TournamentTeamsSelect onSelectChange = {(i) => onSelectChange(i, index, 1)} teams={teams}/>
                    </>
            }
        </li>
        <li className={`${styles.team} ${styles.team_bottom} ${match?.away_team_id === match?.win_team_id ? "bold" : ""}`}>
            {
                match
                    ? <>
                        <Link href={`/teams/${match?.away_team_id}`}><a>{match?.away_team?.name || ""}</a></Link>
                        <span className={`${styles.score}`}>{match?.away_team_id ? match?.away_team_score_value || "-" : ""}</span>
                    </>
                    : isSelectMode && <>
                        <TournamentTeamsSelect onSelectChange = {(i) => onSelectChange(i, index, 2)} teams={teams}/>
                    </>
            }
        </li>
    </ul>
}

const TournamentTeamsSelect = ({teams, onSelectChange}) => {
    return <Select style={{minWidth: "100%"}} onChange={onSelectChange} options={teams}/>
}
