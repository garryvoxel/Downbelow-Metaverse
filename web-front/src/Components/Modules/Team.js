import React from 'react';
import styled from 'styled-components';
import { ContainerInlineFlexwrap, BasicContainer } from '../Components/Containers';
import { SubTitle, Support, SecondSectionTitle } from '../Assets/typography';

const TeamGrid = styled.div`
    display:grid;
    grid-template-columns:1fr 1fr 1fr 1fr;
    grid-gap:40px;

    @media (max-width:800px){
        grid-template-columns:1fr 1fr;
    }

    @media (max-width:400px){
        grid-template-columns:1fr;
    }
`

const TeamDiv = styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;

    & h4{
        margin-top:16px;
        margin-bottom:8px;
        text-align:center;
    }

    & p{
        margin-top:0px;
        margin-bottom:0px;
    }
`

const TeamImg = styled.img`
    width:150px;
    height:150px;
    border:6px solid #F1D8B2;
    object-fit:cover;
    border-radius:100%;
`

export function Team (props) {
    return <BasicContainer variant="secondary">
        <SecondSectionTitle variant="primary">TEAM</SecondSectionTitle>
        <TeamGrid marginTop="64px">
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/FernandoLuz.jpg"></TeamImg>
                <SubTitle>Fernando Luz</SubTitle>
                <Support>CEO</Support>
            </TeamDiv>
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/RonaldoJonson.jpeg"></TeamImg>
                <SubTitle>Ronaldo Jonson</SubTitle>
                <Support>CTO</Support>
            </TeamDiv>
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/GiovanniPopulo.jpg"></TeamImg>
                <SubTitle>Giovanni Populo</SubTitle>
                <Support>CFO</Support>
            </TeamDiv>
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/Raul Doldan.jpg"></TeamImg>
                <SubTitle>Raul Doldan</SubTitle>
                <Support>Finance</Support>
            </TeamDiv>
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/DaltonTofoli.jpg"></TeamImg>
                <SubTitle>Dalton Tofoli</SubTitle>
                <Support>Unity Developer</Support>
            </TeamDiv>
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/HenriqueMonteiro.jpeg"></TeamImg>
                <SubTitle>Henrique Monteiro</SubTitle>
                <Support>Unity Developer</Support>
            </TeamDiv>
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/Bruna.jpg"></TeamImg>
                <SubTitle>Bruna Santos</SubTitle>
                <Support>Community Manager</Support>
            </TeamDiv>
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/Unit8.jpg"></TeamImg>
                <SubTitle>Unit-8 // Type-6</SubTitle>
                <Support>Art Director</Support>
            </TeamDiv> 
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/RodrigoPereira.jpg"></TeamImg>
                <SubTitle>Rodrigo Silva</SubTitle>
                <Support>Backend Developer</Support>
            </TeamDiv>
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/EduardoCucick.jpeg"></TeamImg>
                <SubTitle>Eduardo Cucick</SubTitle>
                <Support>Game Producer/Designer</Support>
            </TeamDiv>
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/AmandaReznor.jpg"></TeamImg>
                <SubTitle>Amanda Reznor</SubTitle>
                <Support>Writer</Support>
            </TeamDiv>
            <TeamDiv>
                <TeamImg src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Team/JC.jpeg"></TeamImg>
                <SubTitle>JC</SubTitle>
                <Support>Character/Enviroment Artist</Support>
            </TeamDiv>
        </TeamGrid>
    </BasicContainer>
}




