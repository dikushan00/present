import React from 'react';
import {AdminLayout} from "../../../src/components/Admin/Admin";
import {Teams} from "../../../src/components/Teams/Teams";

const TeamsPage = () => {
    return (
        <AdminLayout>
            <Teams pagination={true} limit={20}/>
        </AdminLayout>
    );
};

export default TeamsPage;
