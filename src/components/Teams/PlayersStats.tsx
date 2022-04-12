import React from 'react';
import Link from "next/link";
import {TeamAPI} from "../../api/TeamAPI";
import CustomTable from "../CustomTable";
import {TableLink} from "../styled/main/components"

type Props = {
    teamId: number
}

export const PlayersStats: React.FC<Props> = ({teamId}) => {
    const [data, setData] = React.useState<PlayerStats[] | null>(null)

    React.useEffect(() => {
        const getTeamPlayersStats = async (team_id: number) => {
            try {
                let response = team_id && await TeamAPI.getTeamPlayersStats(team_id)
                if (response) {
                    setData(response?.map(item => item ? ({...item, key: item.id.toString()}) : null))
                }
            } catch (e) {
            }
        }
        if (teamId) {
            getTeamPlayersStats(teamId)
        }
    }, [teamId])

    const columns = [
        {
            title: 'Игрок',
            key: 'name',
            width: 150,
            render: (row) => {
                return <Link
                    href={`/players/${row.id}`}><a><TableLink>{row.number ? row.number + ". " : ""}{row.last_name + " " + row.first_name}</TableLink></a></Link>
            },
            fixed: "left" as "left"
        },
        {
            title: 'Игры',
            dataIndex: 'games',
            key: 'games',
            responsive: ["sm" as "sm"]
        },
        {
            title: 'И',
            dataIndex: 'games',
            key: 'games-mobile',
            responsive: ["xs" as "xs"]
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
            responsive: ["xs" as "xs"]
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
            responsive: ["xs" as "xs"]
        },
        {
            title: 'Гол+Пас',
            dataIndex: 'goal_assist',
            key: 'goal_assist',
            responsive: ["sm" as "sm"]
        },
        {
            title: 'Г+П',
            dataIndex: 'goal_assist',
            key: 'goal_assist-mobile',
            responsive: ["xs" as "xs"]
        },
        {
            title: 'ЖК',
            dataIndex: 'yellow_cards',
            key: 'yellow_cards',
        },
        {
            title: '2ЖК',
            dataIndex: 'double_yellow_cards',
            key: 'double_yellow_cards',
        },
        {
            title: 'КК',
            dataIndex: 'red_cards',
            key: 'red_cards',
        },
    ];
    return <div>
        <CustomTable dataSource={data} columns={columns}/>
    </div>
}

export const eventMetrics = {
    goal: "GOAL",
}

export type PlayerStats = {
    key: string,
    id: number,
    first_name: string,
    last_name: string,
    number: number,
    goals: number,
    assists: number,
    goal_assist: number,
    yellow_cards: number,
    double_yellow_cards: number,
    red_cards: number,
    games: number,
}
