import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

import Background from '../../Assets/descend.jpg';
import Parallax from '../../Assets/DarkestParallax.png';

const BackgroundImage = styled.div`
    background-image:url(${Background});
    width:100%;
    height:1711px;
    margin-top:0px;
    background-repeat: no-repeat;
    background-size: cover;
    position:relative;
`

const ParallaxStyle = styled.div`
    width:100%;
    background-image:url(${Parallax});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position:sticky;
    top:57px;
    opacity:0;
    transform:scale(3, 3);
    height:900px;
`

export function ParallaxSection (props) {
    const [scroll, setScroll] = useState(0);
    const [door, setDoor] = useState();

    const UpdateParallax = () => {
        console.log(window.scrollY);
    }

    window.addEventListener('scroll', UpdateParallax);

    return <BackgroundImage>
            <ParallaxStyle>

            </ParallaxStyle>
        </BackgroundImage>
}