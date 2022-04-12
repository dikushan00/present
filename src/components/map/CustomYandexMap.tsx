import 'react-yandex-maps';
import {YMaps, Map, Placemark} from 'react-yandex-maps';
import React from "react";


let defaultCoordinates = [53.28103, 69.396101]
type Props = {
    coordinates: [number, number]
}
export const CustomYandexMap: React.FC<Props> = ({children, coordinates}) => (
    <YMaps>
        <Map style={{width: "100%", height: "100%"}} defaultState={{center: coordinates || defaultCoordinates, zoom: 15}}>
            <Placemark defaultGeometry={coordinates || defaultCoordinates}/>
        </Map>
        {children}
    </YMaps>
);