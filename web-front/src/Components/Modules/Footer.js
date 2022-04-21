import React from 'react';
import styled from 'styled-components';

import { LinkFooter } from '../Assets/typography';
import { CustomSizeImage } from '../Assets/image';

const FooterStyle = styled.footer`
    padding: 32px ${props => props.theme.containers.desktop.half};
    background-color: ${props => props.theme.colors.containers.primary};
    &:hover {
       
    }

    @media (max-width: 768px) {
        
    }

    @media (max-width: 480px) {
        width:100%;
    }  
`

const FooterGrid = styled.div`
    width:100%;
    height:20vh;
    display:flex;
    align-items:end;
    justify-content:space-between;

    @media (max-width: 768px) {
        
    }

    @media (max-width: 480px) {
        width:100%;
    }  
`

const FooterLinkList = styled.ul`
    display:grid;
    grid-template-columns: 1fr 1fr 1fr;
    list-style:none;
    align-self:baseline;
`

const FooterSocials = styled.ul`
    margin-top: ${props => props.theme.margins.textHalf};

    & img{
        margin-left:${props => props.theme.margins.textHalf};
    }

    & img:first-child{
        margin-left:0px;
    }
`

export function Footer (props) {
    return <FooterStyle>
        <FooterGrid>
            <FooterLinkList>
                <li><LinkFooter href="">Home</LinkFooter></li>
                <li><LinkFooter href="">Battle</LinkFooter></li>
                <li><LinkFooter href="">Land</LinkFooter></li>
                <li><LinkFooter href="">AXS</LinkFooter></li>
                <li><LinkFooter href="">Marketplace</LinkFooter></li>
                <li><LinkFooter href="">GettingStarted</LinkFooter></li>
                <li><LinkFooter href="">News</LinkFooter></li>
                <li><LinkFooter href="">Encyclopedia</LinkFooter></li>
                <li><LinkFooter href="">Land Chest Sale</LinkFooter></li>
                <li><LinkFooter href="">Terms of Use</LinkFooter></li>
                <li><LinkFooter href="">Privacy Policy</LinkFooter></li>
                <li><LinkFooter href="">FAQ</LinkFooter></li>
                <li><LinkFooter href="">Whitepaper</LinkFooter></li>
            </FooterLinkList>
            <div>
                <p>Join our community</p>
                <FooterSocials>
                    <CustomSizeImage src="https://picsum.photos/64" width="64px" height="64px"/>
                    <CustomSizeImage src="https://picsum.photos/64" width="64px" height="64px"/>
                    <CustomSizeImage src="https://picsum.photos/64" width="64px" height="64px"/>
                    <CustomSizeImage src="https://picsum.photos/64" width="64px" height="64px"/>
                </FooterSocials>
            </div>
        </FooterGrid>
    </FooterStyle>
}