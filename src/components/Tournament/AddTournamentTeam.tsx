import React, {useEffect, useState} from 'react';
import {fetchTeamsList} from "../../utils/fetchTeamsList";
import {DebounceSelect} from "../tools/DebounceSelect";
import {Button} from "antd";
import {useNotification} from "../../utils/hooks/useNotification";
import {useHttp} from "../../utils/hooks/http.hook";

type Props = {
    competitionId: number
    setAddTeamsCount?: (n: number) => void
}
export const AddTournamentTeam: React.FC<Props> = ({competitionId, setAddTeamsCount}) => {
    const {request, error, loading} = useHttp()
    const {setErrorNotification, setSucceedNotification} = useNotification()
    const [teams, setTeams] = useState([])

    const onSubmit = async () => {
        if (!competitionId)
            return
        let body = {
            competition_id: competitionId, teams: teams?.map(i => ({team_id: i, competition_id: competitionId}))
        }

        try {
            let res = await request("competitions/add-team", "post", body)
            if (res) {
                setTeams([])
                setSucceedNotification("Команды добавлены!")
                //@ts-ignore
                setAddTeamsCount && setAddTeamsCount(prev => prev + 1)
            }
        } catch (e) {
        }
    }

    useEffect(() => {
        if (error)
            setErrorNotification(error)
    }, [error]);

    return (
        <div>
            <h1>Добавить команды на турнир</h1>
            <p>Команды</p>
            <DebounceSelect
                mode="multiple"
                value={teams}
                placeholder="Поиск команд"
                fetchOptions={fetchTeamsList}
                onChange={newValue => {
                    return setTeams(newValue);
                }}
                style={{width: '100%'}}
            />
            <div className="margin"/>

            <Button disabled={loading || !teams?.length} type={"primary"} onClick={onSubmit}>Добавить</Button>
        </div>
    );
};


