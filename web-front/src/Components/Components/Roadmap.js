import React from 'react';
import styled from 'styled-components';
import { ParagraphTitle, Countinuos, ParagraphLarge } from '../Assets/typography';
import { FullWidthImage } from '../Assets/image';

export const RoadmapCardStyle = styled.article`
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
`
export const Connector = styled.div`
    position:relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & div{
        width: 45px;
        aspect-ratio: 1/1;
        border-radius:100%;
        background-color:${props => props.theme.colors.featured};
    }

    & hr{
        width:100%;
        position:absolute;
        border: 1px solid ${props => props.theme.colors.featured};
    }

    @media (max-width: 990px) {
        display:none;   
    }
`
export const Content = styled.div`
    width:100%;
    padding:20px;
    
    & h4{
        margin-top:5px;
        margin-bottom:22px;
        text-align:center;
        padding:4px 0px;
        border-radius:8px;
        background-color:${props => props.theme.colors.primaryHover};
    }  
`

export const RoadmapCardList = styled.ul`
    & li:before {
        width: 32px;
        background: #F1D8B2;
        border-radius: 100%;
        content: "";
        aspect-ratio: 1/1;
    }

    & li{
        margin-bottom:8px;
        display: grid;
        grid-template-columns:32px 1fr;
        grid-column-gap:12.5px;
        align-items: center;
    }
`

export function RoadmapCard (props) {
    return <RoadmapCardStyle>
        <Connector>
            <div></div>
            <hr></hr>
        </Connector>
        <Content>
            <ParagraphLarge>{props.title}</ParagraphLarge>
            <RoadmapCardList>
                {props.children}
            </RoadmapCardList>
        </Content>
    </RoadmapCardStyle>
}
