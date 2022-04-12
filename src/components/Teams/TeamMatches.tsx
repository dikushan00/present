import React from 'react';
import {SelectTypeTitle} from "../styled/playgrounds/components";
import {SelectUI} from "../tools/select";
import {TeamType} from "../../../types/teams";
import {MatchAPI} from "../../api/MatchAPI";
import {Match, TeamMatchType} from "../../../types/match";
import {getTeamSide} from "../../utils/getTeamSide";
import {TeamMatchesTable} from "../TeamMatchesTable/TeamMatchesTable";
import {Pagination} from "antd";
import {PaginationListWrapper, PaginationWrapper} from "../styled/pagination";

type PropsTypes = {
    showFilters?: boolean
    team: TeamType
}

let defaultPageSize = 20
export const TeamMatches: React.FC<PropsTypes> = ({showFilters, team}) => {
    const [teamSelectOptions,] = React.useState([
        {
            id: 2,
            title: "Все",
            value: "all",
            isSelected: true
        }, {
            id: 2,
            title: "Бурлук",
            value: "defence",
            isSelected: false
        }, {
            id: 3,
            title: "Бекет",
            value: "forward",
            isSelected: false
        }])
    const [matchSelectOptions,] = React.useState([
        {
            id: 2,
            title: "Все",
            value: "all",
            isSelected: true
        }, {
            id: 2,
            title: "Сыгранные",
            value: "played",
            isSelected: false
        }, {
            id: 3,
            title: "Будущие",
            value: "play",
            isSelected: false
        }])
    const [, setActiveSelectedTeam] = React.useState(null)
    const [, setActiveSelectedMatch] = React.useState(null)

    const [activePageNumber, setActivePageNumber] = React.useState<number>(1)
    const [maxItemsCount, setMaxItemsCount] = React.useState<number | null>(null)

    const [data, setData] = React.useState<TeamMatchType[] | null>(null)
    React.useEffect(() => {
        const getTeamMatches = async (team_id: number) => {
            try {
                let response = team_id && await MatchAPI.getTeamMatchHistory(team_id, {page: activePageNumber, limit: 20})
                if (response) {
                    setMaxItemsCount(prevState => prevState ? prevState : response.count)
                    let data = response?.rows?.map((item: Match) => {
                        let side = getTeamSide(team_id, item)
                        return {...item, key: item.id, result: side.result}
                    })
                    data && setData(data)
                }
            } catch (e) {
            }
        }
        if (team?.id) {
            getTeamMatches(team?.id)
        }
    }, [team, activePageNumber])

    const onPaginationChange = (page: number) => {
        setActivePageNumber(page)
    }

    return <div className="team__matches">

        {showFilters !== false && <div className="row" style={{padding: "15px 0"}}>
            <div className="filter__item">
                <SelectTypeTitle>Команда</SelectTypeTitle>
                <SelectUI onChange={(active) => setActiveSelectedTeam(active)} options={teamSelectOptions}/>
            </div>
            <div className="filter__item">
                <SelectTypeTitle>Матчи</SelectTypeTitle>
                <SelectUI onChange={(active) => setActiveSelectedMatch(active)} options={matchSelectOptions}/>
            </div>
        </div>}
        <div className="team__matches__content">
            <TeamMatchesTable data={data}/>
            <PaginationWrapper>
                <PaginationListWrapper>
                    <Pagination pageSize={defaultPageSize} current={activePageNumber}
                                defaultPageSize={defaultPageSize}
                                onChange={onPaginationChange} defaultCurrent={activePageNumber}
                                total={maxItemsCount}/>
                </PaginationListWrapper>
            </PaginationWrapper>
        </div>
    </div>
};