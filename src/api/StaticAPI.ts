import {instance} from './API'
import {PlayerPosition} from "../../types/player";

export const StaticAPI = {
    getCities() {
        return instance.get("cities").then(res => res.data)
    },
    getPlayerPositions() {
        return instance.get<PlayerPosition[]>("player-positions").then(res => res.data)
    },
}