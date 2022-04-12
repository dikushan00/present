import React from 'react';
import {MainLayout} from "../../../src/components/Layouts/MainLayout";
import {Match} from "../../../types/match";
import {MatchAPI} from "../../../src/api/MatchAPI";
import {MatchResultsEdit} from "../../../src/components/Matches/MatchResultsEdit/MatchResultsEdit";

type Props = {
    match: Match | null
}

const ResultsEdit: React.FC<Props> = ({match}) => {

    return <MainLayout title={"Результаты матча"} isAuthRequired>
        <MatchResultsEdit match={match} />
    </MainLayout>
};

export default ResultsEdit;

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
