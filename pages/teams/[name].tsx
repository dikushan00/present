import React from 'react';
import {TeamAPI} from "../../src/api/TeamAPI";
import {MainLayout} from "../../src/components/Layouts/MainLayout";
import {TeamType} from "../../types/teams";
import {Team} from "../../src/components/Teams/Team";


type Props = {
    team: TeamType
}

const TeamPage: React.FC<Props> = ({team}) => {
    return <MainLayout title={team?.name || "Команда"}>
        <Team team={team} />
    </MainLayout>
};

export default TeamPage

export async function getServerSideProps({params}) {
    try {
        const team = await TeamAPI.getTeam(params.name)
        return {props: {team}}
    } catch (e) {
        return {
            props: {team: null}
        }
    }
}