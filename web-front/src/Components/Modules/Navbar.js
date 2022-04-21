import React from 'react';
import styled from 'styled-components';
import { MainLogo } from '../Assets/Logo';
import { NavLinks } from '../Components/NavLinks';
import { Link } from '../Assets/typography';
import { PlayButton } from '../Assets/button';

const Navbar = styled.header`
    width:100%;
    height: ${props => props.theme.height.header};
    background-color: ${props => props.theme.colors.containers.primary};
    position:fixed;
    top: 0;
    z-index:10;

    @media (max-width: 884px) {
        & > div:nth-child(1){
           display:none;
        }
    }
]
`

const NavbarContainer = styled.div `
    width: calc(100% - ${props => props.theme.containers.desktop.full});
    height:100%;
    margin:0 auto;
    display:flex;
    align-items:center;
    justify-content:flex-end;
`

const NavContent = styled.nav`
    display:flex;

    @media (max-width: 1321px) {
        & li{
            display:none;
        }

        & li:nth-child(4){
            display:block;
        }
    }  
`

const ListItem = styled.li`
    margin-left:3rem;
`

export function NavBar (props) {

    return <Navbar>
        <MainLogo/>
        <NavbarContainer>
            <NavContent>    
                <NavLinks>
                    <ListItem><Link href="https://downbelow.io/">Home</Link></ListItem>
                    <ListItem><Link href="https://downbelow.io/#token">Token</Link></ListItem>
                    <ListItem><Link href="https://downbelow.io/login">Game</Link></ListItem>
                    <ListItem><Link href="https://whitepaper.downbelow.io" target="_blank">Whitepaper</Link></ListItem>
                </NavLinks>
                <div></div>
            </NavContent>
            <PlayButton></PlayButton>
        </NavbarContainer>
    </Navbar>
}