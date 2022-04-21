import React from 'react';
import styled from 'styled-components';
import {  SecondSectionTitle, Paragraph, ParagraphTitle, Countinuos } from '../../Assets/typography';
import { CustomSizeImage, FullWidthImage, MainBackground, MaxSizeImage } from '../../Assets/image';
import { VideoBackground } from '../../Assets/video';
import { ContainerColumns, CustomSizedGrid, ContainerRelativeCenter, Cover, ImageTitledContainer, BasicContainer } from '../../Components/Containers';
import { RoadMapModule } from '../../Modules/Roadmap';
import { Cards, CharacterCard } from '../../Components/Cards';
import { ThreeImagesGallery } from '../../Modules/Sections';
import { StayUpdated } from '../../Modules/StayUpdated';
import { AbyssToken } from '../../Modules/AbyssToken';
import { Tokenomics } from '../../Modules/Tokenomics';
import { Carousel } from '../../Components/Carousel';
import { Team } from '../../Modules/Team';

const MainSection = styled.main`
    margin-top:${props => props.theme.height.header};  

    @media (max-width:600px){
        & #characters{
            display:none;
        }
    }
`

const MainTitleStyle = styled.h1`
    font-family:${props => props.theme.fonts.title};
    color:white;
    font-size:${props => props.theme.fonts.sizes.title};
    text-align:center;
`

export function Home (props) {
    return <div>
    <MainSection>
            <Cover> 
                <VideoBackground src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Backgrounds/Video/DownBelow_UltraWide_CustomLow.mp4"></VideoBackground>
            </Cover>
            <ThreeImagesGallery id="game" title="GAME MODES" variant="primary" titleVariant="primary">
                <Cards src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Videos/Portrait_Adventure.mp4">
                    <div>
                        <ParagraphTitle>Adventure Mode</ParagraphTitle>
                        <Countinuos>Lead your expedition down the many levels of the abyss, facing monsters and receiving rewards along the way.</Countinuos>
                    </div>
                </Cards>
                <Cards src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Videos/Portrait_Expedition.mp4">
                    <div>
                        <ParagraphTitle>Idle PVE Mode</ParagraphTitle>
                        <Countinuos>No time to exploring? No problem, send your expedition to some level and follow a report with the results of the incursion.</Countinuos>    
                    </div>
                </Cards>
                <Cards src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Videos/Portrait_pvp.mp4">
                    <div>
                        <ParagraphTitle>Arena PVP Mode</ParagraphTitle>
                        <Countinuos>Hold some elven silver and courage to face your opponents, buy a ticket and take your expedition to fight in the Abyss Arena.</Countinuos>    
                    </div>
                </Cards>
            </ThreeImagesGallery> 
            <BasicContainer  variant="secondary">
                <SecondSectionTitle id="game" variant="primary">BEHOLD THE ABYSS</SecondSectionTitle>
                <CustomSizeImage width="100vw" src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Backgrounds/bg2.png"></CustomSizeImage>
            </BasicContainer>
            <AbyssToken id="token"></AbyssToken>
            <BasicContainer id="lore" variant="secondary">
                <SecondSectionTitle variant="primary">THE ABYSS DOWN BELOW</SecondSectionTitle>
                <ContainerColumns columns="2" align="center">
                    <FullWidthImage aspect="16/9" src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Backgrounds/bg5.png"></FullWidthImage>
                    <div>
                        <Paragraph>
                        Gaia's inhabitants have been talking about a mysterious event the disappearance of the elven realm that
                            ruled the Isle of Lenoriem. No one could come close for years, as the raging sea pushed the boats away,
                            and all you could see was the thick lilac mist covering the area, with no sign of life.
                        </Paragraph>
                        <br/>
                        <Paragraph> 
                            Decades passed, and
                            the toxic cloud was gradually over, as well as the waters softened their raving, allowing new approachers.
                            However, those who land nowadays will be greeted by a devastatated ancient kingdom, entirely
                            absorbed by the earth's depths.
                        </Paragraph>
                        <br/>
                        <Paragraph> 
                            When facing the abyss, it is impossible to avoid the mixture of horror
                            and attraction caused by the traces of the accident, which hover in a trail of relics and questions stuck in
                            the slope. Brave enough to face the descent? Don't waste time. Prepare your expedition and come, 'for
                            the rewards will be drawn fast and low!
                        </Paragraph>
                    </div>
                </ContainerColumns>
            </BasicContainer>
            <BasicContainer id="characters" variant="primary">
                <SecondSectionTitle variant="primary">ADVENTURERS</SecondSectionTitle>
                <Carousel>
                    <CharacterCard src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/characters/archer-card-min.png"></CharacterCard>
                    <CharacterCard src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/characters/knight-card-min.png"></CharacterCard>
                    <CharacterCard src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/characters/mage-card-min.png"></CharacterCard>
                    <CharacterCard src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/characters/brawler-card-min.png"></CharacterCard>
                    <CharacterCard src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/characters/priest-card-min.png"></CharacterCard>
                    <CharacterCard src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/characters/assassin-card-min.png"></CharacterCard>
                </Carousel>
            </BasicContainer>
            <Tokenomics></Tokenomics>
            <RoadMapModule></RoadMapModule>
            <Team></Team>
            <StayUpdated></StayUpdated>
    </MainSection>
    </div>
}