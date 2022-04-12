import {ProfileType} from "../../types/player";
import {PlayerAPI} from "../api/PlayerAPI";


interface UserValue {
    label: string;
    value: string;
    disabled: boolean
}
export const fetchUserList = async (username: string): Promise<UserValue[]> => {
    if (username.length > 4) {
        try {
            return PlayerAPI.findPlayer(username)
                .then(body =>
                    body.results.map(
                        (user: ProfileType) => ({
                            label: `${user.first_name} ${user.last_name}${user?.email ? `(${user.email})` : ""}${!!user.player.team_id ? "(Есть команда)" : ""}`,
                            value: user.id + "$id$" + user.full_name,
                            disabled: !!user.player.team_id
                        }),
                    ),
                ).catch(() => [])

        } catch (e) {
        }
    }
}