import React from 'react';
import {TournamentAPI} from "../../../api/TournamentAPI";
import {TeamsDataSource, TeamType} from "../../../../types/teams";
import {TeamsNamesTable} from "../../Teams/TeamsNamesTable";

type Props = {
    slug: string
    fetchData?: boolean
    teams?: TeamsDataSource[]
}
export const TournamentTeams: React.FC<Props> = ({slug, fetchData = true, teams}) => {

    const [isFetching, setIsFetching] = React.useState<boolean>(false)
    const [data, setData] = React.useState<TeamsDataSource[] | null>(null)

    React.useEffect(() => {
        const getCompetitionTeams = async () => {
            try {
                setIsFetching(true)
                let teams = slug && await TournamentAPI.getTournamentTeams(slug as string)
                setIsFetching(false)
                if (teams) {
                    let data = teams?.map(item => ({...item?.team, key: item?.team.id, requested: false}))
                    setData(data)
                }
            } catch (e) {
                setIsFetching(false)
            }
        }
        if (fetchData)
            getCompetitionTeams()
    }, [fetchData])


    return <div>
        <h1>Количество - {data?.length || teams?.length}</h1>
        <TeamsNamesTable dataSource={data || teams} isFetching={isFetching}/>
    </div>
}
