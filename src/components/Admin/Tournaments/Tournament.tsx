import React from 'react';
import {ImgWrapper} from "../../ImgWrapper";
import {ButtonPencil} from "../../blocks/buttons";
import {Tabs} from "antd";
import {TournamentForm} from "../../Tournament/TournamentsForm";
import {TournamentTeams} from "../../Tournament/TournamentTeams/TournamentTeams";
import {AddTournamentTeam} from "../../Tournament/AddTournamentTeam";
import {TournamentBracketCreate} from "../../Tournament/TournamentBracket/TournamentBracketCreate";
import {TournamentSchedule} from "../../Tournament/TournamentSchedule/TournamentSchedule";
import {useNotification} from "../../../utils/hooks/useNotification";
import {TeamsDataSource} from "../../../../types/teams";
import {Competition, CompetitionData, Match} from "../../../../types/match";
import {getSortedTournamentMatches} from "../../../utils/getSortedTournamentMatches";
import {TournamentAPI} from "../../../api/TournamentAPI";

const {TabPane} = Tabs;

type Props = {
    tournament: Competition
    matches: Match[]
}
export const Tournament: React.FC<Props> = ({tournament, matches}) => {
    const {setErrorNotification} = useNotification()
    const [isLoading, setIsLoading] = React.useState(false)
    const [addTeamsCount, setAddTeamsCount] = React.useState<number | null>(0)
    const [teams, setTeams] = React.useState<TeamsDataSource[] | null>(null)
    const [data, setData] = React.useState<CompetitionData | null>(null)
    const [tournamentState, setTournamentState] = React.useState<Competition | null>(null)

    React.useEffect(() => {
        if (tournament)
            setTournamentState(tournament)
    }, [tournament])

    React.useEffect(() => {
        if (tournament && matches) {
            let {quarter, eighth, semi, final} = getSortedTournamentMatches(matches)
            setData({...tournament, matchesSort: {semi, final, quarter, eighth}})
        }
    }, [tournament, matches])

    const handleClick = () => {
        //@ts-ignore
        document.getElementsByClassName("user__file__input")[0].click()
    }

    React.useEffect(() => {
        const getCompetitionTeams = async () => {
            try {
                let teams = tournament?.name && await TournamentAPI.getTournamentTeams(tournament.name as string)
                if (teams) {
                    let data = teams?.map(item => ({...item?.team, requested: false, key: item?.team.id, value: item?.team.id, label: item?.team?.name}))
                    data && setTeams(data)
                }
            } catch (e) {
            }
        }
        if (tournament)
            getCompetitionTeams()
    }, [tournament, addTeamsCount])

    const onSubmit = async (e) => {
        try {
            let file = e.target.files[0]
            let formdata = new FormData()
            formdata.append('logo', file)
            setIsLoading(true)
            let response = file && await TournamentAPI.updateTournament(tournament?.id, formdata)
            setIsLoading(false)
            if (response && response.logo) {
                setTournamentState(prevState => ({...prevState, logo: response.logo}))
            }
        } catch (e) {
            setIsLoading(false)
            let message = e.response?.data?.message
            message && setErrorNotification(message)
        }
    }
    return <div>
        <h1>Турнир {tournamentState?.title || ""}</h1>
        <div className="team__logo">
            <ImgWrapper defaultSrc={"/img/soccer-ball.png"}
                        src={tournamentState?.logo}
                        alt={"logo"}/>
            <ButtonPencil loader={isLoading} right={"-13px"} onClick={handleClick}/>
            <input onInputCapture={onSubmit} accept="image/jpeg,image/jpg,image/png"
                   className="user__file__input"
                   style={{display: "none"}} type="file"/>
        </div>
        <div>

            <Tabs defaultActiveKey="1">
                <TabPane tab="Информация" key="1">
                    <TournamentForm competitionData={tournamentState} />
                </TabPane>
                <TabPane tab="Команды" key="2">
                    <TournamentTeams fetchData={false} teams = {teams} slug={tournamentState?.name as string} />
                </TabPane>
                <TabPane tab="Добавить команду" key="3">
                    <AddTournamentTeam setAddTeamsCount = {setAddTeamsCount} competitionId={tournamentState?.id} />
                </TabPane>
                <TabPane tab="Сетка" key="4">
                    <TournamentBracketCreate teams = {teams} data={data}/>
                </TabPane>
                <TabPane tab="Расписание" key="5">
                    <TournamentSchedule admin data={data}/>
                </TabPane>
            </Tabs>
        </div>
    </div>;
};
