import React, {ChangeEvent} from 'react';
import {getMatchDate} from "../../../utils/getMatchDate";
import {ImgWrapper} from "../../ImgWrapper";
import {cutWord} from "../../../utils/cutWord";
import CustomTable from "../../CustomTable";
import {Button, Checkbox, Popconfirm} from "antd";
import {Match} from "../../../../types/match";
import {useNotification} from "../../../utils/hooks/useNotification";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {useHttp} from "../../../utils/hooks/http.hook";
import {AppStateType} from "../../../redux/store_redux";
import {getTeamSide} from "../../../utils/getTeamSide";
import {TeamAPI} from "../../../api/TeamAPI";
import {getMatchEventsMetrics} from "../../../redux/match_reducer";
import Link from "next/link";
import {TableLink} from "../../styled/main/components";
import {Loader} from "../../blocks/Loader";
import {Page403} from "../../ErrorPage/Page403";
import {PlayerDataType} from "../../../../types/player";

type Props = {
    match: Match | null
}
export const MatchResultsEdit:React.FC<Props> = ({match}) => {
    const {setDefaultNotification, setErrorNotification} = useNotification()
    const dispatch = useDispatch()
    const router = useRouter()
    const {request, error, loading} = useHttp()
    const {player, isFetching} = useSelector((state: AppStateType) => state.profile)
    const {eventMetrics} = useSelector((state: AppStateType) => state.match)
    const [isCollapsed, setIsCollapsed] = React.useState(true)
    const [isDisabled, setIsDisabled] = React.useState(false)
    const [players, setPlayers] = React.useState<PlayerDataType[]>([])
    const [score, setScore] = React.useState<{ home: number, away: number, side?: "home" | "away" }>({home: 0, away: 0})

    React.useEffect(() => {
        if (match && player) {
            let currentDate = new Date().getTime()
            let matchDate = new Date(match.date).getTime()
            let {side} = getTeamSide(player?.team_id, match)
            setScore({home: match.home_team_score || 0, away: match.away_team_score || 0, side})
            if (!match.accepted) {
                setIsDisabled(true)
                setDefaultNotification("Вы не можете ввести результаты, соперник еще не согласовал матч!", {duration: 0})
            } else if (match[`${side}_team_score`] !== null) {
                setIsDisabled(true)
                setDefaultNotification("Вы уже ввели результаты матча!", {duration: 0})
            } else if (currentDate < matchDate) {
                setIsDisabled(true)
                setDefaultNotification("Матч еще не начался!", {duration: 0})
            }
        }
    }, [match, player])

    React.useEffect(() => {
        const getTeamPlayers = async (id: number) => {
            try {
                let response = id && await TeamAPI.getTeamPlayers(id)
                if (response && !!response.length) {
                    let players = response.map(item => ({
                        ...item,
                        index: item.id,
                        key: item.id,
                        goalsCount: [],
                        inGame: true,
                        first_name: item.user.first_name,
                        last_name: item.user.last_name
                    }))
                    players && setPlayers(players)
                }
            } catch (e) {
            }
        }
        if (player && player?.team_id) {
            getTeamPlayers(player.team_id)
        }
    }, [player])

    React.useEffect(() => {
        dispatch(getMatchEventsMetrics())
    }, [])

    const changePlayersStatus = (id) => {
        setPlayers(prevState => prevState?.map(item => {
            if (item.id === id)
                return {...item, inGame: !item.inGame}
            return item
        }))
    }

    const removePlayerGoal = (id) => {
        let goalsCount = score[score.side] === 99 ? score[score.side] : score[score.side] - 1
        setScore(prevState => ({...prevState, [prevState.side]: goalsCount}))
        setPlayers(prevState => prevState?.map(item => {
            if (item.id === id) {
                let edited = [...item.goalsCount]
                edited.length > 0 && edited.pop()
                return {...item, goalsCount: edited}
            }
            return item
        }))
    }
    const addPlayerGoal = (id) => {
        let goalsCount = score[score.side] === 99 ? score[score.side] : score[score.side] + 1
        setScore(prevState => ({...prevState, [prevState.side]: goalsCount}))
        setPlayers(prevState => prevState?.map(item => {
            if (item.id === id) {
                let edited = [...item.goalsCount]
                edited.push(4)
                return {...item, goalsCount: edited}
            }
            return item
        }))
    }
    const columns = [
        {
            title: '',
            width: 40,
            key: 'participation',
            render: (player) => {
                return <Checkbox checked={player.inGame} onChange={() => changePlayersStatus(player?.id)}/>
            },
            fixed: "left" as "left"
        },
        {
            title: 'Игрок',
            key: 'name',
            render: (row) => {
                return <div className="flex">
                    <Link href={`/players/${row.id}`}><a><TableLink>{(row.last_name || "") + " " + (row.first_name || "")}</TableLink></a></Link>
                    <div className="players__goals__count__ball">
                        {
                            row.goalsCount?.map((item, i) => {
                                return <img key={i} src="/img/ball__football.png" alt=""/>
                            })
                        }
                    </div>
                </div>
            },
        },
        {
            title: 'Голы',
            render: (row) => {
                return <div className="flex normal">
                    <button className="match__goals__btn minus" onClick={() => !isDisabled && removePlayerGoal(row.id)}>
                        <i className="fas fa-minus" aria-hidden/></button>
                    <button className="match__goals__btn plus" onClick={() => !isDisabled && addPlayerGoal(row.id)}>
                        <i className="fas fa-plus" aria-hidden/></button>
                </div>
            },
            width: 90,
            fixed: "right" as "right"
        },
    ]

    const toggleCollapse = () =>
        setIsCollapsed(prevState => !prevState)

    const handleSubmit = async () => {
        let matchScore = Number(score[score.side])
        if (!matchScore || isNaN(matchScore)) return setErrorNotification("Вы уже ввели результаты матча!")

        let goalMetric = eventMetrics.find(item => item.name === "GOAL")

        let events: { event_id: number, player_id: number, minute?: number }[] = []
        let data = players.map(player => {
            if (!!player.goalsCount?.length)
                return player.goalsCount.map(() => ({event_id: goalMetric.id, player_id: player.id}))
            return null
        }).filter(item => !!item)
        data.forEach(item => {
            events = [...events, ...item]
        })

        let body: {
            match_id: number
            team_id: number
            score: number
            lineups?: number[]
            events?: { event_id: number, player_id: number, minute?: number }[]
        } = {
            match_id: match.id,
            score: matchScore,
            team_id: player.team_id,
            events,
            lineups: players.filter(item => item.inGame).map(item => item.id)
        }
        try {
            let response = await request<{ status: boolean }>("/matches/friendly-match/score", "patch", body)
            if (response && response?.status) {
                router.push(`/matches/${match.id}`)
            }
        } catch (e) {
        }
    }

    React.useEffect(() => {
        if (error)
            setErrorNotification(error)
    }, [error])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = Number(e.target.value)
        if (!isNaN(value)) {
            setScore(prevState => ({...prevState, [score.side]: value}))
        }
    }

    if(isFetching)
        return <Loader/>

    if (!player?.isCaptain)
        return <Page403/>
    return <div className="block__wrapper">
        <h1 className="title secondary match__results__title">Результаты матча</h1>
        <div className="match__results__wrapper">
            <div className="match__results__content col-md-8">
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
                            <input onChange={handleInputChange}
                                   disabled value={score.home}
                                   type="number" defaultValue={score.home}
                                   maxLength={2} max={99} min={0}
                                   className="match__results__score__input"/>
                        </div>
                        <div>
                            <input onChange={handleInputChange}
                                   disabled value={score.away}
                                   type="number" defaultValue={score.away}
                                   maxLength={2} max="99" min={0}
                                   className="match__results__score__input"/>
                            <span>Ожидается ответ соперника</span>
                        </div>
                    </div>
                    <div className="match__results__events">
                        <div className="match__results__collapse" onClick={toggleCollapse}>
                            Результативные игроки
                            <i className="fas fa-chevron-down" aria-hidden/>
                        </div>
                        <div className={`match__results__events__items ${isCollapsed ? "collapsed" : ""}`}>
                            <CustomTable scroll={{x: 430}} dataSource={players} columns={columns}/>
                        </div>
                    </div>
                </div>
                <Popconfirm
                    title="Вы действительно хотите сохранить результат?"
                    onConfirm={handleSubmit}
                    okText="Да"
                    cancelText="Отмена"
                    disabled={isDisabled || loading}
                >
                    <Button disabled={isDisabled || loading} type="primary" className="btn">Отправить</Button>
                </Popconfirm>
            </div>
            <div className="match__results__side col-md-4"/>
        </div>
    </div>
};

