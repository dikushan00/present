import React from 'react';
import {Button, Pagination} from "antd";
import Link from "next/link";
import {TeamAPI} from "../../api/TeamAPI";
import {getStadiums} from "../../redux/playgrounds_reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store_redux";
import {getMatchSettings} from "../../redux/match_reducer";
import {useHttp} from "../../utils/hooks/http.hook";
import {PlayerAPI} from "../../api/PlayerAPI";
import {CreateMatchModal} from "../CreateMatchModal/CreateMatchModal";
import {actionsApp} from "../../redux/app_reducer";
import {PlayerTeamRequest, TeamsDataSource} from "../../../types/teams";
import {ThemeModeType} from "../../../types/app";
import {PaginationListWrapper, PaginationWrapper} from "../styled/pagination";
import {useNotification} from "../../utils/hooks/useNotification";
import {TeamsTable} from "./TeamsTable";

type Props = {
    limit?: number
    pagination?: boolean
    mode?: ThemeModeType
    showActions?: boolean
}

let defaultPageSize = 15
export const Teams: React.FC<Props> = ({
                                           limit, showActions,
                                           mode = "light", pagination
                                       }) => {
    const dispatch = useDispatch()
    const {request} = useHttp()
    const {setSucceedNotification} = useNotification()

    const {profile, player} = useSelector((state: AppStateType) => state.profile)
    const [isFetching, setIsFetching] = React.useState(false)
    const [isModalVisible, setIsModalVisible] = React.useState(false)
    const [activeTeam, setActiveTeam] = React.useState<TeamsDataSource | null>(null)

    const [activePageNumber, setActivePageNumber] = React.useState<number>(1)
    const [maxItemsCount, setMaxItemsCount] = React.useState<number | null>(null)

    const [dataSource, setDataSource] = React.useState<TeamsDataSource[] | null>(null)
    const [playerRequests, setPlayerRequests] = React.useState<PlayerTeamRequest[] | null>(null)

    React.useEffect(() => {
        const getTeams = async () => {
            try {
                setIsFetching(true)
                let teams = await TeamAPI.getTeamsStats({
                    limit: limit || defaultPageSize,
                    page: activePageNumber,
                    min: true
                })
                setIsFetching(false)
                if (teams) {
                    setMaxItemsCount(prevState => prevState ? prevState : teams.count)
                    let data = teams.rows?.map(item => {
                        return {
                            ...item?.team,
                            stats: item.stats,
                            key: item.team?.id || 0,
                            requested: false
                        }
                    })
                    setDataSource(data)
                }
            } catch (e) {
                setIsFetching(false)
            }
        }
        getTeams()
    }, [activePageNumber])

    React.useEffect(() => {
        const getPlayerRequests = async (userId: number) => {
            try {
                let requests = await PlayerAPI.getPlayerRequests(userId)
                if (requests?.length) {
                    setPlayerRequests(requests)
                }
            } catch (e) {
            }
        }
        if (profile?.id)
            getPlayerRequests(profile.id)
    }, [profile])

    React.useEffect(() => {
        if (dataSource && playerRequests?.length) {
            let data = [...dataSource]
            playerRequests.forEach(item => {
                data = data.map(team => {
                    if (item.team_id === team.id && !item.answered) {
                        return {...team, requested: true}
                    }
                    return team
                })
            })
        }
    }, [dataSource, playerRequests])

    const showModal = () => {
        setIsModalVisible(true)
    }

    const requestTeam = async (data: { team_id: number, user_id: number, player_id: number }, type: "cancel" | null = null, isMobile = false) => {
        let requested = type !== "cancel"
        let url = type === "cancel" ? "/cancel" : ""
        setDataSource(prevState => prevState ? prevState.map(item => {
            if (item.id === data.team_id)
                return {...item, requested: requested}
            return item
        }) : prevState)
        try {
            let response = await request<{ status: boolean }>(`teams-player-requests${url}`, "post", data)
            if (response?.status) {
                if (isMobile) {
                    let message = type === "cancel" ? "Заявка в команду отменена!" : "Заявка в команду отправлена!"
                    setSucceedNotification(message)
                }
            } else {
                setDataSource(prevState => prevState ? prevState.map(item => {
                    if (item.id === data.team_id)
                        return {...item, requested: !requested}
                    return item
                }) : prevState)
            }
        } catch (e) {
            setDataSource(prevState => prevState ? prevState.map(item => {
                if (item.id === data.team_id)
                    return {...item, requested: !requested}
                return item
            }) : prevState)
        }
    }

    const handleClick = async (row, isMobile = false) => {
        setActiveTeam(row)
        if (!!player?.team_id)
            showModal()
        else if (profile) {
            let data = {
                team_id: row.id,
                user_id: profile.id,
                player_id: player.id
            }
            if (row.requested) {
                requestTeam(data, "cancel", true)
            } else {
                requestTeam(data, null, true)
            }
        } else {
            dispatch(actionsApp.setActiveModal("modal-sign"))
        }
    }

    React.useEffect(() => {
        if (isModalVisible) {
            dispatch(getStadiums())
            dispatch(getMatchSettings())
        }
    }, [isModalVisible])

    const onPaginationChange = (page: number) => {
        setActivePageNumber(page)
    }

    return <div className="teams">
        <div className="flex">
            <div className="title__wrapper">
                <h1 className="main">Команды города</h1>
            </div>
            {player && !player?.team_id && <Link href={`/create-team`}>
                <a>
                    <Button type="primary">
                        Создать команду
                    </Button>
                </a>
            </Link>}
        </div>
        <TeamsTable player={player} dataSource={dataSource} mode={mode} isFetching={isFetching} handleClick={handleClick} showActions={showActions}/>
        <CreateMatchModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} activeTeam={activeTeam}
                          setActiveTeam={setActiveTeam}/>
        {pagination && <PaginationWrapper>
            <PaginationListWrapper>
                <Pagination pageSize={limit || defaultPageSize} current={activePageNumber} defaultPageSize={limit || defaultPageSize}
                            onChange={onPaginationChange} defaultCurrent={activePageNumber} total={maxItemsCount}/>
            </PaginationListWrapper>
        </PaginationWrapper>}
    </div>
};
