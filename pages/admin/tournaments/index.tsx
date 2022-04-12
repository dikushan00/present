import React from 'react';
import {Tournaments} from "../../../src/components/Timetable/Tournaments";
import {AdminLayout} from "../../../src/components/Admin/Admin";

const TournamentsPage = () => {
    return (
        <AdminLayout>
            <Tournaments />
        </AdminLayout>
    );
};

export default TournamentsPage;
