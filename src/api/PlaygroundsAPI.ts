import {instance} from "./API";
import {Stadium, StadiumFormat, StadiumType} from "../../types/teams";

export const PlaygroundsAPI = {
    getPlaygrounds: () => {
        return instance.get<Stadium[]>("stadiums").then(res => res.data)
    },
    getPlayground: (id: number) => {
        return instance.get<Stadium>(`stadiums/${id}`).then(res => res.data)
    },
    getPlaygroundTypes: () => {
        return instance.get<StadiumType[]>("stadiums-types").then(res => res.data)
    },
    getPlaygroundFormats: () => {
        return instance.get<StadiumFormat[]>("stadiums-formats").then(res => res.data)
    }
}