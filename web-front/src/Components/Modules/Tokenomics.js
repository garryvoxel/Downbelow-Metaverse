import React from 'react';
import styled from 'styled-components';
import { BasicContainer, ContainerColumns } from '../Components/Containers';
import { SecondSectionTitle, ListItem } from '../Assets/typography';
import { FullWidthImage } from '../Assets/image';

const TokenomicList = styled.ul`
    list-style-type: square;

    & li{
        margin-top:16px;
    }
`

export function Tokenomics (props){
    return <BasicContainer variant="secondary">
    <SecondSectionTitle id="#lore" variant="primary">TOKENOMICS</SecondSectionTitle>
    <ContainerColumns columns="2" align="center">
        <FullWidthImage src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Info/gh1.png"></FullWidthImage>
        <TokenomicList>
            <ListItem color="#9a00ff">Play-to-earn Rewards</ListItem>
            <ListItem color="#69a84f">Game Development (Founders/Team)</ListItem>
            <ListItem color="#3c78d8">Private/Public Sale</ListItem>
            <ListItem color="#ffc60b">Liquidity Pool</ListItem>
            <ListItem color="#a61c00">Strategic Partnerships</ListItem>
            <ListItem color="#ed7d31">Reserve</ListItem>
            <ListItem color="#a64d79">Marketing</ListItem>
            <ListItem color="#a2c3c8">Airdrop/Community</ListItem>
            <ListItem color="#587276">Investors</ListItem>
        </TokenomicList>
    </ContainerColumns>
</BasicContainer>
}