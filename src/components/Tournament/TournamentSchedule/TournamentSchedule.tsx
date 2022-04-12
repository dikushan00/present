import React from 'react';
import {MatchesSchedule, MatchesScheduleData} from "../../Matches/MatchesSchedule/MatchesSchedule";
import {CompetitionData} from "../../../../types/match";

type Props = {
    data: CompetitionData
    admin?: boolean
}
export const TournamentSchedule: React.FC<Props> = ({data, admin}) => {

    const [scheduleData, setScheduleData] = React.useState<MatchesScheduleData[] | null>(null)
    React.useEffect(() => {
        if (data) {
            let newData: MatchesScheduleData[] = []
            if (data.matchesSort?.eighth) {
                newData.push({
                    round: {name: "1/8"},
                    matches: data.matchesSort.eighth
                })
            }
            if (data.matchesSort?.quarter) {
                newData.push({
                    round: {name: "1/4"},
                    matches: data.matchesSort.quarter
                })
            }
            if (data.matchesSort?.semi) {
                newData.push({
                    round: {name: "1/2"},
                    matches: data.matchesSort.semi
                })
            }
            if (data.matchesSort?.final) {
                newData.push({
                    round: {name: "Финал"},
                    matches: [data.matchesSort.final]
                })
            }
            newData && setScheduleData(newData)
        }
    }, [data])

    return (
        <div>
            <h2>Расписание матчей</h2>
            <MatchesSchedule admin = {admin} data={scheduleData}/>
        </div>
    );
}
