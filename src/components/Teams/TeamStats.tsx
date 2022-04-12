import React from 'react';
import {TeamAPI} from "../../api/TeamAPI";
import CustomTable from "../CustomTable";

export const TeamStats = ({teamId}) => {
    const [data, setData] = React.useState(null)
    const columns = [
        {
            title: '',
            dataIndex: 'title',
            key: 'title',
            width: 120,
            fixed: "left" as "left"
        },
        {
            title: 'Общий',
            dataIndex: 'all',
            key: 'all',
            children: [
                {
                    title: 'Сумма',
                    dataIndex: 'sum__total',
                    key: 'sum__total',
                    align: "center" as "center",
                },
                {
                    title: 'Всего',
                    dataIndex: 'all__total',
                    key: 'all__total',
                    align: "center" as "center",
                },
                {
                    title: 'Среднее',
                    dataIndex: 'average__total',
                    key: 'average__total',
                    align: "center" as "center",
                },
            ]
        },
        {
            title: 'Дома',
            dataIndex: 'home',
            key: 'home',
            children: [
                {
                    title: 'Сумма',
                    dataIndex: 'sum__home',
                    key: 'sum__home',
                    align: "center" as "center",
                },
                {
                    title: 'Всего',
                    dataIndex: 'all__home',
                    key: 'all__home',
                    align: "center" as "center",
                },
                {
                    title: 'Среднее',
                    dataIndex: 'average__home',
                    key: 'average__home',
                    align: "center" as "center",
                },
            ]
        },
        {
            title: 'В гостях',
            dataIndex: 'away',
            key: 'away',
            children: [
                {
                    title: 'Сумма',
                    dataIndex: 'sum__away',
                    key: 'sum__away',
                    align: "center" as "center",
                },
                {
                    title: 'Всего',
                    dataIndex: 'all__away',
                    key: 'all__away',
                    align: "center" as "center",
                },
                {
                    title: 'Среднее',
                    dataIndex: 'average__away',
                    key: 'average__away',
                    align: "center" as "center",
                },
            ]
        },
    ];

    React.useEffect(() => {
        const getTeamStats = async (team_id: number) => {
            try {
                let response = team_id && await TeamAPI.getTeamStats(team_id)
                if (response) {
                    let {stats} = response
                    let data = [
                        {
                            key: '1',
                            id: 1,
                            title: 'Сыгранные матчи',
                            all__away: stats.away.matches_count,
                            all__home: stats.home.matches_count,
                            all__total: stats.total.matches_count,
                        },
                        {
                            key: '2',
                            id: 2,
                            title: 'Победы',
                            sum__away: stats.away.win,
                            average__away: stats.away.win_average,
                            sum__home: stats.home.win,
                            average__home: stats.home.win_average,
                            sum__total: stats.total.win,
                            average__total: stats.total.win_average,
                        },
                        {
                            key: '3',
                            id: 3,
                            title: 'Ничьи',
                            sum__away: stats.away.draft,
                            average__away: stats.away.draft_average,
                            sum__home: stats.home.draft,
                            average__home: stats.home.draft_average,
                            sum__total: stats.total.draft,
                            average__total: stats.total.draft_average,
                        },
                        {
                            key: '4',
                            id: 4,
                            title: 'Поражения',
                            sum__away: stats.away.defeat,
                            average__away: stats.away.defeat_average,
                            sum__home: stats.home.defeat,
                            average__home: stats.home.defeat_average,
                            sum__total: stats.total.defeat,
                            average__total: stats.total.defeat_average,
                        },
                        {
                            key: '5',
                            id: 5,
                            title: 'Набранные очки',
                            sum__away: stats.away.points,
                            average__away: stats.away.points_average,
                            sum__home: stats.home.points,
                            average__home: stats.home.points_average,
                            sum__total: stats.total.points,
                            average__total: stats.total.points_average,
                        },
                        {
                            key: '6',
                            id: 6,
                            title: 'Забитые мячи',
                            sum__away: stats.away.goals,
                            average__away: stats.away.goals_average,
                            sum__home: stats.home.goals,
                            average__home: stats.home.goals_average,
                            sum__total: stats.total.goals,
                            average__total: stats.total.goals_average,
                        },
                        {
                            key: '7',
                            id: 7,
                            title: 'Пропущенные мячи',
                            sum__away: stats.away.missed_goals,
                            average__away: stats.away.missed_goals_average,
                            sum__home: stats.home.missed_goals,
                            average__home: stats.home.missed_goals_average,
                            sum__total: stats.total.missed_goals,
                            average__total: stats.total.missed_goals_average,
                        },
                        {
                            key: '8',
                            id: 8,
                            title: 'Разность мячей',
                            sum__away: stats.away.goals_difference,
                            average__away: stats.away.goals_difference_average,
                            sum__home: stats.home.goals_difference,
                            average__home: stats.home.goals_difference_average,
                            sum__total: stats.total.goals_difference,
                            average__total: stats.total.goals_difference_average,
                        },
                        {
                            key: '9',
                            id: 9,
                            title: 'Желтые карточки',
                            sum__away: stats.away.yellow_cards,
                            average__away: stats.away.yellow_cards_average,
                            sum__home: stats.home.yellow_cards,
                            average__home: stats.home.yellow_cards_average,
                            sum__total: stats.total.yellow_cards,
                            average__total: stats.total.yellow_cards_average,
                        },
                        {
                            key: '10',
                            id: 10,
                            title: 'Вторые желтые карточки',
                            sum__away: stats.away.db_yellow_cards,
                            average__away: stats.away.db_yellow_cards_average,
                            sum__home: stats.home.db_yellow_cards,
                            average__home: stats.home.db_yellow_cards_average,
                            sum__total: stats.total.db_yellow_cards,
                            average__total: stats.total.db_yellow_cards_average,
                        },
                        {
                            key: '11',
                            id: 11,
                            title: 'Красные карточки',
                            sum__away: stats.away.red_cards,
                            average__away: stats.away.red_cards_average,
                            sum__home: stats.home.red_cards,
                            average__home: stats.home.red_cards_average,
                            sum__total: stats.total.red_cards,
                            average__total: stats.total.red_cards_average,
                        }
                    ]
                    setData(data)
                }
            } catch (e) {}
        }
        if(teamId) {
            getTeamStats(teamId)
        }
    }, [teamId])

    return <div>
        <CustomTable dataSource={data} columns={columns}/>
    </div>
}
