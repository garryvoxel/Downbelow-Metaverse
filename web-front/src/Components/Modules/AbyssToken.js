import React from 'react';
import styled from 'styled-components';
import { ContainerColumnsCenter, BasicContainer } from '../Components/Containers';
import { SecondContentTitle } from '../Assets/typography';
import { SubTitle, FeatureTitle, Paragraph } from '../Assets/typography';
import { MaxSizeImage } from '../Assets/image';

const TokenSectionDiv = styled.div`
    & span {
        font-size:15px;
    }

    & img{
        aspect-ratio:1/1;
    }

    @media (max-width: 612px) {
        & h4{
            font-size:5vw;
        }
        & span{
            font-size:3.5vw;
        }
    }  
`

export function AbyssToken (props) {
    return <TokenSectionDiv id={props.id}>
        <BasicContainer variant="primary">
            <ContainerColumnsCenter columns="2" marginTop="64px">
                <div>
                    <SecondContentTitle id="token" variant="primary">$ABYSS TOKEN</SecondContentTitle>
                    <SubTitle>Official contract address</SubTitle>
                    <FeatureTitle>0x73ec9d20c6a1e8cf34e7e446d76aeb742eb6ae28</FeatureTitle>
                    <Paragraph>
                        <span>$ABYSS is a BEP-20 token used to invest in game assets, to earn through holder position, and to enjoy Down Below’s ecosystem. Be careful with scam contracts!</span><br></br>
                        <br></br>
                        <span>You can now trade $ABYSS on Pancakeswap. Token address: 0x73ec9d20c6a1e8cf34e7e446d76aeb742eb6ae28</span>
                        <br></br>
                        <br></br>
                        <span>Game is already up and running. Just create your account, login, download the launcher and enjoy!</span>
                    </Paragraph>
                </div>
                <MaxSizeImage width="350px" src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Portraits/pt5.png"></MaxSizeImage>
            </ContainerColumnsCenter>
        </BasicContainer>
    </TokenSectionDiv>
}




