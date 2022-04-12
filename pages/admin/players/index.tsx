import React from 'react';
import {Players} from "../../../src/components/Players/Players";
import {AdminLayout} from "../../../src/components/Admin/Admin";

const PlayersPage = () => {
    return (
        <AdminLayout>
            <Players pagination limit={20} />
        </AdminLayout>
    );
};

export default PlayersPage;
