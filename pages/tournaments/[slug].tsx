import React from 'react';
import {MainLayout} from "../../src/components/Layouts/MainLayout";
import {TournamentAPI} from "../../src/api/TournamentAPI";
import {Competition, Match} from "../../types/match";
import {Tournament} from "../../src/components/Tournament/Tournament";

type Props = {
    tournament: Competition
    matches: Match[]
}
const TournamentPage: React.FC<Props> = ({tournament, matches}) => {

    return (
        <MainLayout title={tournament?.title || "Турнир"}>
            <Tournament tournament={tournament} matches={matches}/>
        </MainLayout>
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
