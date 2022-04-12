import React from 'react';
import {TitleH2} from "../../styled/main/components";
import {TimetableComponent} from "../../Timetable/TimetableComponent";
import {Modal} from "antd";
import {Stadium} from "../../../../types/teams";

interface PropsType {
    playground: Stadium
    handleCloseModal: () => void
    data: any
    isBookingMode: boolean
}

export const BookingPlaceModal: React.FC<PropsType> = ({playground, isBookingMode, handleCloseModal, data}) => {

    const [isEditMode, setIsEditMode] = React.useState(false)
    const onSubmit = () => {

    }

    return <Modal width={"50%"} footer={null} visible={isBookingMode} onCancel={handleCloseModal}>
        <TitleH2>Запись на площадку {playground.name}</TitleH2>
        <h3>Расписание</h3>
        <TimetableComponent onSubmit={onSubmit} data={data} isEditMode={isEditMode}/>
    </Modal>
};
