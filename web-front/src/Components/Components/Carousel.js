import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';

const CarouselStyle = styled.div`
    display:grid;
    grid-template-columns:repeat(6, 20vw);
    align-items:center;
    overflow-x:scroll;
    width:65vw;
    -ms-overflow-style: none;
    scrollbar-width: none;
    user-drag: none;
    -webkit-user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;

    &::-webkit-scrollbar {
        display: none;
    }

    & img{
        width:100%;
        aspect-ratio:750/1050;
        transform:scale(.9);
        user-drag: none;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
`

export function Carousel (props) {
    const containerRef = useRef(null);

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
    }, []);

    const [mouseState, setMouseState] = useState(false);
    const [mouseDelta, setMouseDelta] = useState(0);
    const [width, setWidth] = useState();

    const handleMouseDown = (event) => {
        setMouseState(true);
        setMouseDelta(event.clientX);
        setWidth(containerRef.current.offsetWidth / 3);
    }

    const handleMouseUp = (event) => {
        setMouseState(false);
    }

    function handleMouseMove(ev){
        if(mouseState){
            containerRef.current.scrollLeft += (mouseDelta - ev.clientX) > 0? width : -width;
        }
    }

    return <CarouselStyle ref={containerRef} onMouseMove={(ev)=> handleMouseMove(ev)} onMouseDown={ handleMouseDown }>
        {props.children}
    </CarouselStyle>
}