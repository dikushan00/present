import React from 'react';
import CustomTable from "../CustomTable";
import Link from "next/link";
import {ImgWrapper} from "../ImgWrapper";
import {TableLink} from "../styled/main/components";
import {ThemeModeType} from "../../../types/app";
import {TeamsDataSource} from "../../../types/teams";

type Props = {
    isFetching?: boolean
    mode?: ThemeModeType
    dataSource: TeamsDataSource[]
}
export const TeamsNamesTable: React.FC<Props> = ({ mode, isFetching, dataSource}) => {

    let columns = [
        {
            title: 'Команда',
            key: 'name',
            width: "auto",
            render: (row) => {
                return <Link href={`/teams/${row.id}`}><a>
                    <div className="flex normal">
                        <ImgWrapper className="teams__table__logo"
                                    defaultSrc={'/img/default-logo.png'} src={row.logo}
                                    alt={"logo"}/><TableLink>{row.name}</TableLink></div>
                </a></Link>
            },
        }
    ];

    return (
        <div>
            <CustomTable loading={isFetching} mode={mode} dataSource={dataSource} columns={columns}/>
        </div>
    );
};


