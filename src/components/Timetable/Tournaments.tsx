import React, {useEffect, useState} from 'react';
import Link from "next/link";
import {ImgWrapper} from "../ImgWrapper";
import {TableLink} from "../styled/main/components";
import CustomTable from "../CustomTable";
import {TournamentAPI} from "../../api/TournamentAPI";

export const Tournaments = () => {

    const [data, setData] = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    useEffect(() => {
        const getTournaments = async () => {
            try {
                setIsFetching(true)
                let res = await TournamentAPI.getTournaments()
                setIsFetching(false)
                if(res)
                    setData(res)
            } catch (e) {
                setIsFetching(false)}
        }
        getTournaments()
    }, []);


    let columns = [
        {
            title: 'Название',
            key: 'name',
            width: "auto",
            render: (row) => {
                return <Link href={`/admin/tournaments/${row.name}`}><a>
                    <div className="flex normal">
                        <ImgWrapper className="teams__table__logo"
                                    defaultSrc={"/img/soccer-ball.png"} src={row.logo}
                                    alt={"logo"}/><TableLink>{row.title}</TableLink></div>
                </a></Link>
            },
        },
        {
            title: 'Команд',
            key: 'count',
            render: (row) => {
                return <span>{row.max_teams_count || ""}</span>
            }
        },
        {
            title: 'Начало',
            key: 'date',
            render: (row) => {
                return <span>{row.date && new Date(row.date).toLocaleDateString()}</span>
            }
        },
        {
            title: 'Окончание',
            key: 'finish',
            render: (row) => {
                return <span>{row.finish_date && new Date(row.finish_date).toLocaleDateString()}</span>
            }
        }
    ];

    return (
        <div>
            <CustomTable loading={isFetching} dataSource={data} columns={columns}/>
        </div>
    );
};

