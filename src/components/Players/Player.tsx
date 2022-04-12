import {PlayerInfoType} from "../../../types/player";
import React from "react";
import PlayerInfo from "../pages/Player/PlayerInfo";
import {PlayerStats} from "../pages/Player/PlayerStats";
import {PlayerLastGames} from "../pages/Player/PlayerLastGames";

type PropsTypes = {
    player?: PlayerInfoType
    id?: number
    isCabinetPage?: boolean
}
export const Player: React.FC<PropsTypes> = ({player, isCabinetPage}) => {

    if (!player)
        return <div className="title__wrapper">
            <h1 className="main">Игрок не найден</h1>
        </div>
    return <div>
        <PlayerInfo isCabinetPage={isCabinetPage} player={player}/>
        <div className="team__content">
            <PlayerStats playerId={player?.id}/>
            <PlayerLastGames playerId={player?.id}/>
        </div>
    </div>
}