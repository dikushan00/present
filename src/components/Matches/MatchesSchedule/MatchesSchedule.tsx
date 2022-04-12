import {Match} from "../../../../types/match";
import React, {useEffect, useState} from "react";
import {getMatchDate} from "../../../utils/getMatchDate";
import styles from "./MatchesSchedule.module.sass"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faEdit, faFutbol, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Button, DatePicker} from "antd";
import moment from "moment";
import {useHttp} from "../../../utils/hooks/http.hook";
import {makeValidDate} from "../../../utils/makeValidDate";
import {useNotification} from "../../../utils/hooks/useNotification";
import Link from "next/link"

export type MatchesScheduleData = {
    round: { name: string }
    matches: Match[]
}
type MatchesScheduleProps = {
    data: MatchesScheduleData[]
    admin?: boolean
}
export const MatchesSchedule: React.FC<MatchesScheduleProps> = ({data, admin}) => {

    if (!data)
        return <div/>
    return <div>
        {
            data?.map((item, i) => {
                return <div key={i}>
                    <div className={styles.schedule__header}>Стадия {item.round?.name}</div>
                    {
                        item.matches?.map((match, idx) => {
                            return <MatchScheduleItem key={match?.id || idx} admin={admin} match={match}/>
                        })
                    }
                </div>
            })
        }
    </div>
}

type Props = {
    match: Match
    admin?: boolean
}
const MatchScheduleItem: React.FC<Props> = ({match, admin}) => {
    const {setErrorNotification, setSucceedNotification} = useNotification()
    const {request, error, loading} = useHttp()
    const [isEditMode, setEditMode] = useState(false)
    const [value, setValue] = useState(false)
    const [date, setDate] = useState(match?.date)

    const onSubmit = async () => {
        if (!value)
            return toggleEditMode()
        let date = makeValidDate(value["_d"])

        try {
            let res = await request<Match>(`matches/update/${match.id}`, "patch", {date})
            if (res) {
                res?.date && setDate(res?.date)
                toggleEditMode()
                setSucceedNotification("Успешно")
            }
        } catch (e) {
        }
    }

    useEffect(() => {
        if (error)
            setErrorNotification(error)
    }, [error]);

    const toggleEditMode = async () => setEditMode(prev => !prev)

    const dateFormat = 'DD.MM.YYYY,HH:mm';

    function disabledDate(current) {
        if (!current)
            return false
        let currentTime = new Date(current["_d"]).getTime() + 86400000
        let date = new Date(moment().endOf('day')["_d"]).getTime()
        return current && currentTime < date;
    }

    const onDateChange = (date) => {
        setValue(date)
    }

    if (!match)
        return <div/>
    return <div key={match?.id} className={styles.schedule__match__wrapper}>
        <div className={styles.schedule__match__date}>
            {(isEditMode && admin) ?
                <DatePicker showTime format={dateFormat} disabledDate={disabledDate} defaultValue={moment(date)}
                            onChange={onDateChange}/> : getMatchDate(date, true, false, false)}
        </div>
        <div key={match.id} className={styles.schedule__match__teams}>
            <div className={"flex"}>
                <span
                    className={`${styles.schedule__match__team} ${match.home_team_id === match?.win_team_id ? styles.schedule__match__scoreMain : ""}`}>{match?.home_team?.name || match?.homePrevMatch}</span>
                <div className={styles.schedule__match__score}>
                    <span className={styles.schedule__match__scoreMain}>{match.home_team_score}</span>
                    <span className={"gray"}>{match?.home_penalty_score ? `(${match?.home_penalty_score})` : ""}</span>
                </div>
            </div>
            <div className={"flex"}>
                <span
                    className={`${styles.schedule__match__team} ${match.away_team_id === match?.win_team_id ? styles.schedule__match__scoreMain : ""}`}>{match.away_team?.name || match?.awayPrevMatch}</span>
                <div className={styles.schedule__match__score}>
                    <span className={styles.schedule__match__scoreMain}>{match.away_team_score}</span>
                    <span className={"gray"}>{match?.away_penalty_score ? `(${match?.away_penalty_score})` : ""}</span>
                </div>
            </div>
        </div>
        {admin && <div style={{marginLeft: "7px"}}>
            {
                isEditMode ?
                    <div className="flex"><Button onClick={toggleEditMode} style={{marginRight: "5px"}} size={"small"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </Button>
                        <Button onClick={onSubmit} type={"primary"} size={"small"}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </Button></div> : <div className="flex">
                        <Button onClick={toggleEditMode} style={{marginRight: "5px"}} type={"primary"} size={"small"}>
                            <FontAwesomeIcon icon={faEdit}/>
                        </Button>
                        <Link href={`/admin/matches/${match?.id}`}><a><Button type={"primary"} size={"small"}><FontAwesomeIcon icon={faFutbol}/></Button></a></Link>
                    </div>
            }
        </div>}
    </div>
}