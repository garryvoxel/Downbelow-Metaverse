import React, {useState} from 'react';
import styled from 'styled-components';
import { Register, Login, ActivateCode, CreateAcessCode, SendPasswordReset, UpdatePassword } from '../../../Services/API_User';
import { GetAddress } from '../../../Services/Metamask';
import { InputText } from '../../Assets/input';
import { BackgroundBanner, BackgroundBannerCard } from '../../Components/BackgroundBanners';
import { BackgroundButton } from '../../Assets/button';
import { FeatureTitle, Paragraph } from '../../Assets/typography';

const FormContainer = styled.div`
    width:800px;
    height:479px;
    background-image:url('https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/card-bg-double.png');
    display:flex;
    justify-content:space-between;
    padding: 14px;
    position:relative;

    & fieldset{
        margin-bottom:10px;
    }
`

const ParagraphForm = styled.p `
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    color: #95989c;
`

const SubParagraphForm = styled.p `
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    color: #FFF;
    cursor: pointer;
    width: 100%;
    text-align: right;
`

const NewButton = styled.button `
    border-radius: 20px;
    border: 1px solid #FFF;
    background-color: #2E2E2E;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    cursor: pointer;
    margin: 10px;
    display: flex;
    align-self: center;
`

const InactiveBUtton = styled.button `
    border-radius: 20px;
    border: 1px solid #FFF;
    background-color: grey;
    color: #black;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    margin: 10px;
    display: flex;
    align-self: center;
`

const ErrorText = styled.p `
    color:${props => props.theme.colors.primary};
    position:absolute;
    top:-20px;
`

