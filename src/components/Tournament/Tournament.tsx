import {ImgWrapper} from "../ImgWrapper";
import React from "react";
import Link from "next/link";
import {capitalizeFirstLetter} from "../../utils/capitalizeFirstLetter";
import {Tabs} from "antd";
import TournamentBracket from "./TournamentBracket/TournamentBracket";
import {TournamentSchedule} from "./TournamentSchedule/TournamentSchedule";
import {TournamentTeams} from "./TournamentTeams/TournamentTeams";
import {useRouter} from "next/router";
import {Competition, CompetitionData, Match} from "../../../types/match";
import {getSortedTournamentMatches} from "../../utils/getSortedTournamentMatches";

const {TabPane} = Tabs;

type Props = {
    tournament: Competition,
    matches: Match[]
}
export const Tournament: React.FC<Props> = ({tournament, matches}) => {
    const {query} = useRouter()
    const [data, setData] = React.useState<CompetitionData | null>(null)

    React.useEffect(() => {
        if (tournament && matches) {
            let {quarter, eighth, semi, final} = getSortedTournamentMatches(matches)
            setData({...tournament, matchesSort: {semi, final, quarter, eighth}})
        }
    }, [tournament, matches])

    return <div className="block__wrapper">

        <div className="team__info match__info view">
            <div>
                <div className="team__logo">
                    <ImgWrapper src={data?.logo} defaultSrc="/img/soccer-ball.png" alt="soccer-ball"/>
                </div>
            </div>
            <div style={{width: "100%"}}>
                <div className={"flex"}>
                    <div className="title__wrapper">
                        <h1 className="secondary">{data?.title || "Турнир"}</h1>
                    </div>
                </div>
                <div className="team__info__list">
                    {(data?.stadiums?.length || data?.stadium_other) && <div>
                        <span className="team__info__title">Место проведения</span>
                        <p className={"flex normal"}>
                            {
                                data.stadiums ? <><span className="bold">
                                            {
                                                data.stadiums.map((item, i) => {
                                                    return <React.Fragment key={item.id}>{i > 0 && <span>,&nbsp;</span>}
                                                        <span className="bold">
                                                <Link href={`/playgrounds/${item.id}`}><a>{item?.name}</a></Link>
                                            </span>
                                                    </React.Fragment>
                                                })
                                            }
                                        {data?.stadium_other && ", " + capitalizeFirstLetter(data?.stadium_other)}</span></>
                                    : <span className="bold">{capitalizeFirstLetter(data?.stadium_other)}</span>
                            }
                        </p>
                    </div>}
                    {data?.stadiumFormat && <div>
                        <span className="team__info__title">Формат</span>
                        <span
                            className="bold">{data?.stadiumFormat?.name}</span>
                    </div>}
                    {data?.stadiumType && <div>
                        <span className="team__info__title">Тип покрытия</span>
                        <span
                            className="bold">{data?.stadiumType?.title}</span>
                    </div>}
                    {data?.timeFormat && <div>
                        <span className="team__info__title">Тайм</span>
                        <span
                            className="bold">{data?.timeFormat?.value} минут</span>
                    </div>}
                </div>
            </div>
        </div>

        <Tabs defaultActiveKey="1">
            <TabPane tab="Сетка" key="1">
                <TournamentBracket data={data}/>
            </TabPane>
            <TabPane tab="Расписание" key="2">
                <TournamentSchedule data={data}/>
            </TabPane>
            <TabPane tab="Команды" key="3">
                <TournamentTeams slug={query.slug as string}/>
            </TabPane>
        </Tabs>
    </div>
}