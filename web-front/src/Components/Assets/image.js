import React from 'react';
import styled from 'styled-components';

export const FullWidthImageStyle = styled.img`
    width:100%;
    height:100%;
    border-radius:8px;
    object-fit:cover;
    aspect-ratio:${props => props.aspect};
    @media (max-width:500px){
        object-fit: scale-down;
    }
`

export function FullWidthImage (props) {
    return <FullWidthImageStyle aspect={props.aspect} objectPosition={props.objectPosition} src={props.src}>
    </FullWidthImageStyle>
}

export const CustomSizeImageStyle = styled.img`
    width:${props => props.width};
    height:${props => props.height};
    object-fit:${props => props.object_fit};
    object-position:${props => props.object_position};
    border-radius:8px;
`

export function CustomSizeImage (props) {
    return <CustomSizeImageStyle src={props.src} height={props.height} width={props.width} object_fit={props.object_fit} object_position={props.object_position}>
    </CustomSizeImageStyle>
}

export const MaxSizeImageStyle = styled.img`
    max-width:${props => props.width};
    max-height:${props => props.height};
    width:100%;
    border-radius:8px;
`

export function MaxSizeImage (props) {
    return <MaxSizeImageStyle src={props.src} height={props.height} width={props.width} object_fit={props.object_fit} object_position={props.object_position}>
    </MaxSizeImageStyle>
}

export const MainBackgroundStyle = styled.img`
    width: 100%;

    @media (max-width: 580px) {
        width: 100vw;
        object-fit: cover;
        object-position: center;
        height: 50vh;
    } 
`

export function MainBackground (props) {
    return <MainBackgroundStyle src={props.src} height={props.height} width={props.width} object_fit={props.object_fit} object_position={props.object_position}>
    </MainBackgroundStyle>
}

export const StaticBackgroundStyle = styled.img`
    width: 100%;
    position:fixed;
    z-index:-1;
    top:0;
    left:0;
`

export function StaticBackground (props) {
    return <StaticBackgroundStyle src={props.src} height={props.height} width={props.width} object_fit={props.object_fit} object_position={props.object_position}>
    </StaticBackgroundStyle>
}

export const DivBackgroundStyle = styled.img`
    width: 100%;
    height:100%;
    position:absolute;
    z-index:1;
`

export function DivBackground (props) {
    return <DivBackgroundStyle src={props.src}>
        {props.children}
    </DivBackgroundStyle>
}

export const ImageDivStyle = styled.div`
    width: 100%;
    position:fixed;
    z-index:-1;
    top:0;
    left:0;
`

export function ImageDiv (props) {
    return <ImageDivStyle height={props.height} width={props.width}>

    </ImageDivStyle>
}
