import React from 'react';
import {MainLayout} from "../../src/components/Layouts/MainLayout";
import {PlaygroundsAPI} from "../../src/api/PlaygroundsAPI";
import {Stadium} from "../../types/teams";
import {Playground} from "../../src/components/Playgrounds/playground/Playground";

type Props = { playground: Stadium }
const PlaygroundPage: React.FC<Props> = ({playground}) => {

    return <MainLayout title={playground.name || "Площадка"}>
        <Playground playground={playground} />
    </MainLayout>
};

export default PlaygroundPage;

export async function getServerSideProps({params}) {
    try {
        const playground = await PlaygroundsAPI.getPlayground(params.playgroundId)
        return {props: {playground}}
    } catch (e) {
        return {props: {playground: null}}
    }
}
