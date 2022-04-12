import React from 'react';
import {CreatePlayer} from "../../src/components/Admin/CreatePlayer/CreatePlayer";
import {AdminLayout} from "../../src/components/Admin/Admin";

const PlayerCreate = () => {
    return (
        <AdminLayout>
            <CreatePlayer />
        </AdminLayout>
    );
};

export default PlayerCreate;
