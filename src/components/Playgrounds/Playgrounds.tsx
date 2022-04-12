import React from 'react';
import {MainTitle, MaterialWrapper, SpaceBetweenRows} from "../styled/main/components";
import {
    PlaygroundCard, PlaygroundCardAddressText, PlaygroundCardContent, PlaygroundCardDescription,
    PlaygroundCardsWrapper, PlaygroundCardTitle,
    PlaygroundFilterItem,
    PlaygroundFilterRow, PlaygroundImg,
    SelectTypeTitle
} from "../styled/playgrounds/components";
import {SelectUI} from "../tools/select";
import {PlaygroundCardWrapper} from "../blocks/CommonMaterialDiv";
import Link from "next/link";
import {CardButton} from "../blocks/CommonButton";
import {useDispatch, useSelector} from "react-redux";
import {getPlaygroundsFormats, getPlaygroundsTypes} from "../../redux/playgrounds_selector";
import {Stadium, StadiumFormat, StadiumType} from "../../../types/teams";
import {getPlaygroundsSetup} from "../../redux/playgrounds_reducer";

type Props = { playgrounds: Stadium[] }
export const Playgrounds: React.FC<Props> = ({playgrounds}) => {


    const dispatch = useDispatch()
    const playgroundsTypes = useSelector(getPlaygroundsTypes)
    const playgroundsFormats = useSelector(getPlaygroundsFormats)

    const [activePlaygroundType, setActivePlaygroundType] = React.useState(null as StadiumType | null)
    const [activePlaygroundFormat, setActivePlaygroundFormat] = React.useState(null as StadiumFormat | null)
    const [formatSelectOptions, setFormatSelectOptions] = React.useState([])
    const [typeSelectOptions, setTypeSelectOptions] = React.useState([])
    const [filteredPlaygrounds, setFilteredPlaygrounds] = React.useState<Stadium[]>([])

    React.useEffect(() => {
        dispatch(getPlaygroundsSetup())
    }, [])

    React.useEffect(() => {
        typeSelectOptions && setActivePlaygroundType(typeSelectOptions[0])
    }, [typeSelectOptions])

    React.useEffect(() => {
        formatSelectOptions && setActivePlaygroundFormat(formatSelectOptions[0])
    }, [formatSelectOptions])

    React.useEffect(() => {
        if (activePlaygroundType && activePlaygroundFormat && playgrounds) {
            let filtered = playgrounds.filter(item => {
                if(activePlaygroundType.name === "all" || activePlaygroundFormat.name === "all")
                    return true
                if (activePlaygroundType?.id !== item.stadium_type_id) {
                    return  false
                }
                return activePlaygroundFormat?.id === item.stadium_format_id;

            })
            filtered && setFilteredPlaygrounds(filtered)
        }
    }, [playgrounds, activePlaygroundFormat, activePlaygroundType])

    React.useEffect(() => {
        if (!!playgroundsFormats?.length) {
            let defaultOption = {
                id: 0,
                title: "Все",
                name: "all",
                value: "all",
                isSelected: true
            }
            let formats = playgroundsFormats?.map((item) => ({
                ...item,
                title: item.name,
                value: item.name,
                isSelected: false
            })) || []
            setFormatSelectOptions([defaultOption, ...formats])
        }
    }, [playgroundsFormats])

    React.useEffect(() => {
        if (!!playgroundsTypes?.length) {
            let defaultOption = {
                id: 0,
                title: "Все",
                name: "all",
                value: "all",
                isSelected: true
            }
            let types = playgroundsTypes?.map((item) => ({
                ...item,
                title: item.title,
                value: item.name,
                isSelected: false
            })) || []
            setTypeSelectOptions([defaultOption, ...types])
        }
    }, [playgroundsTypes])
    return <MaterialWrapper>
        <MainTitle>Площадки</MainTitle>
        <PlaygroundFilterRow className="row">
            <PlaygroundFilterItem >
                <SelectTypeTitle>Тип площадки</SelectTypeTitle>
                <SelectUI onChange={(active) => setActivePlaygroundType(active)}
                          options={typeSelectOptions}/>
            </PlaygroundFilterItem>
            <PlaygroundFilterItem >
                <SelectTypeTitle>Формат</SelectTypeTitle>
                <SelectUI onChange={(active) => setActivePlaygroundFormat(active)} options={formatSelectOptions}/>
            </PlaygroundFilterItem>
        </PlaygroundFilterRow>
        <PlaygroundCardsWrapper className="row">
            {
                filteredPlaygrounds?.map(item => {
                    return <PlaygroundCard key={item.id} className="col-md-4">
                        <PlaygroundCardWrapper padding={"0"}>
                            <PlaygroundImg src={item.avatar ? process.env.API_URL + item.avatar : "/img/default-stadium-logo.jpg"} alt="field"/>
                            <PlaygroundCardContent>
                                <PlaygroundCardTitle>{item.name}</PlaygroundCardTitle>
                                <PlaygroundCardDescription>
                                    <PlaygroundCardAddressText>{item.address}</PlaygroundCardAddressText>
                                </PlaygroundCardDescription>
                                <SpaceBetweenRows/>
                                {/*<PlaygroundCardDescription>*/}
                                {/*    <PlaygroundCardTextBold>Дата </PlaygroundCardTextBold>*/}
                                {/*    /!*<PlaygroundCardDedicatedText>{item?.freeDate && new Date(item.freeDate).toLocaleString()}</PlaygroundCardDedicatedText>*!/*/}
                                {/*</PlaygroundCardDescription>*/}
                                {/*<PlaygroundCardDescription>*/}
                                {/*    <PlaygroundCardTextBold>Цена </PlaygroundCardTextBold>*/}
                                {/*    /!*<PlaygroundCardDedicatedText>{(item.cost?.value || "-") + " " + (item.cost?.currency || "")}</PlaygroundCardDedicatedText>*!/*/}
                                {/*</PlaygroundCardDescription>*/}
                            </PlaygroundCardContent>
                            <Link href={`/playgrounds/${item.id}`}>
                                <a>
                                    <CardButton>Подробнее</CardButton>
                                </a>
                            </Link>
                        </PlaygroundCardWrapper>
                    </PlaygroundCard>
                })
            }
        </PlaygroundCardsWrapper>
    </MaterialWrapper>
}
