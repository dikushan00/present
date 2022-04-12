import React from 'react';
import {
    Inject,
    ScheduleComponent,
    ScheduleTypecast,
    ViewDirective,
    ViewsDirective,
    Week
} from "@syncfusion/ej2-react-schedule";

import {loadCldr} from '@syncfusion/ej2-base';

loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/ru-KZ/ca-gregorian.json'),
    require('cldr-data/main/ru-KZ/numbers.json'),
    require('cldr-data/main/ru-KZ/timeZoneNames.json')
);

interface PropsType extends ScheduleTypecast{
    onSubmit: (e: any) => void
    data: any
    isEditMode: boolean
}

export const TimetableComponent:React.FC<PropsType> = ({onSubmit, data, isEditMode}) => {
    let {year, month, day} = getToday()
    return <ScheduleComponent
        editorTemplate = {() => <div>content</div>}
        startHour = {"09:00"}
        timeScale={{ enable: true, interval: 60, slotCount: 1 }}
        locale='ru-KZ'
        timeFormat = {"24"}
        actionComplete={onSubmit}
        allowMultiCellSelection = {false}
        allowMultiRowSelection = {false}
        allowMultiDrag = {false}
        readonly = {!isEditMode}
        currentView="Week"
        selectedDate= {new Date(year, month, day)}
        eventSettings={ { dataSource: data } }>
        <ViewsDirective>
            <ViewDirective option='Week'/>
        </ViewsDirective>
        <Inject services={[Week]}/>
    </ScheduleComponent>
};

const getToday = () => {
    let today = new Date().toLocaleDateString().split(".")
    return {
        year: Number(today[2]),
        month: Number(today[1]),
        day: Number(today[0]),
    }
}