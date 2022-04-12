import React, {useState} from "react";
import styled from "styled-components";
import {useOutsideAlerter} from "../../utils/hooks/useOutsideClick"

type Props = {
    options: any[]
    onChange: (n: any) => void
}
export const SelectUI: React.FC<Props> = ({
                                              options: initialOptions,
                                              onChange
                                          }) => {
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [options, setOptions] = React.useState([])

    React.useEffect(() => {
        if(initialOptions)
            setOptions(initialOptions)
    }, [initialOptions])

    const selectRef = React.useRef(null)
    useOutsideAlerter(selectRef, setIsSelectMode)

    const setActiveOption = (value) => {
        setOptions(prevState => {
            return prevState.map(item => {
                if (item.value === value) {
                    onChange && onChange(item)
                    return {...item, isSelected: true}
                }
                return {...item, isSelected: false}
            })
        })
        setIsSelectMode(false)
    };

    return <SelectPositionWrapper ref={selectRef}>
        <div className="select-wrapper">
            <Select className="select"
                    onClick={() => setIsSelectMode(state => !state)}>
                {options.map((item, index) => {
                    return item.isSelected && <span key={index}> {item.title}</span>;
                })}
                <SelectArrow className="select_arrow"/>
            </Select>
            {
                isSelectMode && <ul className="select_list">
                    {
                        options.map((item, index) =>
                            <li onClick={() => setActiveOption(item.value)} className={`select_item item_link`}
                                key={index}>{item.title}</li>
                        )
                    }
                </ul>
            }
        </div>
    </SelectPositionWrapper>
};

const SelectArrow = styled.span`
  background-image: url("/img/caretDown.svg");
  background-repeat: no-repeat;
  width: ${props => props.isSmall ? "16px" : "22px"};
  height: ${props => props.isSmall ? "11px" : "13px"};
  opacity: ${props => props.isSmall ? ".5" : "1"};
  margin-top: ${props => props.isSmall ? "2px" : "0"};
  margin-left: 10px;
  background-size: contain;
  right: 10px;
  top: 22px;
  cursor: pointer;
  transition: .1s;
  border-radius: 8px;

  &.flip {
    transform: rotate(180deg);
  }
`

const SelectPositionWrapper = styled.div`
  position: relative;
  margin: 9px 0;

  @media screen and (max-width: 991px) {
    min-width: 140px;
  }
  @media screen and (max-width: 576px) {
    width: 90%;
  }
`

const Select = styled.div`
  border: none;
  display: flex;
  background: var(--white-color);
  align-items: center;
  justify-content: space-between;
  text-align: center;
  appearance: none;
  position: relative;
  list-style: none;
  width: 100%;

  @media screen and (max-width: 576px) {
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
  }
`
