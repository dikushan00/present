import {TeamAPI} from "../api/TeamAPI";
import {TeamType} from "../../types/teams";


interface TeamValue {
    label: string;
    value: string | number;
    disabled?: boolean
}
export const fetchTeamsList = async (name: string): Promise<TeamValue[]> => {
    if (name.length > 2) {
        try {
            return TeamAPI.findTeam(name)
                .then(body =>
                    body.results.map(
                        (team: TeamType) => ({
                            label: team.name,
                            value: team.id
                        }),
                    ),
                ).catch(() => [])

        } catch (e) {
        }
    }
}