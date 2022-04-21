import React from 'react';
import styled from 'styled-components';

const NavLinksStyle = styled.ul`
    width:100%;
    display:flex;
    justify-content:space-between;
    align-items:center;
    list-style:none;
`

export function NavLinks (props) {
    return <NavLinksStyle>
       {props.children}
    </NavLinksStyle>
}