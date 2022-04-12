import React from 'react';
import Link from "next/link";
import {Button, Pagination, Select, Spin} from "antd";
import {PlayerAPI} from "../../api/PlayerAPI";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {useSelector} from "react-redux";
import {AppStateType} from "../../redux/store_redux";
import {useHttp} from "../../utils/hooks/http.hook";
import {TeamAPI} from "../../api/TeamAPI";
import {PlayerTeamRequest} from "../../../types/teams";
import {PlayerInfoType} from "../../../types/player";
import {SelectProps} from "antd/es/select";
import debounce from 'lodash/debounce'
import {useNotification} from "../../utils/hooks/useNotification";
import {fetchUserList} from "../../utils/fetchUserList";
import CustomTable from "../CustomTable";
import {PlayerAvatarTable} from "../Players/PlayerAvatarTable/PlayerAvatarTable";
import {PaginationListWrapper, PaginationWrapper} from "../styled/pagination";
import {TableLink} from "../styled/main/components";

let defaultPageSize = 20
const AvailablePlayers = () => {

    const {player} = useSelector((state: AppStateType) => state.profile)
    const {request} = useHttp()
    const {setSucceedNotification} = useNotification()

    const [teamRequests, setTeamRequests] = React.useState<PlayerTeamRequest[] | null>(null)
    const [teamRequestsIds, setTeamRequestsIds] = React.useState<number[] | null>([])
    const [players, setPlayers] = React.useState<PlayerInfoType[] | null>(null)
    const [dataSource, setDataSource] = React.useState(null)
    const [value, setValue] = React.useState<string[]>([])
    const [activePageNumber, setActivePageNumber] = React.useState<number>(1)
    const [maxItemsCount, setMaxItemsCount] = React.useState<number | null>(null)

    const requestInvitation = async (data: { team_id: number, user_id: number, invitation: boolean }, type: "cancel" | null = null) => {

        let requested = type !== "cancel"
        let url = type === "cancel" ? "/cancel" : ""
        setDataSource(prevState => prevState.map(item => {
            if (item.id === data.user_id)
                return {...item, isRequested: requested}
            return item
        }))
        if (requested)
            setTeamRequestsIds(prevState => [...prevState, data.user_id])
        else
            setTeamRequestsIds(prevState => prevState.filter(id => id !== data.user_id))
        try {
            let response = await request<{ status: boolean }>(`teams-player-requests${url}`, "post", data)
            if (!response?.status) {
                setDataSource(prevState => prevState.map(item => {
                    if (item.id === data.user_id)
                        return {...item, isRequested: !requested}
                    return item
                }))
                if (!requested)
                    setTeamRequestsIds(prevState => [...prevState, data.user_id])
                else
                    setTeamRequestsIds(prevState => prevState.filter(id => id !== data.user_id))
            }
        } catch (e) {
            setDataSource(prevState => prevState.map(item => {
                if (item.id === data.user_id)
                    return {...item, isRequested: !requested}
                return item
            }))
            if (!requested)
                setTeamRequestsIds(prevState => [...prevState, data.user_id])
            else
                setTeamRequestsIds(prevState => prevState.filter(id => id !== data.user_id))
        }
    }

    const playerRequest = async (userId, isRequested) => {
        let data = {
            team_id: player.team.id,
            user_id: userId,
            invitation: true
        }
        if (isRequested) {
            requestInvitation(data, "cancel")
        } else {
            requestInvitation(data, null)
        }
    }

    const columns = [
        {
            title: 'Игрок',
            key: 'name',
            render: (row) => {
                return <Link href={`/players/${row.id}`}>
                    <a>
                        <div className="flex normal">
                            <PlayerAvatarTable src={row?.user?.avatar}/>
                            <TableLink>{row?.user.last_name + " " + row?.user.first_name}</TableLink>
                        </div>
                    </a>
                </Link>
            },
        },
        {
            title: '',
            dataIndex: '',
            key: 'action',
            render: (row) => {
                return <Button
                    onClick={() => playerRequest(row.id, row.isRequested)}>{
                    !!row?.isRequested
                        ? <><FontAwesomeIcon icon={faCheck}/> Отправлено</>
                        : "Пригласить"}
                </Button>
            },
        },
    ];

    React.useEffect(() => {
        const getPlayers = async () => {
            try {
                let res = await PlayerAPI.getPlayers({free: true, page: activePageNumber, limit: defaultPageSize})
                if (res && res?.rows?.length) {
                    setMaxItemsCount(prevState => prevState ? prevState : res.count)
                    setPlayers(res.rows.map(item => ({...item, key: item.id})))
                }
            } catch (e) {

            }
        }
        getPlayers()
    }, [activePageNumber])

    React.useEffect(() => {
        const getTeamPlayersRequests = async (team_id: number) => {
            try {
                let response = team_id && await TeamAPI.getTeamRequests(team_id, {invitation: true})
                if (response) {
                    setTeamRequests(response)
                    setTeamRequestsIds(response.map(item => item.user_id))
                } else
                    setTeamRequests([])
            } catch (e) {
                setTeamRequests([])
            }
        }
        if (player?.team_id) {
            getTeamPlayersRequests(player?.team_id)
        }
    }, [player])

    React.useEffect(() => {
        if (players && teamRequests && !!players?.length) {
            let data = [...players]
            if (!!teamRequests.length) {
                teamRequests.forEach(item => {
                    data = data.map(player => player.user_id === item.user_id ? {...player, isRequested: true} : player)
                })
                setDataSource(data)
            } else
                setDataSource(data)
        }
    }, [players, teamRequests])

    const invitationSeveralPlayers = async () => {
        if (value && value.length) {
            let ids = []
            value.forEach(item => {
                let isExist = teamRequestsIds.find(id => {
                    let split = item.split(id + "$id$")
                    return split && split.length === 2;
                })
                if (!isExist) {
                    let id = Number(item.split("$id$")[0])
                    id && ids.push(id)
                }
            })
            !!ids.length && await Promise.all(ids.map(async item => {
                let data = {
                    team_id: player.team.id,
                    user_id: item,
                    invitation: true
                }
                await requestInvitation(data, null)
            }))
            setValue([])
            setSucceedNotification("Приглашение успешно отправлено")
        }
    }

    const onPaginationChange = (page: number) => {
        setActivePageNumber(page)
    }

    if (!player)
        return <div>Нет прав для этой страницы!</div>

    return <div>
        <div className="title__wrapper">
            <h1 className="secondary">Свободные игроки</h1>
        </div>
        <DebounceSelect
            mode="multiple"
            value={value}
            placeholder="Поиск игроков"
            fetchOptions={fetchUserList}
            onChange={newValue => {
                setValue(newValue);
            }}
            style={{width: '100%'}}
        />
        {
            value && !!value.length &&
            <div className={"margin"}>
                <Button onClick={invitationSeveralPlayers} type="primary">
                    Пригласить
                </Button>
            </div>
        }

        <CustomTable dataSource={dataSource} columns={columns}/>
        <PaginationWrapper>
            <PaginationListWrapper>
                <Pagination pageSize={defaultPageSize} current={activePageNumber} defaultPageSize={defaultPageSize}
                            onChange={onPaginationChange} defaultCurrent={activePageNumber} total={maxItemsCount}/>
            </PaginationListWrapper>
        </PaginationWrapper>
    </div>
};

export default AvailablePlayers;

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}

function DebounceSelect<ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
    >({fetchOptions, debounceTimeout = 800, ...props}: DebounceSelectProps) {
    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState<ValueType[]>([]);
    const fetchRef = React.useRef(0);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then(newOptions => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    return (
        <Select<ValueType>
            optionLabelProp={"label"}
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small"/> : null}
            {...props}
            options={options}
        />
    );
}
