import React from "react";
import {PlaygroundsAPI} from "../../src/api/PlaygroundsAPI";
import {Stadium} from "../../types/teams";
import {MainLayout} from "../../src/components/Layouts/MainLayout";
import {Playgrounds} from "../../src/components/Playgrounds/Playgrounds";

type Props = { playgrounds: Stadium[] }

const PlaygroundsPage: React.FC<Props> = ({playgrounds}) => {

    return <MainLayout title={"Площадки"}>
        <Playgrounds playgrounds={playgrounds} />
    </MainLayout>
}

export async function getServerSideProps() {
    try {
        const playgrounds = await PlaygroundsAPI.getPlaygrounds()
        return {props: {playgrounds}}
    } catch (e) {
        return {props: {}}
    }
}

export default PlaygroundsPage