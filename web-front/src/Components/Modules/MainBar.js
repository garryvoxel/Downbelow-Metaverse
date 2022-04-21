import React from 'react';
import styled from 'styled-components';


const MainBarStyle = styled.div`
    background-color: rgba(46, 46, 46, 0.3);
    -webkit-box-shadow: 0px 0px 5px 2px #2e2e2e;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    margin: auto;
    line-height: 23px;
    min-width: 78vw;
    border-radius: 10px;
    justify-content: space-between;
    padding: 8px 20px;

    & > div{
        display:flex;
        align-items:center;
        justify-content:space-evenly;
    }

    a {
        font-size: ${props => props.theme.fonts.sizes.subtitle};
        font-family: ${props => props.theme.fonts.title};
        color: white;
        text-decoration: none;
        margin: 0px 20px 0px 20px;
    }
`;

const DivLogo = styled.img`
    background-position: center; 
    max-height: 100px;
    width: auto;
`;

const WalletText = styled.p`
    color:white;
`;

export function MainBar () {
    return <MainBarStyle>
        <div>
            <DivLogo onClick={() => window.location.href = "/"} src='https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Portraits/pt5.png' alt='logo'></DivLogo>
            <a href="/Game">Game</a>
            <a href="/Inventory">Inventory</a>
            <a href="/Login">Logout</a>
        </div>
        <WalletText>Connected Wallet: {localStorage.getItem("address")}</WalletText>
    </MainBarStyle>
}