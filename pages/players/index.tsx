import React from 'react';
import {MainLayout} from "../../src/components/Layouts/MainLayout";
import {Players} from "../../src/components/Players/Players";

const PlayersPage: React.FC = () => {
    return (
        <MainLayout title={"Игроки"}>
            <Players pagination/>
        </MainLayout>
    );
};

export default PlayersPage;

