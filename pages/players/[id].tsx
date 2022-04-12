import React from 'react';
import {PlayerAPI} from "../../src/api/PlayerAPI";
import {MainLayout} from "../../src/components/Layouts/MainLayout";
import {PlayerInfoType} from "../../types/player";
import {Player} from "../../src/components/Players/Player";

const PlayerPage = ({player}) => {
    const [playerInfo, setPlayerInfo] = React.useState<PlayerInfoType | null>(null)

    React.useEffect(() => {
        if (player) {
            setPlayerInfo({...player.player, user: player.user})
        }
    }, [player])
    return <MainLayout title={playerInfo?.user?.full_name || "Игрок"}>
        <Player player={playerInfo}/>
    </MainLayout>
}

export default PlayerPage;

export async function getServerSideProps({params}) {
    try {
        const player = await PlayerAPI.getPlayerInfo(params?.id)
        return {props: {player}}

    } catch (e) {
        return {props: {}}
    }
}
