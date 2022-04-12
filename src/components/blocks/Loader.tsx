import React from 'react';

type PropsType = {
    allHeight?: boolean
    isSmall?: boolean
}
export const Loader:React.FC<PropsType> = ({allHeight, isSmall}) => {
    return <div className={`loader__wrapper ${isSmall ? "small" : ""}`} style={{height: allHeight === false ? "50%" : "100%"}}>
        <img src="/img/ball__gray.png" className="lds-ring" alt="loader"/>
    </div>
}