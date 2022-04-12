import React from 'react'
import styled from "styled-components";
import {LoaderData} from "../LoaderData/LoaderData";

export const Btn = styled.button`
  border: none;
  font-family: var(--inter-family);
  transition: all .3s ease;
  z-index: 99;
`

const WhiteBtn = styled.button`
  padding: 12px 39px;
  background: var(--vk-white-blue-color);
  box-shadow: 0 3px 11px rgba(113, 118, 240, 0.45);
  border-radius: 12px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.04em;
  color: var(--blue-color);

  &:hover {
    background: var(--vk-white-blue-color);
    box-shadow: 0 3px 34px rgba(113, 118, 240, 0.25);
  }

  &:active {
    box-shadow: 0 3px 11px rgba(113, 118, 240, 0.15);
  }
`
export const ButtonWhite = ({className, onClick, text}) => {
    return (
        <WhiteBtn type="button" onClick={onClick}
                  className={`btn btn-white ${className}`}>{text}</WhiteBtn>
    )
}


const BlueBtn = styled.button`
  padding: 12px 39px;
  background: #5699FF;
  box-shadow: 0 3px 11px rgba(113, 118, 240, 0.45);
  border-radius: 12px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.04em;
  color: #fff;

  &:hover {
    background: #5699FF;
    box-shadow: 0 3px 34px rgba(113, 118, 240, 0.25);
  }

  &:active {
    background: #5699FF;
    box-shadow: 0 3px 11px rgba(113, 118, 240, 0.15);
  }
`
type ButtonBlue = {
    text: string
    onClick?: () => {} | void
    className?: string
}
export const ButtonBlue: React.FC<ButtonBlue> = ({text, onClick, className}) => {
    return (
        <BlueBtn type="button" className={`btn btn-blue ${className}`}
                 onClick={onClick}>{text}</BlueBtn>
    )
}

const StartBtn = styled(Btn)`
  padding: ${props => props.isSmall ? "12px 47px" : "15px 58px"};
  background: #5699FF;
  box-shadow: 0 3px 11px rgba(113, 118, 240, 0.45);
  border-radius: 44px;
  font-style: normal;
  font-weight: bold;
  font-size: ${props => props.isSmall ? "16px" : "18px"};
  line-height: ${props => props.isSmall ? "19px" : "22px"};
  letter-spacing: -0.04em;
  color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 3px 23px rgba(113, 118, 240, 0.63);
  }

  &:active {
    box-shadow: none;
  }

  @media screen and (max-width: 991px) {
    z-index: 1000;
    padding: 13px 51px;
    font-size: 16px;
  }
`

type ButtonStartProps = {
    text: any,
    style?: CSSStyleSheet,
    className?: string,
    type? : string,
    onClick? : () => {},
    isSmall?:boolean,
    isDark?:boolean,
    disabled?:boolean
}
export const ButtonStart: React.FC<ButtonStartProps> = ({
                                            text,
                                            children,
                                            style = {},
                                            className,
                                            onClick,
                                            type,
                                            isSmall = false,
                                            isDark,
                                            disabled = false
                                        }) => {
    return (
        <StartBtn isDark={isDark} style={style} isSmall={isSmall} type={type ? type : 'button'}
                  className={`btn btn-start ${className}`} disabled={disabled}
                  onClick={onClick}>{text || children}</StartBtn>
    )
}

export const ButtonLink = ({text}) => {
    return (
        <button type="button" className="btn btn-link">{text}</button>
    )
}

type ButtonPencilType = {
    onClick: () => void
    openModal?: () => void
    right?: string
    loader?: boolean
}

export const ButtonPencil: React.FC<ButtonPencilType> = ({onClick, openModal, loader, right}) => {
    return (
        <PencilBtn className="pencil-btn" style={{right: right || 0}} type="button" onClick={openModal || onClick}>
            {loader ? <LoaderData dark /> : <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.517 15.1875H3.375C3.22582 15.1875 3.08274 15.1282 2.97725 15.0227C2.87176 14.9172 2.8125 14.7742 2.8125 14.625V11.483C2.8125 11.4091 2.82705 11.336 2.85532 11.2677C2.88359 11.1995 2.92502 11.1375 2.97725 11.0852L11.4148 2.64772C11.5202 2.54223 11.6633 2.48297 11.8125 2.48297C11.9617 2.48297 12.1048 2.54223 12.2102 2.64772L15.3523 5.78973C15.4577 5.89522 15.517 6.03829 15.517 6.18748C15.517 6.33666 15.4577 6.47973 15.3523 6.58522L6.91475 15.0227C6.86252 15.075 6.80051 15.1164 6.73226 15.1447C6.66402 15.1729 6.59087 15.1875 6.517 15.1875Z"
                    stroke="#5DB58B" strokeWidth="1.6875" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.5625 4.5L13.5 8.4375" stroke="#5DB58B" strokeWidth="1.6875" strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M3.09375 10.9688L7.03125 14.9062" stroke="#5DB58B" strokeWidth="1.6875" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>}
        </PencilBtn>
    )
}

const PencilBtn = styled(Btn)`
  width: 36px;
  height: 36px;
  top: -11px;
  right: 0;
  background: var(--white-color);
  box-shadow: var(--second-main-shadow);
  position: absolute;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    box-shadow: 0 4px 18px rgba(93, 181, 139, .18);
  }

  &:active {
    box-shadow: 0 4px 18px rgba(93, 181, 139, .4);
  }
`