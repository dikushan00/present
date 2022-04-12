import React from 'react';
import {TeamMatchesTable} from "../../TeamMatchesTable/TeamMatchesTable";
import {Match, TeamMatchType} from "../../../../types/match";
import {getTeamSide} from "../../../utils/getTeamSide";
import {PlayerAPI} from "../../../api/PlayerAPI";

type Props = {
    playerId: number
}
export const PlayerLastGames:React.FC<Props> = ({playerId}) => {

    const [data, setData]  =  React.useState<TeamMatchType[] | null>(null)
    React.useEffect(() => {
        const getPlayerMatches = async (team_id: number) => {
            try {
                let response = team_id && await PlayerAPI.getPlayerMatchHistory(team_id)
                if (response) {
                    let data = response?.matches?.map((item: Match) => {
                        let side = getTeamSide(team_id, item)
                        return {...item, result: side.result}
                    })
                    data && setData(data)
                }
            } catch (e) {
            }
        }
        if (playerId) {
            getPlayerMatches(playerId)
        }
    }, [playerId])

    return <div>
        <div className="title__wrapper">
            <h1 className="secondary">Последние игры</h1>
        </div>
        <TeamMatchesTable data={data}  />
    </div>
};

