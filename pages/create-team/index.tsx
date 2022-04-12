import React from 'react';
import {MainLayout} from "../../src/components/Layouts/MainLayout";
import {CreateTeam} from "../../src/components/Teams/CreateTeam/CreateTeam";

const CreateTeamPage = () => {

    return <MainLayout isAuthRequired title="Создание команды">
        <CreateTeam />
    </MainLayout>
};

export default CreateTeamPage;