import React, {CSSProperties} from 'react'
import styled from "styled-components";

interface PropsType extends React.HTMLAttributes<HTMLDivElement> {
    style: CSSProperties
    addClass?: string
    passRef?: React.Ref<any>
}

/**
 * custom popup
 */

export const CustomPopup: React.FC<PropsType> = ({style, children, addClass = "", passRef}, props) => {
    return <Popup ref={passRef} {...props} className={addClass}>
        {children}
    </Popup>
}

const Popup = styled.div`
  position: absolute;
  top: 27px;
  left: 0;
  width: auto;
  min-width: 120px;
  background-color: #fff;
  padding: 5px 0;
  border-radius: 3px;
  box-shadow: 0 5px 15px -10px rgba(0, 0, 0, 0.25);
  z-index: 1000;
  display: flex;
  flex-direction: column;


  .custom_popup_item {
    padding: 8px 20px;
    display: block;
  }

  .popup_title {
    padding: 15px 0;
    border-bottom: 1px solid #ccc;
  }

  .popup_close {
    font-size: 19px;
    position: absolute;
    right: 23px;
    top: 19px;
    cursor: pointer;
  }

  .popup_close:hover {
    color: #ccc;
  }
`

