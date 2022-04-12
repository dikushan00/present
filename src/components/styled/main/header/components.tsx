import styled from "styled-components";

export const HeaderLink = styled.a`
  font-weight: 500;
  margin-left: 35px;
  transition: all .3s;

  &:hover {
    color: #e75d55
  }

  @media screen and (max-width: 991px) {
    margin-left: 0;
  }
`