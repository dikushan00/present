import React from 'react';
import {getMatchDate} from "../../../utils/getMatchDate";
import {CompetitionData, Match} from "../../../../types/match";
import Link from "next/link"
import styles from "./TournamentBracket.module.css"

type Props = {
    data: CompetitionData
}
const TournamentBracket: React.FC<Props> = ({data}) => {
    if (!data?.matchesSort)
        return <div/>
    return (
        <div>
            <h2>Турнирная сетка</h2>
            <section className={styles.bracket}>
                <div className={`${styles.container} container`}>
                    <div className={`${styles.split} ${styles.split_one}`}>
                        {data.matchesSort?.sixteenth &&
                        <div className={`${styles.round} ${styles.round_one} ${styles.current}`}>
                            <div className={`${styles.round_details}`}>1/16<br/><span className={styles.date}/></div>
                            {
                                data.matchesSort?.sixteenth.map((item, i) => {
                                    return i < 8 && <TournamentGridMatchScore key={item?.id}  match={item}/>
                                })}
                        </div>}

                        {
                            data.matchesSort?.eighth &&
                            <div className={`${styles.round} ${styles.round_two} ${styles.current}`}>
                                <div className={`${styles.round_details}`}>1/8<br/><span className={styles.date}/></div>
                                {
                                    data.matchesSort?.eighth.map((item, i) => {
                                        return i < 4 && <TournamentGridMatchScore key={item?.id}  match={item}/>
                                    })}
                            </div>
                        }
                        {
                            data.matchesSort?.quarter &&
                            <div className={`${styles.round} ${styles.round_three} ${styles.current}`}>
                                <div className={`${styles.round_details}`}>1/4<br/><span className={styles.date}/></div>
                                {
                                    data.matchesSort?.quarter.map((item, i) => {
                                        return i < 2 && <TournamentGridMatchScore key={item?.id}  match={item}/>
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
                                <TournamentGridMatchScore key={data.matchesSort?.semi[0]?.id}  match={data.matchesSort?.semi[0]} championship/>
                            }
                        </div>
                        <div className={`${styles.final} ${styles.current}`}>
                            <i className="fa fa-trophy"/>
                            <div className={`${styles.round_details}`}>Турнир <br/>
                                <span
                                    className={styles.date}>{getMatchDate(data.date, false, true)}{data.finish_date ? " - " + getMatchDate(data.finish_date, false, true) : ""}</span>
                            </div>
                            {
                                data.matchesSort?.final &&
                                <TournamentGridMatchScore key={data.matchesSort?.final?.id}  match={data.matchesSort?.final} championship/>
                            }
                        </div>
                        <div className={`${styles.semis_r} ${styles.current}`}>
                            <div className={`${styles.round_details}`}>Полуфинал <br/>
                                <span className={styles.date}/></div>
                            {
                                data.matchesSort?.semi &&
                                <TournamentGridMatchScore key={data.matchesSort?.semi[1]?.id}  match={data.matchesSort?.semi[1]} championship/>
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
                                        return i > 1 && <TournamentGridMatchScore key={item?.id}  match={item}/>
                                    })}
                            </div>
                        }

                        {
                            data.matchesSort?.eighth &&
                            <div className={`${styles.round} ${styles.round_two} ${styles.current}`}>
                                <div className={`${styles.round_details}`}>1/8<br/><span className={styles.date}/></div>
                                {
                                    data.matchesSort?.eighth.map((item, i) => {
                                        return i > 3 && <TournamentGridMatchScore key={item?.id}  match={item}/>
                                    })}
                            </div>
                        }
                        {data.matchesSort?.sixteenth &&
                        <div className={`${styles.round} ${styles.round_one} ${styles.current}`}>
                            <div className={`${styles.round_details}`}>1/16<br/><span className={styles.date}/></div>
                            {
                                data.matchesSort?.sixteenth.map((item, i) => {
                                    return i > 7 && <TournamentGridMatchScore key={item?.id}  match={item}/>
                                })}
                        </div>}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TournamentBracket;

type PropsMatch = {
    championship?: boolean,
    match: Match
}
const TournamentGridMatchScore: React.FC<PropsMatch> = ({championship, match}) => match ?
    <ul className={`${styles.matchup} ${championship ? styles.championship : ""}`}>
        <li className={`${styles.team} ${styles.team_top} ${match.home_team_id === match?.win_team_id ? "bold" : ""}`}>{
            <Link href={`/teams/${match?.home_team_id}`}><a>{match?.home_team?.name || ""}</a></Link>}
            <span className={`${styles.score}`}>{match?.home_team_id ? match?.home_team_score_value || "-" : ""}</span>
        </li>
        <li className={`${styles.team} ${styles.team_bottom} ${match.away_team_id === match?.win_team_id ? "bold" : ""}`}>{
            <Link href={`/teams/${match?.away_team_id}`}><a>{match?.away_team?.name || ""}</a></Link>}<span
            className={`${styles.score}`}>{match?.away_team_id ? match?.away_team_score_value || "-" : ""}</span></li>
    </ul> : <ul><li></li><li></li></ul>
