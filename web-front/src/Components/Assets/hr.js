import React from 'react';
import styled from 'styled-components';

export const GradientHRStyle = styled.hr`
    background: linear-gradient(90deg, rgba(33, 21, 27, 0) 0%, #DDC8C7 50%, rgba(33, 21, 27, 0) 100%);
    height: 4px;
    border: none;
    width: 100%;
    margin-bottom: 40px;
`

export function GradientHR (props) {
    return <GradientHRStyle width={props.width} margins={props.margins}>
    </GradientHRStyle>
}