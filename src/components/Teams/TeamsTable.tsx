import React from 'react';
import CustomTable from "../CustomTable";
import Link from "next/link";
import {ImgWrapper} from "../ImgWrapper";
import {TableLink} from "../styled/main/components";
import {Button} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faFutbol, faUsers} from "@fortawesome/free-solid-svg-icons";
import {sortArrayByDate} from "../../utils/sortArrayByDate";
import {getTeamSide} from "../../utils/getTeamSide";
import {ThemeModeType} from "../../../types/app";
import {PlayerInfoType} from "../../../types/player";
import {TeamsDataSource} from "../../../types/teams";

type Props = {
    showActions?: boolean
    isFetching?: boolean
    mode?: ThemeModeType
    dataSource: TeamsDataSource[]
    handleClick?: (row: any, n?: boolean) => void
    player?: PlayerInfoType
}
export const TeamsTable: React.FC<Props> = ({showActions, mode, handleClick, player, isFetching, dataSource}) => {


    const lastGames = (row) => {
        let matches = [...row.matches, ...row.matches_away]
        let sorted = sortArrayByDate(matches, false)
        sorted = sorted.slice(0, 5)
        return <div className="teams__last-games">
            {
                sorted?.map(item => {
                    if (item.home_team_score === null && item.away_team_score === null)
                        return null
                    let {result} = getTeamSide(row.id, item)
                    return result && <div key={item.id} className={`teams__score__circle ${result}`}/>
                })
            }
        </div>
    }
    let columns = [
        {
            title: 'Команда',
            key: 'name',
            width: "auto",
            render: (row) => {
                return <Link href={`/teams/${row.id}`}><a>
                    <div className="flex normal">
                        <ImgWrapper className="teams__table__logo"
                                    defaultSrc={'/img/default-logo.png'} src={row.logo}
                                    alt={"logo"}/><TableLink>{row.name}</TableLink></div>
                </a></Link>
            },
            fixed: "left" as "left"
        },
        {
            title: 'И',
            key: 'games',
            render: (row) => <span>{row.stats.total.matches_count}</span>,
        },
        {
            title: 'В',
            key: 'win',
            render: (row) => <span>{row.stats.total.win}</span>,
        },
        {
            title: 'Н',
            key: 'draft',
            render: (row) => <span>{row.stats.total.draft}</span>,
        },
        {
            title: 'П',
            key: 'defeat',
            render: (row) => <span>{row.stats.total.defeat}</span>,
        },
        {
            title: 'Последние матчи',
            key: 'history',
            render: lastGames,
            responsive: ["sm" as "sm"]
        },
        {
            title: 'ПМ',
            key: 'history-mobile',
            render: lastGames,
            responsive: ["xs" as "xs"]
        },
    ];

    if (showActions) {
        columns = [...columns, {
            title: "",
            key: 'play',
            render: (row) => {
                return player?.team_id !== row?.id && <Button
                    onClick={() => handleClick(row)}>{!!player?.team_id ? "Играть" : row.requested ?
                    <FontAwesomeIcon icon={faCheck}/> : "Вступить"}</Button>
            },
            responsive: ["sm" as "sm"]
        },
            {
                title: "",
                key: 'play-mobile',
                render: (row) => {
                    return player?.team_id !== row?.id && <span
                        onClick={() => handleClick(row, true)}>
                    {!!player?.team_id ? <FontAwesomeIcon className={mode === "dark" ? "icon__white" : "icon__dark"}
                                                          icon={faFutbol}/> : row.requested ?
                        <FontAwesomeIcon className={"icon__active"} icon={faCheck}/> :
                        <FontAwesomeIcon className={mode === "dark" ? "icon__white" : "icon__dark"} icon={faUsers}/>}
                </span>
                },
                responsive: ["xs" as "xs"]
            },]
    }
    return (
        <div>
            <CustomTable loading={isFetching} mode={mode} dataSource={dataSource} columns={columns}/>
        </div>
    );
};


