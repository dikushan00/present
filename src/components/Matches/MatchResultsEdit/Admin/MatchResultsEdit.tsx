import React, {ChangeEvent} from 'react';
import {getMatchDate} from "../../../../utils/getMatchDate";
import {ImgWrapper} from "../../../ImgWrapper";
import {cutWord} from "../../../../utils/cutWord";
import {MatchReview} from "../../MatchReview";
import {Button, Checkbox, InputNumber, Popconfirm, Select} from "antd";
import {Match, MatchData} from "../../../../../types/match";
import {useNotification} from "../../../../utils/hooks/useNotification";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../../../../utils/hooks/http.hook";
import {AppStateType} from "../../../../redux/store_redux";
import {getMatchEventsMetrics} from "../../../../redux/match_reducer";
import Link from "next/link";
import {TableLink} from "../../../styled/main/components";
import {Loader} from "../../../blocks/Loader";
import {PlayerOptionType, PlayerInfoType} from "../../../../../types/player";
import styles from "./MatchResultsEdit.module.sass"
import CustomTable from "../../../CustomTable";
import {TeamAPI} from "../../../../api/TeamAPI";
import {Controller, useForm} from "react-hook-form";
import {TeamType} from "../../../../../types/teams";
import {sortMatchEvents} from "../../../../utils/sortMatchEvents";

