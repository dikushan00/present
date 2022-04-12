import React from 'react';
import {AdminLayout} from "../../src/components/Admin/Admin";
import {TournamentCreate} from "../../src/components/Tournament/TournamentCreate/TournamentCreate";

const TournamentCreatePage = () => {
    return (
        <AdminLayout>
            <TournamentCreate />
        </AdminLayout>
    );
};

export default TournamentCreatePage;
