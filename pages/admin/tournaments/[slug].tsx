import React from 'react';
import {TournamentAPI} from "../../../src/api/TournamentAPI";
import {Competition, Match} from "../../../types/match";
import {AdminLayout} from "../../../src/components/Admin/Admin";
import {Tournament} from "../../../src/components/Admin/Tournaments/Tournament";

type Props = {
    tournament: Competition
    matches: Match[]
}
const TournamentPage: React.FC<Props> = ({tournament, matches}) => {

    return (
        <AdminLayout>
            <Tournament tournament={tournament} matches={matches}/>
        </AdminLayout>
    );
};

export default TournamentPage;

export async function getServerSideProps({params}) {
    try {
        const tournament = await TournamentAPI.getTournamentBySlug(params.slug as string)
        const matches = await TournamentAPI.getTournamentMatches(params.slug as string)
        return {props: {tournament, matches}}
    } catch (e) {
        return {
            props: {tournament: null}
        }
    }
}