type Props = {
    match: Match | null
}
export const MatchResultsEdit: React.FC<Props> = ({match}) => {
    const {setDefaultNotification, setErrorNotification, setSucceedNotification} = useNotification()
    const dispatch = useDispatch()
    const {request, error, loading} = useHttp()
    const {handleSubmit, control} = useForm()
    const {player, isFetching} = useSelector((state: AppStateType) => state.profile)
    const {eventMetrics} = useSelector((state: AppStateType) => state.match)
    const [isCollapsed, setIsCollapsed] = React.useState(true)
    const [isDisabled,] = React.useState(false)
    const [score, setScore] = React.useState<{ home: number, away: number }>({home: 0, away: 0})
    const [players, setPlayers] = React.useState<{ home: PlayerOptionType[], away: PlayerOptionType[] } | null>(null)
    const [playersData, setPlayersData] = React.useState<PlayerOptionType[] | null>(null)
    const [matchTeams, setMatchTeams] = React.useState<TeamType[] | null>(null)
    const [matchData, setMatchData] = React.useState<MatchData | null>(null)
    const [activeTeamSide, setActiveTeamSide] = React.useState<"home" | "away">("home")
    const [activePlayerValue, setActivePlayerValue] = React.useState(null)

    React.useEffect(() => {
        if (match) {
            if (match?.home_team && match?.away_team)
                setMatchTeams([{...match?.home_team, value: match?.home_team.id, label: match?.home_team.name},
                    {...match?.away_team, value: match?.away_team.id, label: match?.away_team.name}])
            let {matchEvents} = match
            if (matchEvents) {
                matchEvents = sortMatchEvents(matchEvents, match)
            }
            setMatchData({...match, matchEvents})
        }
    }, [match])

    React.useEffect(() => {
        const getMatchPlayers = async () => {
            try {
                if (!match?.home_team_id || !match?.away_team_id)
                    return
                let response = await TeamAPI.getTeamGroupPlayers({
                    teams: [match?.home_team_id, match?.away_team_id]
                })
                let mapPlayerArr = (item: PlayerInfoType) => ({
                    ...item,
                    index: item.id,
                    key: item.id,
                    value: item.id,
                    goalsCount: [],
                    inGame: true,
                    disabled: false,
                    label: item.user.last_name + " " + item.user.first_name,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name
                })

                if (response && !!response.length) {
                    let home = response[0][match?.home_team_id].map(item => mapPlayerArr(item))
                    let away = response[1][match?.away_team_id].map(item => mapPlayerArr(item))
                    setPlayersData([...home, ...away])
                    setPlayers({home, away})
                }
            } catch (e) {
            }
        }
        getMatchPlayers()
    }, [match])

    React.useEffect(() => {
        if (match && player) {
            let currentDate = new Date().getTime()
            let matchDate = new Date(match.date).getTime()
            setScore({home: match.home_team_score || 0, away: match.away_team_score || 0})
            if (currentDate < matchDate) {
                // setIsDisabled(true)
                setDefaultNotification("Матч еще не начался!", {duration: 0})
            }
        }
    }, [match, player])

    React.useEffect(() => {
        dispatch(getMatchEventsMetrics())
    }, [])

    const changePlayersStatus = (id, team_id: number) => {
        let side = null
        if (team_id === match?.home_team_id)
            side = "home"
        if (team_id === match?.away_team_id)
            side = "away"
        setPlayers(prevState => ({
            ...prevState, [side]: prevState[side].map(item => {
                if (item.id === id)
                    return {...item, inGame: !item.inGame, disabled: !item?.disabled}
                return item
            })
        }))
    }

    const columns = [
        {
            title: '',
            width: 40,
            key: 'participation',
            render: (player) => {
                return <Checkbox checked={player.inGame}
                                 onChange={() => changePlayersStatus(player?.id, player?.team_id)}/>
            },
            fixed: "left" as "left"
        },
        {
            title: 'Игрок',
            key: 'name',
            render: (row) => {
                return <div className="flex">
                    <Link
                        href={`/players/${row.id}`}><a><TableLink>{(row.last_name || "") + " " + (row.first_name || "")}</TableLink></a></Link>
                </div>
            },
        },
    ]

    const toggleCollapse = () =>
        setIsCollapsed(prevState => !prevState)

    const onControllerSubmit = async (data) => {

        let event = eventMetrics?.find(item => item.id === data.event_id)
        if (!event)
            return
        let matchEvents = [...matchData.matchEvents, {...data, event_name: event.name}]
        matchEvents = sortMatchEvents(matchEvents, matchData)
        if (matchEvents?.length) {
            let score = matchEvents[matchEvents.length - 1].matchScore
            setScore(score)
        }
        setMatchData(prev => ({...prev, matchEvents}))
    }
    const onSubmit = async () => {
        let events = matchData.matchEvents
        let homeTeamLineup = players.home.filter(item => item.inGame).map(item => ({
            player_id: item.id, team_id: item.team_id
        }))
        let awayTeamLineup = players.away.filter(item => item.inGame).map(item => ({
            player_id: item.id, team_id: item.team_id
        }))
        let lineups = [...homeTeamLineup, ...awayTeamLineup]

        let body = {
            match_id: match.id,
            away_team_score: score.away,
            home_team_score: score.home,
            penalty_series: false,
            away_penalty_score: 0,
            home_penalty_score: 0,
            events,
            lineups
        }
        if(matchData?.penalty_series) {
            body.penalty_series = true
            body.away_penalty_score = matchData?.away_penalty_score
            body.home_penalty_score = matchData?.home_penalty_score
        }
        try {
            let response = await request<{ status: boolean }>("competitions/match-score", "post", body)
            if (response && response?.status) {
                setSucceedNotification("Изменения внесены!")
            }
        } catch (e) {
        }
    }

    React.useEffect(() => {
        if (error)
            setErrorNotification(error)
    }, [error])

    const changeActiveTeamSide = (id: number) => {
        let side
        if (match?.home_team_id === id)
            side = "home"
        else
            side = "away"
        side && setActiveTeamSide(side)
        setActivePlayerValue("-")
    }
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, side: "home" | "away") => {
        let value = Number(e.target.value)
        if (!isNaN(value)) {
            setScore(prevState => ({...prevState, [side]: value}))
        }
    }

    const togglePenalty = () => setMatchData(prev => ({...prev, penalty_series: !prev?.penalty_series}))

    const onChangePenalty = (value: number, side: "home" | "away") => {
        setMatchData(prev => ({...prev, [`${side}_penalty_score`]: value}))
    }

    if (isFetching)
        return <Loader/>

    return <div className="block__wrapper">
        <h1 className="title secondary match__results__title">Результаты матча</h1>
        <div className="match__results__wrapper">
            <div className="match__results__content col-md-12">
                <div className="match__date center">{match?.date && getMatchDate(match?.date)}</div>
                <div className="match__results__head">
                    <div className="match__results__team">
                        <div className="team__logo__wrapper">
                            <ImgWrapper className="team__logo" defaultSrc={"/img/default-logo.png"}
                                        src={match.home_team?.logo}
                                        alt="logo"/>
                        </div>
                        <p className="team__name">{cutWord(match?.home_team?.name)}</p>
                    </div>
                    <div className="match__results__team">
                        <div className="team__logo__wrapper">
                            <ImgWrapper className="team__logo" defaultSrc={"/img/default-logo.png"}
                                        src={match.away_team.logo}
                                        alt="logo"/>
                        </div>
                        <p className="team__name">{cutWord(match?.away_team?.name)}</p>
                    </div>
                </div>
                <div className="match__results__stat">
                    <h2>Счет</h2>
                    <div className="match__results__score">
                        <div>
                            <input onChange={(e) => handleInputChange(e, "home")}
                                   disabled value={score.home}
                                   type="number" defaultValue={score.home}
                                   maxLength={2} max={99} min={0}
                                   className="match__results__score__input"/>
                        </div>
                        <div>
                            <input onChange={(e) => handleInputChange(e, "away")}
                                   disabled value={score.away}
                                   type="number" defaultValue={score.away}
                                   maxLength={2} max="99" min={0}
                                   className="match__results__score__input"/>
                        </div>
                    </div>
                    <div className="match__results__events">
                        <div>
                            <h2 className={"margin"}>Добавить событие</h2>
                        </div>
                        <div>
                            <form className={styles.match__resultsController}
                                  onSubmit={handleSubmit(onControllerSubmit)}>
                                <div className={styles.match__resultsControllerItem}>
                                    <p>Команда</p>
                                    <Controller
                                        name="team_id"
                                        control={control}
                                        render={({field: {onChange, value}}) =>
                                            <Select style={{minWidth: "100px"}} options={matchTeams || []}
                                                    onChange={(id) => {
                                                        changeActiveTeamSide(id)
                                                        onChange(id)
                                                    }}
                                                    value={value}/>}
                                        defaultValue={match?.home_team_id || 1}
                                        rules={{required: true}}
                                    />
                                </div>
                                <div className={styles.match__resultsControllerItem}>
                                    <p>Игрок</p>
                                    <Controller
                                        name="player_id"
                                        control={control}
                                        render={({field: {onChange, value}}) =>
                                            <Select style={{minWidth: "150px"}}
                                                    options={players ? players[activeTeamSide] : []}
                                                    onChange={(id) => {
                                                        setActivePlayerValue(null)
                                                        onChange(id)
                                                    }}
                                                    value={activePlayerValue || value}/>}
                                        defaultValue={"-"}
                                        rules={{required: true}}
                                    />
                                </div>
                                <div className={styles.match__resultsControllerItem}>
                                    <p>Действие</p>
                                    <Controller
                                        name="event_id"
                                        control={control}
                                        render={({field: {onChange, value}}) =>
                                            <Select style={{minWidth: "100px"}} options={eventMetrics}
                                                    onChange={onChange}
                                                    value={value}/>}
                                        defaultValue={1}
                                        rules={{required: true}}
                                    />
                                </div>
                                <div className={styles.match__resultsControllerItem}>
                                    <p>Минута</p>
                                    <Controller
                                        name={"minute"}
                                        control={control}
                                        render={({field: {onChange, value}}) => <InputNumber
                                            onChange={onChange} value={value}
                                            placeholder="Минута" max={120} min={0}/>}
                                        defaultValue={""}
                                        rules={{required: true}}
                                    />
                                </div>
                                <Button className={styles.match__resultsControllerItem} type={"primary"}
                                        htmlType={"submit"}>Добавить</Button>
                            </form>
                        </div>

                        <div>
                            <div className="flex normal">
                                <h2 className={"margin"}>Пенальти</h2>
                                <Checkbox className={styles.penalty__check} checked={matchData?.penalty_series}
                                          onChange={togglePenalty}/>
                            </div>
                            {matchData?.penalty_series && <div className={styles.match__resultsController}>
                                <div className={styles.match__resultsControllerItem}>
                                    <p>{matchData?.home_team?.name || ""}</p>
                                    <InputNumber
                                        onChange={(value) => onChangePenalty(value, "home")}
                                        value={matchData?.home_penalty_score || 0}
                                        placeholder={matchData?.home_team?.name || ""} max={30} min={0}/>
                                </div>
                                <div className={styles.match__resultsControllerItem}>
                                    <p>{matchData?.away_team?.name || ""}</p>
                                    <InputNumber
                                        onChange={(value) => onChangePenalty(value, "away")}
                                        value={matchData?.away_penalty_score || 0}
                                        placeholder={matchData?.away_team?.name || ""} max={30} min={0}/>
                                </div>
                            </div>}
                        </div>
                    </div>

                    <MatchReview matchData={matchData} players={playersData}/>

                    <div className="match__results__events">
                        <div className="match__results__collapse" onClick={toggleCollapse}>
                            Участие
                            <i className="fas fa-chevron-down" aria-hidden/>
                        </div>
                        <div className={`match__results__events__items ${isCollapsed ? "collapsed" : ""}`}>
                            <h2>{matchData?.home_team?.name}</h2>
                            <CustomTable scroll={{x: 430}} dataSource={players?.home} columns={columns}/>
                        </div>
                        <div className={`match__results__events__items ${isCollapsed ? "collapsed" : ""}`}>
                            <h2>{matchData?.away_team?.name}</h2>
                            <CustomTable scroll={{x: 430}} dataSource={players?.away} columns={columns}/>
                        </div>
                    </div>
                </div>
                <Popconfirm
                    title="Вы действительно хотите сохранить результат?"
                    onConfirm={onSubmit}
                    okText="Да"
                    cancelText="Отмена"
                    disabled={isDisabled || loading}
                >
                    <Button disabled={isDisabled || loading} type="primary" className="btn">Отправить</Button>
                </Popconfirm>
            </div>
        </div>
    </div>
}
