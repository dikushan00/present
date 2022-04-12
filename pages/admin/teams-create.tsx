import React from 'react';
import {AdminLayout} from "../../src/components/Admin/Admin";
import styles from "../../src/components/Admin/Admin.module.sass";
import {CreateTeam} from "../../src/components/Teams/CreateTeam/CreateTeam";

const TeamCreate = () => {
    return (
        <AdminLayout>
            <CreateTeam admin className={styles.admin__contentChild}/>
        </AdminLayout>
    );
};

export default TeamCreate;
