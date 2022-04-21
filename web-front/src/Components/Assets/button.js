import React from 'react';
import styled from 'styled-components';

import { ParagraphLarge } from './typography';

const ButtonBase = styled.button`
    padding:16px;
    background-color: ${props => props.theme.colors.primary};
    height:100px;
    width:200px;
    margin-top:40px;
    border:none;
    &:hover {
       
    }

    @media (max-width: 768px) {
        
    }

    @media (max-width: 480px) {
        width:100%;
    }
`

export function Button (props) {
    return <ButtonBase variant={props.InputVariant} color={props.buttonColor} onClick={props.handleClick}>
        {props.children}
    </ButtonBase>
}

export function ButtonIcon (props) {
    return <ButtonBase variant={props.InputVariant} onClick={props.handleClick}>
        {props.icon}
    </ButtonBase>
}

const ButtonSmallStyle = styled.button`
    width:100%;
    padding:16px 64px;
    margin-top:20px;
    background-color: ${props => props.theme.colors.primary};
    border:none;

    &:hover{
        background-color: ${props => props.theme.colors.primary};
    }
`

export function ButtonSmall (props) {
    return <ButtonSmallStyle onClick={props.handleClick}>
        {props.children}
    </ButtonSmallStyle>
}

const PlayButtonStyle = styled.button`
    background-color: darkred;
    color: white;
    font-weight: 600;
    padding: 10px 30px;
    margin-top: 10px;
    border-style: none;
    margin-left:60px;
    transform: scale(1);
    transition: 0.4s;
    border-radius: 8px;

    & a{
        text-decoration: 
        none;color:inherit;
        font-size: inherit;
        font-family: inherit;
    }

    &:hover {
        background-color: ${props => props.theme.colors.containers.white};
        transform: scale(1.02);
        transition: 0.4s;
        cursor:pointer;

        & h4{
            color:${props => props.theme.colors.primaryHover};
        }
    }
`

export function PlayButton (props) {
    return <PlayButtonStyle>
        <ParagraphLarge><a href="https://downbelow.io/Login" rel="noreferrer">ACCOUNT</a></ParagraphLarge>
    </PlayButtonStyle>
}

const BackgroundButtonStyle = styled.button`
    background-color:transparent;
    border: none;
    cursor: pointer;
    position:relative;
    display:flex;
    justify-content:space-between;
    align-items:center;

    &:hover {
        filter: brightness(0.85);
    }

    & p{
        color:${props => props.theme.colors.fonts.featured};
        font-size:${props => props.theme.fonts.sizes.subtitle};
        padding: 10px 40px;
    }

    & *{
        z-index:2;
    }
`

const ButtonBackground = styled.img`
    position:absolute;
    width:100%;
    height:100%;
    z-index:1;
`

export function BackgroundButton (props) {
    return <BackgroundButtonStyle width={props.width} onClick={props.handleClick}>
        <ButtonBackground src={props.src}></ButtonBackground>
        <p>{props.children}</p>
    </BackgroundButtonStyle>
}
