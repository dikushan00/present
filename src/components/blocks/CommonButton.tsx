import styled from "styled-components"

export const MainButton = styled.button`
  background: #C74171;
  color: #fff;
  padding: 8px 13px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: none;
  outline: none;

  &:hover {
    background: #db3c76;
    transition: .3s;
  }
`

export const CardButton = styled(MainButton)`
  margin: 0 auto;
  width: 100%;
  border-radius: 0 0 5px 5px;
  padding: 10px 0;
  text-align: center;
  display: flex;
  align-items: center;
`
export const PlaygroundButton = styled(MainButton)`
  margin-top: 25px;
`