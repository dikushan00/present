import React from 'react';
import {PlayerDataType} from "../../../types/player";

type Props = {
    players: PlayerDataType[]
    home_team_id: number
    away_team_id: number
}
export const MatchLineup: React.FC<Props> = ({players, home_team_id, away_team_id}) => {

    const [lineup, setLineup] = React.useState<{ home: PlayerDataType, away: PlayerDataType }[] | null>(null)

    React.useEffect(() => {
        if (!!players?.length && home_team_id && away_team_id) {
            let lineup = [...players]
            let new_lineup = []
            let lineupLength = lineup.length
            let homePlayersCount = lineup.filter(item => item.team_id === home_team_id).length
            let awayPlayersCount = lineupLength - homePlayersCount
            lineupLength = homePlayersCount > awayPlayersCount ? homePlayersCount : awayPlayersCount
            for (let i = 0; i < lineupLength; i++) {
                let home_player = lineup.find(item => item.team_id === home_team_id)
                let away_player = lineup.find(item => item.team_id === away_team_id)
                lineup = lineup.filter(item => item.id !== home_player?.id && item.id !== away_player?.id)
                new_lineup.push({home: home_player, away: away_player})
            }
            setLineup(new_lineup)
        }
    }, [players, home_team_id, away_team_id])

    return <div className={"match__lineup"}>
        {
            lineup?.map(item => {

                return <div className={"match__lineup__item"}>
                    {
                        item.home &&
                        <p className={"bold"}>{(item?.home?.number || "") + " " + item?.home?.last_name + " " + item.home?.first_name}</p>
                    }
                    {
                        item.away &&
                        <p className={"bold"}>{item.away?.last_name + " " + item.away?.first_name + " " + (item?.away?.number || "")}</p>
                    }
                </div>

            })
        }
    </div>
}
