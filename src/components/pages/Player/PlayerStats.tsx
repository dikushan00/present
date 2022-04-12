import React from 'react';
import {PlayerAPI} from "../../../api/PlayerAPI";

type Props = {
    playerId: number
}
export const PlayerStats:React.FC<Props> = ({playerId}) => {

    const [stats, setStats] = React.useState({
        goals: {title: "Голы", value: 0},
        assists: {title: "Пасы", value: 0},
        games: {title: "Матчей", value: 0},
        yellow_cards: {title: "ЖК", value: 0},
        double_yellow_cards: {title: "2ЖК", value: 0},
        red_cards: {title: "КК", value: 0},
    })

    React.useEffect(() => {
        const getPlayerStats = async (player_id: number) => {
            try {
                let response = await PlayerAPI.getPlayerStats(player_id)
                if (response) {
                    let statsObj = {...stats}
                    Object.keys(statsObj).forEach(item => {
                        statsObj[item] = {...statsObj[item], value: response[item]}
                    })
                    setStats(statsObj)
                }
            } catch (e) {
            }
        }
        if (playerId) {
            getPlayerStats(playerId)
        }
    }, [playerId])

    return <div>
        <div className="players__stats__items">
            {
                Object.keys(stats)?.map(idx => {
                    return <StatsItem key ={idx} match={stats[idx]}/>
                })
            }
        </div>
    </div>
};


const StatsItem = ({match: item}) => {
    return <div className="stats__block__item">
        <span className="stats__block__item__title">{item.title}</span>
        <span className="value">{item.value}</span>
    </div>
}
