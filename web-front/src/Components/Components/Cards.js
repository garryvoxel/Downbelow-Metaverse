import React from 'react';
import styled from 'styled-components';
import { ParagraphTitle, Countinuos } from '../Assets/typography';
import { FullWidthImage } from '../Assets/image';
import { FullWidthGif } from '../Assets/video';

export const CardsStyle = styled.div`
    display:grid;

    & img{
        aspect-ratio:16/9;
    }
    
    & h4{
        margin-top:16px;
        margin-bottom:16px;
    }
`

export function Cards (props) {
    return <CardsStyle>
        <FullWidthGif src={props.src}/>
        {props.children}
    </CardsStyle>
}

export function CharacterCard (props) {
    return <img src={props.src} alt={props.alt}/>
}
