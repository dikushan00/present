import React from 'react';
import {MainLayout} from "../../src/components/Layouts/MainLayout";
import {MatchAPI} from "../../src/api/MatchAPI";
import {MatchData} from "../../types/match";
import {Match} from "../../src/components/Matches/Match";

interface PropsType {
    match: MatchData | null
}

const MatchPage: React.FC<PropsType> = ({match}) => {

    return <MainLayout title={match.home_team?.name + " - " + match.away_team?.name}>
        <Match match={match}/>
    </MainLayout>
};

export default MatchPage;

export async function getServerSideProps({params}) {
    try {
        let id = Number(params.id)
        let matchResponse = await MatchAPI.getMatch(id)
        return {
            props: {match: matchResponse}
        }
    } catch (e) {
        return {
            props: {match: null}
        }
    }
}