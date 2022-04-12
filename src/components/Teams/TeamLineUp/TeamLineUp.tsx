import React from 'react';
import {Button, Popconfirm, Popover, TableColumnsType} from "antd";
import Link from "next/link";
import {PlayerInfoType} from "../../../../types/player";
import {TeamType} from "../../../../types/teams";
import {useSelector} from "react-redux";
import {AppStateType} from "../../../redux/store_redux";
import CustomTable from "../../CustomTable";
import {PlayerAvatarTable} from "../../Players/PlayerAvatarTable/PlayerAvatarTable";
import {faCopy} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {copyTextToClipboard} from "../../../utils/copyToClipboard";
import {useNotification} from "../../../utils/hooks/useNotification";
import {TableLink} from "../../styled/main/components";
import styled from "./TeamLineUp.module.sass"

type Props = {
    players: PlayerInfoType[]
    team?: TeamType
    changeCaptain?: (id: number) => void
    leftTeam?: (id: number) => void
    loading?: boolean
}
export const TeamLineUp: React.FC<Props> = ({players,loading, team, changeCaptain, leftTeam}) => {
    const {setSucceedNotification} = useNotification()
    const {player} = useSelector((state: AppStateType) => state.profile)
    const [dataSource, setDataSource] = React.useState(null)

    React.useEffect(() => {
        if (players) {
            let source = players.map(item => ({...item, key: item.id}))
            setDataSource(source)
        }
    }, [players])

    const onCopyClick = (lastName: string, firstName: string, link: string) => {
        if(!link)
            return
        let name = (lastName || "") + " " + (firstName || "")
        copyTextToClipboard(link)
        setSucceedNotification(`Ссылка приглашения ${name} скопирована. Отправтьте ссылку для того чтобы пользователь активировал аккаунт!`)
    }

    const columns: TableColumnsType = [
        {
            title: 'Игрок',
            key: 'name',
            width: "auto",
            render: (row) => {
                return <Link href={`/players/${row.id}`}>
                    <a>
                        <div className="flex normal cursor__pointer">
                            <PlayerAvatarTable src={row?.user?.avatar} />
                            {row.number && <span>{row.number + ". "}</span>}
                            <TableLink>{row?.user.last_name + " " + row?.user.first_name}</TableLink>
                            {team.captain_id === row.id && <span title="Captain" className="teams__captain">C</span>}
                        </div>
                    </a>
                </Link>
            },
        },
    ];
    if(player?.isCaptain) {
        columns.push(
            {
                title: 'Действие',
                key: 'action',
                width: 80,
                render: (row: PlayerInfoType) => {
                    return player.id !== row.id && <div className={"flex center"} style={{height: "100%", width: "100%"}}><Popover
                        content={<ActionPopup loading = {loading} changeCaptain={changeCaptain} leftTeam={leftTeam} playerId={row?.id}/>}
                        title="Выберите действие:" trigger="click">
                        <span className="cursor__pointer"><i className="fas fa-plus"/></span>
                    </Popover></div>
                },
            })
        let isNotActivatedPlayersExist = dataSource?.find(item => item?.user?.activated === false)
        isNotActivatedPlayersExist && columns.push(
            {
                title: '',
                key: 'copy',
                width: 60,
                render: (row: PlayerInfoType) => {
                    let show = (player.id !== row.id && !row.user?.activated)
                    return show && <FontAwesomeIcon title={"Скопировать ссылку"} className={styled.Copy_Link_Icon} onClick={() => onCopyClick(row?.user.last_name, row?.user.first_name, row.user?.invitation_link)} icon={faCopy}/>
                },
            })
    }
    return <div className="line-up">
        <div className="title__wrapper">
            <h1 className="secondary">Заявлены</h1>
        </div>
        <CustomTable dataSource={dataSource} columns={columns}/>
    </div>
};

const ActionPopup = ({playerId, changeCaptain, leftTeam, loading}) => {
    if(!playerId || !changeCaptain || !leftTeam)
        return <></>
    return <div>
        <Popconfirm
            title="Вы действительно хотите поменять капитана?"
            onConfirm={() => !loading && changeCaptain(playerId)}
            okText="Да"
            cancelText="Отмена"
            disabled={loading}
        ><Button>Назначить капитаном</Button></Popconfirm>
        <Popconfirm
            title="Вы действительно хотите поменять капитана?"
            onConfirm={() => !loading && leftTeam(playerId)}
            okText="Да"
            disabled={loading}
            cancelText="Отмена"
        ><Button>Удалить</Button></Popconfirm>
    </div>
}
