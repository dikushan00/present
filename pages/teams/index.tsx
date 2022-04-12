import React from 'react';
import {Teams} from "../../src/components/Teams/Teams";
import {MainLayout} from "../../src/components/Layouts/MainLayout";

const TeamsPage = () => {
    return (
        <MainLayout title={"Команды"}>
            <Teams pagination showActions />
        </MainLayout>
    );
};

export default TeamsPage;