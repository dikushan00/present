import React from 'react';
import {Pagination} from "antd";
import Link from "next/link";
import {getPlayerAge} from "../../utils/getPlayerAge";
import {PlayerAPI} from "../../api/PlayerAPI";
import {PlayerStats} from "../Teams/PlayersStats";
import CustomTable from "../CustomTable";
import {ThemeModeType} from "../../../types/app";
import {PlayerAvatarTable} from "./PlayerAvatarTable/PlayerAvatarTable";
import {PaginationListWrapper, PaginationWrapper} from "../styled/pagination";
import {TableLink} from "../styled/main/components";

type Props = {
    limit?: number
    mode?: ThemeModeType
    pagination?: boolean
}

interface DataType extends PlayerStats {
    index: number | string
    key: string
}

let defaultPageSize = 20
export const Players: React.FC<Props> = ({limit, mode, pagination = false}) => {

    const [activePageNumber, setActivePageNumber] = React.useState<number>(1)
    const [maxItemsCount, setMaxItemsCount] = React.useState<number | null>(null)
    const [isFetching, setIsFetching] = React.useState<boolean>(false)

    const [dataSource, setDataSource] = React.useState<DataType[] | null>(null)
    const columns = [
        {
            title: '№',
            key: 'number',
            width: 50,
            fixed: "left" as "left",
            render: (row) => {
                let index = (row.index + 1) + ((activePageNumber - 1) * defaultPageSize)
                return <span>{index}</span>
            },
        },
        {
            title: 'Игрок',
            key: 'name',
            render: (row) => {
                return <Link href={`/players/${row.id}`}>
                    <a>
                        <div className="flex normal cursor__pointer">
                            <PlayerAvatarTable src={row?.avatar}/>
                            <TableLink>{row?.last_name + " " + row?.first_name}</TableLink>
                        </div>
                    </a>
                </Link>
            },
            fixed: "left" as "left",
            width: 170,
        },
        {
            title: 'Возраст',
            key: 'birthday',
            render: (row) => {
                return <span>{getPlayerAge(row.birthday)}</span>
            },
            responsive: ["sm" as "sm"]
        },
        {
            title: 'Матчей',
            dataIndex: 'games',
            key: 'games',
            responsive: ["sm" as "sm"]
        },
        {
            title: 'М',
            dataIndex: 'games',
            key: 'games-mobile',
            responsive: ["xs" as "xs"],
            width: 50
        },
        {
            title: 'Голы',
            dataIndex: 'goals',
            key: 'goals',
            responsive: ["sm" as "sm"]
        },
        {
            title: 'Г',
            dataIndex: 'goals',
            key: 'goals-mobile',
            responsive: ["xs" as "xs"],
            width: 50
        },
        {
            title: 'Ассисты',
            dataIndex: 'assists',
            key: 'assists',
            responsive: ["sm" as "sm"]
        },
        {
            title: 'А',
            dataIndex: 'assists',
            key: 'assists-mobile',
            responsive: ["xs" as "xs"],
            width: 50
        },
    ];

    React.useEffect(() => {
        const getPlayers = async () => {
            try {
                setIsFetching(true)
                let response = await PlayerAPI.getPlayersStats({
                    stats: true,
                    limit: limit || defaultPageSize,
                    page: activePageNumber
                })
                setIsFetching(false)
                if (response) {
                    setMaxItemsCount(prevState => prevState ? prevState : response.count)
                    setDataSource(response?.rows?.map((item, i) => ({
                        ...item,
                        index: i,
                        key: item.id.toString()
                    })))
                }
            } catch (e) {
                setIsFetching(false)
            }
        }
        getPlayers()
    }, [activePageNumber])

    const onPaginationChange = (page: number) => {
        setActivePageNumber(page)
    }

    return (
        <div className="players">
            <div className="flex">
                <div className="title__wrapper">
                    <h1 className="main">Игроки города</h1>
                </div>
            </div>
            <CustomTable loading={isFetching} mode={mode} dataSource={dataSource} columns={columns}/>
            {
                pagination && <PaginationWrapper>
                    <PaginationListWrapper>
                        <Pagination pageSize={limit || defaultPageSize} current={activePageNumber}
                                    defaultPageSize={limit || defaultPageSize}
                                    onChange={onPaginationChange} defaultCurrent={activePageNumber}
                                    total={maxItemsCount}/>
                    </PaginationListWrapper>
                </PaginationWrapper>
            }
        </div>
    );
};

