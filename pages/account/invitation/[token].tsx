import React from "react";
import {MainLayout} from "../../../src/components/Layouts/MainLayout";
import {PlayerAPI} from "../../../src/api/PlayerAPI";
import {MainPage} from "../../../src/components/pages/Main/MainPage";

const Invitation: React.FC<{ status: boolean }> = ({status}) => {
    return <MainLayout title={"Приглашение"}>
        <MainPage status={status}/>
    </MainLayout>
}

export default Invitation;

export async function getServerSideProps({params}) {
    try {
        if (params.token) {
            let response = await PlayerAPI.acceptInvitation(params.token)
            if (response.status) {
                return {props: {status: true}}
            } else
                return {props: {status: false}}
        }
    } catch (e) {
        return {props: {status: false}}
    }
}
