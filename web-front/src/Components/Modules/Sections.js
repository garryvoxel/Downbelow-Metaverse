import React from 'react';
import styled from 'styled-components';
import { ContainerColumns, BasicContainer } from '../Components/Containers';
import { SecondSectionTitle } from '../Assets/typography';

export function TwoCollumnsImage (props) {
    return <BasicContainer variant={props.variant}>
        <ContainerColumns columns="2" marginTop="64px">
            {props.children}
        </ContainerColumns>
    </BasicContainer>
}

export function ThreeImagesGallery (props) {
    return <BasicContainer id={props.id} variant={props.variant}>
            <SecondSectionTitle id="game" variant={props.titleVariant}>{props.title}</SecondSectionTitle>
            <ContainerColumns columns="3" align="flex-start">
                {props.children}
            </ContainerColumns>
</BasicContainer>
}