export function LoginForm (props) {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [using, setUsing] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function LoginResult (response) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("address",  response.data.user.walletAddress);

        if(localStorage.getItem("metamaskwallet").toLowerCase() !== response.data.user.walletAddress.toLowerCase()){
            setUsing(false);
            setError(`${localStorage.getItem("metamaskwallet")} is not the same wallet as the one registered`);
            return;
        }else{
            localStorage.setItem("email", loginEmail);
            localStorage.setItem("id", response.data.user.id);
            localStorage.setItem("name", response.data.user.name);

            props.onEnter();
        }
    }

    function SendLogin(){
        setError("");
        setUsing(true);
        Login(loginEmail, loginPassword, LoginResult, LoginFailed);
    }


    function LoginFailed(error){
        setUsing(false);
        setError("Login Failed");
        console.log(error);
    }

    function RegisterResult () {
        CreateAcessCode(email, () => console.log("AccessCode Requested"));
        localStorage.setItem("email", email);
        props.ValidateUser();
        setUsing("false");
    }

    function FailedRegister(error){
        if(error.message !== undefined){
            setError(error.message);
        }else if(error.sqlmessage !== undefined){
            setError(error.sqlmessage);
        }else{
            setError("Registration Error");
        }
        
        setUsing(false);
        console.log(error);
    }

    function SendRegister(){
        setError("");
        if(password !== confirmPassword)
        {
            setError("Password don't match");
            return;
        }

        Register(name, email, password, RegisterResult, FailedRegister);
        setUsing(true);
    }

    return <FormContainer>
        {error && <ErrorText>{error}</ErrorText>}
        <BackgroundBannerCard src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/card-bg-half.png" title="SIGN IN">
            <div>
                <InputText icon="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Icons/Email.png" placeholder="Email" type="email" stateValue={loginEmail} stateChange={e => setLoginEmail(e.target.value)}>Email</InputText>
                <InputText icon="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Icons/Lock.png" placeholder="Password" type="password" stateValue={loginPassword} stateChange={e => setLoginPassword(e.target.value)}>Password</InputText>
                <SubParagraphForm onClick={() => {props.ToggleScreen("password")}}>Reset password</SubParagraphForm>
                <SubParagraphForm onClick={() => {props.ToggleScreen("confirm")}}>Validation Code</SubParagraphForm>
            </div>
            {!using && <BackgroundButton src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/card-bg-large.png" handleClick={() => SendLogin()}>Enter</BackgroundButton>}
        </BackgroundBannerCard>
        <BackgroundBannerCard src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/card-bg-half.png" title="REGISTER">
            <div>
                <InputText icon="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Icons/Text.png" placeholder="User Name" type="text" stateValue={name} stateChange={e => setName(e.target.value)}>Name</InputText>
                <InputText icon="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Icons/Email.png"placeholder="Email" type="email" stateValue={email} stateChange={e => setEmail(e.target.value)}>Email</InputText>
                <InputText icon="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Icons/Lock.png" placeholder="Password" type="password" stateValue={password} stateChange={e => setPassword(e.target.value)}>Password</InputText>
                <InputText icon="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Icons/Lock.png" placeholder="Confirm Password" type="password" stateValue={confirmPassword} stateChange={e => setConfirmPassword(e.target.value)}>Confirm Password</InputText> 
            </div>
            {!using && <BackgroundButton src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/card-bg-large.png" handleClick={() => SendRegister()}>Submit</BackgroundButton>}
        </BackgroundBannerCard>
    </FormContainer>
}

const ConfirmationCodeStyle = styled.div`
    & fieldset{
        margin-bottom:${props => props.theme.margins.half};
    }

    & button{
        margin-bottom:${props => props.theme.margins.half};
    }

    & > div > p, > div > span{
        cursor:pointer;
        margin-bottom:${props => props.theme.margins.half};
    }

    & h4{
        padding:10px 48px;
        margin:0px;
    }
`

export function ConfirmationCode (props){
    const [code, setCode] = useState("");

    function RegisterResult (response) {
        console.log("Confirmation Code Accepted");
        props.onValidate();
    }

    function ResendCode () {
        CreateAcessCode(localStorage.getItem('email'), () => console.log("AccessCode Requested"));
    }

    return <ConfirmationCodeStyle>
        <BackgroundBanner title="VALIDATION CODE" src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/card-bg.png">
            <InputText icon="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Icons/Lock.png" type="text" placeholder="Code" stateValue={code} stateChange={e => setCode(e.target.value)}>Code</InputText>
            <BackgroundButton handleClick={() => ActivateCode(localStorage.getItem('email'), code, RegisterResult)} src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/button-bg.png">
                <FeatureTitle>ENTER</FeatureTitle>
            </BackgroundButton>
            <Paragraph>Didn't received a confirmation code?<br/>Please check your spam folder</Paragraph>
            <span onClick={() => {props.ToggleScreen("login")}}><Paragraph>Go Back to login</Paragraph></span>
            <Paragraph onClick={() => ResendCode()}>Send again</Paragraph>
        </BackgroundBanner>
    </ConfirmationCodeStyle>
}

export function ResetPassword (props){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");
    const [page, setPage] =  useState("email");

    function SendPassword(){
        console.log("ok", email);
        SendPasswordReset(email, PasswordReset)
    }

    function PasswordReset (response) {
        setPage("password");
    }

    function UpdatePassoword(){
        if(confirmPassword !== password){
            console.log("Passwords doesn't match");
        }

        console.log("ok", email);
        UpdatePassword(email, password, code, () => {
            props.ToggleScreen("login");
        });
        
    }

    return <ConfirmationCodeStyle>
        <BackgroundBanner title="RESET PASSWORD" src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/card-bg.png">
            <InputText icon="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Icons/Lock.png" type="text" placeholder="Email" stateValue={email} stateChange={e => setEmail(e.target.value)}>Email</InputText>
            {page === "password" && <InputText icon="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Icons/Lock.png" type="password" placeholder="new Password" stateValue={password} stateChange={e => setPassword(e.target.value)}>Password</InputText>}
            {page === "password" && <InputText icon="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Icons/Lock.png" type="password" placeholder="Confirm new Password" stateValue={confirmPassword} stateChange={e => setConfirmPassword(e.target.value)}>Password</InputText>}
            {page === "password" && <InputText icon="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Icons/Lock.png" type="text" placeholder="Code" stateValue={code} stateChange={e => setCode(e.target.value)}>Code</InputText>}
            
            {page === "email" && <BackgroundButton handleClick={() => SendPassword()} src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/button-bg.png">
                <FeatureTitle>CONFIRM EMAIL</FeatureTitle>
            </BackgroundButton>}
            
            {page === "password" && <BackgroundButton handleClick={() => UpdatePassoword()} src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/button-bg.png">
                <FeatureTitle>UPDATE PASSWORD</FeatureTitle>
            </BackgroundButton>}

            <span onClick={() => props.ToggleScreen("login")}><Paragraph>Go Back to login</Paragraph></span>
            <Paragraph>Send email again</Paragraph>
        </BackgroundBanner>
    </ConfirmationCodeStyle>
}