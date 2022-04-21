import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { MetamaskConnect } from '../Components/MetamaskConnect';
import { LoginForm, ConfirmationCode, ResetPassword } from '../Modules/Forms/LoginForms';

const Maindiv = styled.main`
`

const MainSection = styled.section`
    margin-top:${props => props.theme.height.header};
    width:100vw;
    height:calc(100vh - ${props => props.theme.height.header});
    display:flex;
    flex-direction: column;
    background-color: ${props => props.theme.colors.containers.primary}50;
    justify-content:center;
    align-items: center;  
`

const SupportText = styled.p`
    color:white;
    margin-top:20px;
    a{
        color:${props => props.theme.colors.primary};
    }
`

export function UserPage (props) {
    const [screen, setScreen] = useState("");
    const navigate  = useNavigate();

    useEffect(() => {
        
    }, []);;

    const RenderPage = () => {
        switch(screen){
            case "login":
                return <div>
                <LoginForm onEnter={() => navigate("/Game")} ToggleScreen={(screen) => setScreen(screen)} ValidateUser={() => setScreen("confirm")}></LoginForm>
            </div>  
            case "confirm":
                return <ConfirmationCode ToggleScreen={(screen) => setScreen(screen)} onValidate={() => setScreen("login")}></ConfirmationCode>
            case "password":
                return <ResetPassword ToggleScreen={(screen) => setScreen(screen)} onValidate={() => setScreen("login")}></ResetPassword>
            default: 
                return <MetamaskConnect onValidate={() => setScreen("login")}/>
        } 
    }

    return <Maindiv>
        <MainSection>
            {RenderPage()}
            <SupportText>Need help?<a href="https://forms.gle/3LYEqaBQhob6U54CA" target="_blank"> downbelow.support</a></SupportText>
        </MainSection>
        </Maindiv> 
}