import React from 'react';
import Link from "next/link";
import {TeamMatchType} from "../../../types/match";
import CustomTable from "../CustomTable";
import {getMatchDate} from "../../utils/getMatchDate";

export const TeamMatchesTable = ({data}) => {
    const [columns,] = React.useState([
        {
            title: '',
            key: 'match',
            render: (row: TeamMatchType) => {
                return <div>
                    {
                        <div className="flex">
                            {row.competition?.title}
                            <div className="flex column">
                                <Link href={`/teams/${row.id}`}>
                                    <a>
                                        {row.home_team.name} <span
                                        className="score">{row.home_team_score} : {row.away_team_score} {row.away_team.name}</span>
                                    </a>
                                </Link>
                                <div className="gray date">
                                    <span>{getMatchDate(row?.date)}</span>
                                </div>
                            </div>
                            <div>
                                <span className={`team__matches__result ${row.result}`}>{matchResults[row.result]}</span>
                            </div>
                        </div>
                    }

                </div>
            },
        },
    ])
    return (
        <div>
            <CustomTable dataSource={data} columns={columns}/>
        </div>
    );
};

const matchResults = {
    win: "В",
    draw: "Н",
    defeat: "П",
}
