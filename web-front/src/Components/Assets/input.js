import React from 'react';
import styled from 'styled-components';

const InputTextStyle = styled.fieldset`
    padding:10px;
    background-color: ${props => props.theme.colors.rose};
    border:none;
    display:flex;
    flex-direction:row;

    & input{
        background-color: inherit;
        border:none;
        text-align:right;
        font-size:${props => props.theme.fonts.sizes.input};
        color:${props => props.theme.colors.fonts.primary};
        outline: none;

        & :placeholder{
            color:${props => props.theme.colors.fonts.placeholder};
        }
    }

    & img{
        max-width:21px;
        object-fit: contain;
    }
`


export function InputText (props) {
    return <InputTextStyle>
        <img src={props.icon}></img>
       <input type={props.type} placeholder={props.placeholder} onChange={props.stateChange} value={props.stateValue}/>
    </InputTextStyle>   
}

export function InputCheck (props) {
    return <checkbox/> 
}

export function InputDate (props) {
    return <input type="date"/>
}

const NewInputTextStyle = styled.fieldset`
    padding:16px;
    display:flex;
    flex-direction:column;
    color: #FFF;
    letter-spacing: 0.5px;
    outline: none;
    border: none;
`

const InputFormStyle = styled.input `
    box-sizing: border-box;
    height: 50px;
    width: 100%;
    background-color: rgba(255,255,255,0.07);
    border-radius: 3px;
    padding: 0 10px;
    margin-top: 8px;
    font-size: 14px;
    color: #FFF;
    font-weight: 300;
`

const LabelStyle = styled.label `
    margin-top: 30px;
    font-size: 16px;
    font-weight: 500;
`


export function NewInput (props) {
    return <NewInputTextStyle>
       <LabelStyle>{props.children}</LabelStyle>
       <InputFormStyle type={props.type} color={props.buttonColor} placeholder={props.placeholder} onChange={props.stateChange} value={props.stateValue}/>
    </NewInputTextStyle>   
}
