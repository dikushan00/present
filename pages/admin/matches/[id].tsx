import React from 'react';
import {Match} from "../../../types/match";
import {MatchAPI} from "../../../src/api/MatchAPI";
import {AdminLayout} from "../../../src/components/Admin/Admin";
import {MatchResultsEdit} from "../../../src/components/Matches/MatchResultsEdit/Admin/MatchResultsEdit";

type Props = {
    match: Match | null
}

const MatchResultsEditPage: React.FC<Props> = ({match}) => {

    return <AdminLayout>
        <MatchResultsEdit match={match}/>
    </AdminLayout>
};

export default MatchResultsEditPage;

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
