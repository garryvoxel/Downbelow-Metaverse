import React from 'react';
import styled from 'styled-components';
import { BasicContainer, ContainerCenter } from '../Components/Containers';
import { CustomSizeImage } from '../Assets/image';
import { SecondSectionTitle, Paragraph } from '../Assets/typography';

const MainContainer = styled.div`
    background-color:red;
    
    @media (max-width: 600px) {
        & a img{
            width:54px;
            height:54px;
        }
    }
`

export function StayUpdated (props) {
    return <MainContainer>
        <BasicContainer variant="primary">
            <SecondSectionTitle variant="primary">STAY UPDATED</SecondSectionTitle>
            <Paragraph>Join our community</Paragraph>
            <ContainerCenter marginTop="18px" marginRight="20px">
                <a href="https://discord.gg/AwnpCZ2sNK" target="_blank"><CustomSizeImage src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Icons/Socials/Discord_large.png" width="104px" height="104px"/></a>
                <a href="https://t.me/DownBelowOfficial" target="_blank"><CustomSizeImage src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Icons/Socials/Telegram_large.png" width="104px" height="104px"/></a>
                <a href="https://www.facebook.com/DownBelowNFT" target="_blank"><CustomSizeImage src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Icons/Socials/Facebook_large.png" width="104px" height="104px"/></a>
                <a href="https://twitter.com/DownBelowNFT" target="_blank"><CustomSizeImage src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Icons/Socials/Twitter_large.png" width="104px" height="104px"/></a>
                <a href="https://www.instagram.com/downbelownft/" target="_blank"><CustomSizeImage src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Icons/Socials/Instagram_large.png" width="104px" height="104px"/></a>
            </ContainerCenter>
        </BasicContainer>
    </MainContainer>
}
