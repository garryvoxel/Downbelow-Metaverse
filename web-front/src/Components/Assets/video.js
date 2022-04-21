import React from 'react';
import styled from 'styled-components';

const VideoPlayerStyle = styled.video`
    width:80%;
    aspect-ratio:16/9;
    display:flex;
    align-items:center;
    justify-content:center;
    background: white;
    border-radius: 8px;

    @media (max-width: 768px) {
        
    }

    @media (max-width: 480px) {
        width:100%;
    }  
`

export function VideoPlayer (props) {
    return <VideoPlayerStyle controls='true'>
        <source src={props.src} type="video/mp4"/>
        <source src={props.src} type="video/ogg"/>
        Your browser does not support the video tag.
    </VideoPlayerStyle>
}

const VideoDiv = styled.div`
    width: 100%;
    display: flex;
    justify-content:center;
    align-items:center;
    vertical-align: middle;

    @media (max-width: 480px) {
        width: unset;
        height: 110vw;
        margin-left: 0px;

        & > img{
            position:absolute;
            width:50vw;
            display:
        }
    }  
`

const VideoBackgroundStyle = styled.video`
    width: 100%;
    display: block;
    vertical-align: middle;

    @media (max-width: 800px) {
        width: unset;
        height: 110vw;
        margin-left: -60vw;
    }  
`

const AlignCenterDiv = styled.div`
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    display:flex;
    flex-direction:column;
    align-items:center;

    & > img{
        width:30vw;
    }

    & > a{
        padding:40px;
        background-color:#7e5101;
        text-decoration:none;
        margin-top:40px;
        border-radius:8px;
        color:${props => props.theme.colors.primary};
        font-family:"Balthazar";
        font-size: 2.2vw;
        font-weight:700;
        display:flex;
        align-items:center;
        fill:#EBDFD5;

        & svg{
            margin-right:20px;
        }

        &:hover svg path{
            fill:rebeccapurple !important;
        }
    }

    & > a:hover{
        transition:0.25s;
        background-color:${props => props.theme.colors.containers.white};
        color:${props => props.theme.colors.fonts.red};
    }

    @media (max-width: 800px) {
        & > img{
            position:absolute;
            width: 60vw;
            display:
        }

        & > a{
            padding: 20px;
            margin-top: 40vw;
            font-size: 3vw;
        }
    }  
`

export function VideoBackground (props) {
    return <VideoDiv>
        <VideoBackgroundStyle autoPlay="true" muted loop>
            <source src={props.src} type="video/mp4"/>
            <source src={props.src} type="video/ogg"/>
            Your browser does not support the video tag.
        </VideoBackgroundStyle>
        <AlignCenterDiv>
            <img src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Logos/Logo_main.png"></img>
            <a href="https://pancakeswap.finance/swap?outputCurrency=0x73ec9d20c6a1e8cf34e7e446d76aeb742eb6ae28" target="_blank">
                <svg viewBox="0 0 48 48" height="48px" width="48px" color="text" xmlns="http://www.w3.org/2000/svg" class="sc-bdvvtL kZIwsr">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9024 0C10.8947 0 7.87179 3.60289 8.60749 7.50271L10.3484 16.7306C4.45101 19.3061 0 23.7533 0 29.3333V32.7273C0 37.3405 3.08306 41.2029 7.39317 43.8102C11.7369 46.4379 17.6132 48 24 48C30.3868 48 36.2631 46.4379 40.6068 43.8102C44.9169 41.2029 48 37.3405 48 32.7273V29.3333C48 23.7236 43.5028 19.2593 37.5552 16.6889L39.2882 7.50271C40.0239 3.6029 37.001 0 32.9933 0C29.4567 0 26.5896 2.83809 26.5896 6.33904V14.147C25.7386 14.0899 24.8746 14.0606 24 14.0606C23.0897 14.0606 22.1908 14.0923 21.3061 14.1541V6.33904C21.3061 2.83809 18.4391 0 14.9024 0ZM17.8776 28.3637C17.8776 30.372 16.7811 32 15.4286 32C14.0761 32 12.9796 30.372 12.9796 28.3637C12.9796 26.3554 14.0761 24.7273 15.4286 24.7273C16.7811 24.7273 17.8776 26.3554 17.8776 28.3637ZM34.7757 28.3637C34.7757 30.372 33.6792 32 32.3267 32C30.9742 32 29.8777 30.372 29.8777 28.3637C29.8777 26.3554 30.9742 24.7273 32.3267 24.7273C33.6792 24.7273 34.7757 26.3554 34.7757 28.3637Z"></path><defs><linearGradient id="paint0_linear" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#7645D9"></stop>
                        <stop offset="1" stop-color="#5121B1"></stop>
                    </linearGradient></defs></svg>
            BUY OUR TOKEN</a>
        </AlignCenterDiv>
    </VideoDiv>
}

const FullWidthGifStyle = styled.video`
    width: 100%;
    display: block;
    vertical-align: middle;
`

export function FullWidthGif (props){
    return <FullWidthGifStyle autoPlay muted loop>
        <source src={props.src} type="video/mp4"/>
        <source src={props.src} type="video/ogg"/>
        Your browser does not support the video tag.
    </FullWidthGifStyle>
}

