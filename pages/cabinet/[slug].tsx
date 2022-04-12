import React from 'react';
import {MainLayout} from "../../src/components/Layouts/MainLayout";
import {Cabinet} from "../../src/components/pages/User/Cabinet";

const UserPage = () => {
    return <MainLayout isAuthRequired title={"Личный кабинет"}>
        <Cabinet />
    </MainLayout>
};

export default UserPage
