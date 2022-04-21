import React from 'react';
import styled from 'styled-components';

const LogoStyle = styled.div`
    background-image: url("https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Logos/Logo_main.png");
    width: 229px;
    background-color:#2E2E2E;
    border-radius:8px;
    padding: 0px 8px;
    height: 101px;
    position:absolute;
    top:0px;
    left:${props => props.theme.containers.desktop.half};
    background-repeat: no-repeat;
    background-size: contain;
`

export function MainLogo (props){
    return <LogoStyle>
    </LogoStyle>
}
