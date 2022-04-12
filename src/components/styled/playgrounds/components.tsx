import styled from "styled-components";

export const SelectTypeTitle = styled.p`
  color: #363f6c;
  margin: 0
`

export const CarouselWrapper = styled.div`
  width: 500px;
  height: 350px;
  padding: 5px 0
`

export const PlaygroundCardsWrapper = styled.div`
  padding: 0 15px;
  
  @media screen and (max-width: 576px) {
    padding: 0;
  }
`
export const PlaygroundCard = styled.div`
  position: relative;
  height: auto
`
export const PlaygroundImg = styled.img`
  width: 100%;
  border-radius: 4px 4px 0 0;
  height: 50%;
  filter: brightness(80%)
`
export const PlaygroundCardContent = styled.div`
  padding: 10px 15px
`
export const PlaygroundCardTitle = styled.p`
  font-size: 16px;
  font-weight: bold;
`
export const PlaygroundCardDescription = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`

export const PlaygroundCardAddressText = styled.p`
  font-weight: 100;
  margin: 0;
`
export const PlaygroundFilterRow = styled.div`
  padding: 15px 0;

  @media screen and (max-width: 576px) {
    flex-direction: column;
  }
`
export const PlaygroundFilterItem = styled.div`
  margin-right: 15px;
  min-width: 150px;
  
  @media screen and (max-width: 576px) {
    margin-top: 15px;
  }
`