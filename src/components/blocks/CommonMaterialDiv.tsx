import React from "react";
import styled from "styled-components";

export const CommonMaterialDiv = styled.div`
  padding: ${(props) => props.padding ? props.padding : "10px"};
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 12px 0 #504f4fe3;
  height: 100%;
`;

export const PlaygroundCardWrapper = styled(CommonMaterialDiv)`
  position: relative;
`