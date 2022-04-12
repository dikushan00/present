import {ImgWrapper} from "../ImgWrapper";
import {ButtonPencil} from "../blocks/buttons";
import {Button, Popconfirm, Tabs} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {TeamLineUp} from "./TeamLineUp/TeamLineUp";
import {TeamMatches} from "./TeamMatches";
import {PlayersStats} from "./PlayersStats";
import {TeamStats} from "./TeamStats";
import AvailablePlayers from "../AvailabePlayers";
import TeamSettings from "../TeamSettings";
import {CreateMatchModal} from "../CreateMatchModal/CreateMatchModal";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNotification} from "../../utils/hooks/useNotification";
import {useHttp} from "../../utils/hooks/http.hook";
import {AppStateType} from "../../redux/store_redux";
import {Match} from "../../../types/match";
import {PlayerInfoType} from "../../../types/player";
import {PlayerTeamRequest, TeamType} from "../../../types/teams";
import {MatchAPI} from "../../api/MatchAPI";
import {PlayerAPI} from "../../api/PlayerAPI";
import {TeamAPI} from "../../api/TeamAPI";
import {actionsProfile} from "../../redux/profile_reducer";

const {TabPane} = Tabs;
type Props = {
    team: TeamType
}
export const Team: React.FC<Props> = ({team}) => {

    const dispatch = useDispatch()
    const {setErrorNotification} = useNotification()
    const {request, error, loading} = useHttp()
    const player = useSelector((state: AppStateType) => state.profile.player)
    const [matchRequests, setMatchRequests] = React.useState<{ incoming: Match[], outgoing: Match[] }>({
        incoming: [],
        outgoing: []
    })
    const [isPlayersTeam, setIsPlayersTeam] = React.useState<boolean>(false)
    const [isRequested, setIsRequested] = React.useState<{ request: boolean, invitation: boolean } | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isModalVisible, setIsModalVisible] = React.useState(false)
    const [players, setPlayers] = React.useState<PlayerInfoType[]>([])
    const [teamState, setTeamState] = React.useState<TeamType | null>(null)
    const [teamPlayersRequests, setTeamPlayersRequests] = React.useState<PlayerTeamRequest[]>([])
    const [teamMatchesScore, setTeamMatchesScore] = React.useState<Match[] | null>(null)

    React.useEffect(() => {
        if (team)
            setTeamState(team)
    }, [team])

    React.useEffect(() => {
        if (error)
            setErrorNotification(error)
    }, [error])

    React.useEffect(() => {
        const getMatchReq = async (data: { player_id: number, team_id: number }) => {
            try {
                let response = data && await MatchAPI.getMatchRequests(data)
                if (response && !!response.status) {
                    const {incoming, outgoing} = response
                    setMatchRequests({incoming, outgoing})
                }
            } catch (e) {
            }
        }
        if (isPlayersTeam) {
            getMatchReq({player_id: player.id, team_id: player.team_id})
        }
    }, [player, isPlayersTeam])

    React.useEffect(() => {
        if (player && team) {
            setIsPlayersTeam(player?.isCaptain && player.team_id === team.id)
        }
    }, [player, team])

    React.useEffect(() => {
        const getPlayerTeamRequests = async (data: { user_id: number, team_id: number }) => {
            try {
                let response = data && await PlayerAPI.getDetailRequest(data)
                if (response) {
                    if (response?.team_id === team.id)
                        setIsRequested({request: true, invitation: response.invitation})
                } else
                    setIsRequested({request: false, invitation: false})
            } catch (e) {
                setIsRequested({request: false, invitation: false})
            }
        }
        if (player?.id && !player?.team_id && team) {
            getPlayerTeamRequests({user_id: player.user_id, team_id: team.id})
        } else
            setIsRequested({request: false, invitation: false})
    }, [player, team, isPlayersTeam])

    React.useEffect(() => {
        const getTeamPlayers = async (team_id: number) => {
            try {
                let response = team_id && await TeamAPI.getTeamPlayers(team_id)
                if (response) {
                    setPlayers(response)
                }
            } catch (e) {
            }
        }
        if (team?.id) {
            getTeamPlayers(team?.id)
        }
    }, [team])

    React.useEffect(() => {
        const getTeamRequests = async (team_id: number) => {
            try {
                let response = team_id && await TeamAPI.getTeamRequests(team_id)
                if (response) {
                    setTeamPlayersRequests(response)
                }
            } catch (e) {
            }
        }
        const getTeamMatchesScore = async () => {
            try {
                let response = await MatchAPI.getTeamMatchesScore()
                if (response) {
                    setTeamMatchesScore(response)
                }
            } catch (e) {
            }
        }
        if (team?.id && isPlayersTeam) {
            getTeamRequests(team?.id)
            getTeamMatchesScore()
        }
    }, [team, isPlayersTeam])

    const declineMatchRequest = async (team_id: number, match_id) => {
        try {
            let response = await MatchAPI.declineMatchRequest({player_id: player.id, match_id, team_id})
            if (response?.status) {
                setMatchRequests(prevState => ({
                    ...prevState,
                    incoming: prevState.incoming.filter(item => item.id !== match_id)
                }))
            }
        } catch (e) {
        }
    }

    const acceptMatchRequest = async (team_id: number, match_id) => {
        try {
            let response = await MatchAPI.acceptMatchRequest({player_id: player.id, match_id, team_id})
            if (response?.status) {
                setMatchRequests(prevState => ({
                    ...prevState,
                    incoming: prevState.incoming.filter(item => item.id !== match_id)
                }))
            }
        } catch (e) {
        }
    }

    const joinToTeam = () => {
        team && dispatch(actionsProfile.joinTeam(team))
    }

    const answerRequest = async (id: number | null, team_id: number, user_id: number, type: "reject" | "accept" = "accept") => {
        try {
            let invitation = !!isRequested?.invitation
            let response = await request<{ status: boolean, player: PlayerInfoType }>(`teams-player-requests/${type}`, "post", {
                team_id,
                user_id,
                invitation
            })
            if (response?.status) {
                id && setTeamPlayersRequests(prevState => prevState ? prevState.filter(item => item.id !== id) : prevState)
                if (type === "accept") {
                    invitation && joinToTeam()
                    setPlayers(prevState => prevState ? [...prevState, response.player] : [response.player])
                }
                setIsRequested(null)
            }
        } catch (e) {
        }
    }

    const leftTeam = async (playerId: number) => {
        let body = {player_id: playerId}
        try {
            let response = await request<{ status: boolean }>("/Teams/left", "post", body)
            if (response.status) {
                dispatch(actionsProfile.leftTeam())
                setPlayers(prevState => prevState ? prevState.filter(item => item.id !== player?.id) : [])
            }
        } catch (e) {
        }
    }

    const requestTeam = async (data: { team_id: number, user_id: number, player_id: number }, type: "cancel" | null = null) => {

        let requested = type !== "cancel"
        let url = type === "cancel" ? "/cancel" : ""
        setIsRequested(prevState => ({...prevState, request: requested}))
        try {
            let response = await request<{ status: boolean }>(`teams-player-requests${url}`, "post", data)
            if (!response?.status) {
                setIsRequested(prevState => ({...prevState, request: !requested}))
            }
        } catch (e) {
            setIsRequested(prevState => ({...prevState, request: !requested}))
        }
    }

    const teamRequest = async () => {
        let data = {
            team_id: team.id,
            user_id: player.user_id,
            player_id: player.id,
        }
        if (isRequested?.request) {
            requestTeam(data, "cancel")
        } else {
            requestTeam(data, null)
        }
    }

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleClick = () => {
        //@ts-ignore
        document.getElementsByClassName("user__file__input")[0].click()
    }

    const onSubmit = async (e) => {
        try {
            let file = e.target.files[0]
            let formdata = new FormData()
            formdata.append('team_id', player.team_id.toString())
            formdata.append('logo', file)
            setIsLoading(true)
            let response = file && await TeamAPI.updateTeam(formdata)
            setIsLoading(false)
            if (response && response.logo) {
                setTeamState(prevState => ({...prevState, logo: response.logo}))
            }
        } catch (e) {
            setIsLoading(false)
            let message = e.response?.data?.message
            message && setErrorNotification(message)
        }
    }

    const changeCaptain = async (playerId: number) => {
        let body = {player_id: playerId}
        try {
            let response = await request<{ status: boolean }>("/Teams/change-captain", "post", body)
            if (response.status) {
                setTeamState(prevState => ({...prevState, captain_id: playerId}))
                dispatch(actionsProfile.changeTeamCaptain())
            }
        } catch (e) {
        }
    }
    return <>
        {
            team
                ? <div className="team__wrapper">
                    <div className="team__info">
                        <div>
                            <div className="team__logo">
                                <ImgWrapper defaultSrc={"/img/default-logo.png"}
                                            src={teamState?.logo}
                                            alt={"logo"}/>
                                {
                                    isPlayersTeam && <>
                                        <ButtonPencil loader={isLoading} right={"-13px"} onClick={handleClick}/>
                                        <input onInputCapture={onSubmit} accept="image/jpeg,image/jpg,image/png"
                                               className="user__file__input"
                                               style={{display: "none"}} type="file"
                                        />
                                    </>
                                }
                            </div>
                        </div>
                        <div style={{width: "100%"}}>
                            <div className="flex team__flex padding align">
                                <div className="title__wrapper">
                                    <h1 className="secondary">{team?.name}</h1>
                                </div>
                                {(player && isRequested) && <>
                                    {
                                        player?.team_id === team?.id
                                            ? <Popconfirm
                                                title="Вы действительно хотите покинуть команду?"
                                                onConfirm={() => leftTeam(player.id)}
                                                okText="Да"
                                                cancelText="Отмена"
                                            >
                                                <Button className="btn__w-icon" type={"default"}>
                                                    <i className="fas fa-running"/><span
                                                    className="btn__text">&nbsp;Покинуть</span>
                                                </Button>
                                            </Popconfirm>
                                            : player?.isCaptain
                                                ? <Button
                                                    onClick={showModal}>Играть</Button>
                                                : <div>
                                                    <Button className="btn__w-icon"
                                                            onClick={isRequested?.invitation
                                                                ? () => answerRequest(null, team.id, player.user_id, "accept")
                                                                : teamRequest}>
                                                        {
                                                            (isRequested?.request && !isRequested.invitation)
                                                                ? <><FontAwesomeIcon icon={faCheck}/><span
                                                                    className="btn__text">&nbsp;Отправлено</span></>
                                                                : <><FontAwesomeIcon icon={faUserPlus}/><span
                                                                    className="btn__text">&nbsp;Вступить</span></>
                                                        }
                                                    </Button>
                                                    {
                                                        (isRequested?.request && isRequested.invitation)
                                                        && <Button className="btn__w-icon"
                                                                   onClick={() => answerRequest(null, team.id, player.user_id, "reject")}
                                                                   title={"Отказать"}>
                                                            <FontAwesomeIcon icon={faTimes}/>
                                                        </Button>
                                                    }

                                                </div>
                                    }
                                </>}
                            </div>
                            <div className="team__info__list">
                                <div>
                                    <span className="team__info__title">Город, страна:</span>
                                    <span
                                        className="bold">{team?.city ? `${team?.city?.name}, ${team?.city?.country_name}` : ""}</span>
                                </div>
                                <div>
                                    <span className="team__info__title">Владелец:</span>
                                    <span className="bold">Самодостаточный</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="team__content">
                        {
                            !!teamPlayersRequests?.length && <div>
                                <div className="title__wrapper">
                                    <h1 className="secondary">Заявки в команду</h1>
                                </div>
                                <div className="games__wrapper request__wrapper">
                                    {
                                        teamPlayersRequests.map((item, i) => {
                                            return <div key={i} className="card games__item">
                                                <Link href={`/teams/${item.team_id}`}>
                                                    <a>{(item.user?.first_name || "") + " " + (item.user?.last_name || "")}</a>
                                                </Link>
                                                <div className={"flex request__btn__wrapper"}>
                                                    <Button
                                                        onClick={() => answerRequest(item.id, item.team_id, item.user_id, "reject")}>Отклонить</Button>
                                                    <Button
                                                        onClick={() => answerRequest(item.id, item.team_id, item.user_id, "accept")}
                                                        type={"primary"}>Принять</Button>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        }
                        {
                            !!teamMatchesScore?.length && <div>
                                <div className="title__wrapper">
                                    <h1 className="secondary">Ожидание результатов</h1>
                                </div>
                                <div className="games__wrapper request__wrapper">
                                    {
                                        teamMatchesScore.map((item, i) => {
                                            return <div key={i} className="card games__item">
                                                <Link href={`/matches/${item.id}`}>
                                                    <a>{(item.home_team.name || "") + " - " + (item.away_team.name || "")}</a>
                                                </Link>
                                                <div className={"flex request__btn__wrapper"}>
                                                    <Link href={`/matches/${item.id}/results-edit`}>
                                                        <a><Button>Внести результаты</Button></a>
                                                    </Link>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        }
                        {
                            !!matchRequests?.incoming?.length && <div>
                                <div className="title__wrapper">
                                    <h1 className="secondary">Заявки на матч</h1>
                                </div>
                                <div className="games__wrapper">
                                    {
                                        matchRequests?.incoming?.map((item, i) => {
                                            return <div key={i} className="card games__item">
                                                {item.home_team.name}
                                                <div className={"flex"}>
                                                    <Button
                                                        onClick={() => declineMatchRequest(item.home_team_id, item.id)}>Отклонить</Button>
                                                    <Button onClick={() => acceptMatchRequest(item.home_team_id, item.id)}
                                                            type={"primary"}>Принять</Button>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>}
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Состав команды" key="1">
                                <TeamLineUp players={players} loading={loading} team={teamState} changeCaptain={changeCaptain}
                                            leftTeam={leftTeam}/>
                            </TabPane>
                            <TabPane tab="Все матчи" key="2">
                                <TeamMatches team={team} showFilters={false}/>
                            </TabPane>
                            <TabPane tab="Статистика игроков" key="3">
                                <PlayersStats teamId={team.id}/>
                            </TabPane>
                            <TabPane tab="Статистика команды" key="4">
                                <TeamStats teamId={team.id}/>
                            </TabPane>
                            {isPlayersTeam && <TabPane tab="Добавить игрока" key="6">
                                <AvailablePlayers/>
                            </TabPane>}
                            {isPlayersTeam && <TabPane tab="Настройки" key="7">
                                <TeamSettings/>
                            </TabPane>}
                        </Tabs>
                    </div>
                    <CreateMatchModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}
                                      activeTeam={team}/>
                </div>
                : <>
                    <div className="team__info">
                        <div>
                            <div className="title__wrapper">
                                <h1 className="secondary">Команда не найдена</h1>
                            </div>
                        </div>
                    </div>
                </>
        }
    </>
}