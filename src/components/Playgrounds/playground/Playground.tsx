import React from 'react';
import {useSelector} from "react-redux";
import {MaterialWrapper, TitleH2} from "../../styled/main/components";
import {Stadium} from "../../../../types/teams";
import {getPlaygroundsTypes} from "../../../redux/playgrounds_selector";
import {BlockRow, Row} from "../../blocks/components";
import {ImgWrapper} from "../../ImgWrapper";
import {PlaygroundButton} from "../../blocks/CommonButton";
import {CustomYandexMap} from "../../map/CustomYandexMap";
import {BookingPlaceModal} from "./BookingPlaceModal";
import {PlaygroundsAPI} from "../../../api/PlaygroundsAPI";

type Props = { playground: Stadium }
export const Playground: React.FC<Props> = ({playground}) => {

    const [isBookingMode, setIsBookingMode] = React.useState(false);
    const [scheduleData, setScheduleData] = React.useState<any[]>(null);
    const playgroundTypes = useSelector(getPlaygroundsTypes)

    const handleCloseModal = () => setIsBookingMode(false)

    const handleEnableBookingMode = () => setIsBookingMode(true)

    return  <MaterialWrapper>
        <Row>
            <div className="col-md-4">
                <ImgWrapper className={"playground__avatar"} src={playground.avatar} defaultSrc={"/img/default-stadium-logo.jpg"}
                            alt={"playground"}/>
            </div>
            <div className="col-md-6">
                <TitleH2>{playground.name}</TitleH2>
                <p className={"bold"}>{(playground.stadium_type?.title || "") + ", " + (playground.stadium_format?.name || "")}</p>
                <PlaygroundButton className="disabled" disabled onClick={handleEnableBookingMode}>Записаться</PlaygroundButton>
            </div>
        </Row>
        <BlockRow>
            <TitleH2>Местонахождение площадки</TitleH2>
            <h3>{playground?.address || ""}</h3>
            <BlockRow style={{height: "250px"}}>
                <CustomYandexMap coordinates = {playground?.coordinates}/>
            </BlockRow>
        </BlockRow>
        <BlockRow>
            <TitleH2>Фото с площадки</TitleH2>
            {/*<CarouselWrapper>*/}
            {/*    <Carousel>*/}
            {/*        {*/}
            {/*            playground.gallery.map(item => {*/}
            {/*                return <CarouselImg src={item} alt="Playground photo"/>*/}
            {/*            })*/}
            {/*        }*/}
            {/*    </Carousel>*/}
            {/*</CarouselWrapper>*/}
        </BlockRow>

        <BookingPlaceModal data={scheduleData} playground={playground} handleCloseModal={handleCloseModal}
                           isBookingMode={isBookingMode}/>
    </MaterialWrapper>
};

export async function getServerSideProps({params}) {
    try {
        const playground = await PlaygroundsAPI.getPlayground(params.playgroundId)
        return {props: {playground}}
    } catch (e) {
        return {props: {playground: null}}
    }
}
