import React, {useState, useEffect} from 'react';
import moment from 'moment'
import { useNavigate } from "react-router-dom";
import { ConfirmTransaction, ConfirmDeposit, GetWithdraw } from "../../Services/API_Purchase";
import { GetAddress, SendDeposit, SendWithdraw } from '../../Services/Metamask';
import { MainBar } from '../Modules/MainBar';
import styled, {keyframes} from 'styled-components';
import { BackgroundBanner } from '../Components/BackgroundBanners';
import { BackgroundButton } from '../Assets/button';
import { FeatureTitle } from '../Assets/typography';
import { GetAbyss } from '../../Services/API_Purchase';

const MainSection = styled.main`
    margin-top: 0px;
    padding: 64px 64px;
    background-color:${props=> props.theme.colors.fonts.primary};
    display:flex;
    flex-flow: row wrap;
    flex-direction:column;
    align-items:center;
    justify-content:center;

    & > aside{
        margin-bottom:80px; 
    }

    & h4{
        margin-top:20px;
    }

    @media (max-width: 768px) {
        height:120vh;
    }

    @media (max-width: 480px) {
        
    }  
`;

const DivTop = styled.main `
     display: flex;
     flex-grow: 1;
     margin-top:80px;
`;

const DivTitle = styled.div `
    margin-top:40px; 
    display: flex;
    flex-basis: 100%;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    width:400px;

    h1 {
        font-size: ${props => props.theme.fonts.sizes.secondtitle};
        color: white;
        font-family: ${props => props.theme.fonts.title};
        margin-bottom:20px;
    }

    p {
        font-size: ${props => props.theme.fonts.sizes.subtitle};
        font-family: ${props => props.theme.fonts.body};
        color: white;
        width: 50%;
        text-align: center;
        font-size: 20px;
        line-height: 2em;
    }

    li{
        font-size: ${props => props.theme.fonts.sizes.subtitle};
        font-family: ${props => props.theme.fonts.body};
        color: white;
        width: 50%;
        text-align: center;
    }

    @media (max-width: 768px) {
        line-height: 10vh;
        width: 100%;
        h1 {
            line-height: 20vh;
        }
    }

    @media (max-width: 480px) {
        line-height: 15vh;
        width: 100%;
        h1 {
            line-height: 30vh;
        }
    }  

`;

const DivStore = styled.div `
    display: flex;
    flex-direction:column;
    flex: 0 50.333333%;
    align-items: center;
    flex-direction: column;
    margin-top:40px;
`;

const DivBanner = styled.div `
    position: relative;
    min-height: 374px;
    width: 683px;
    height: 100%;

    & h1{
        color:white;
        font-size:40px;
        margin-bottom:40px;
    }

    & ul{
        margin-top:16px;
    }

    & li{
        color:white;
        list-style:none;
        margin-bottom:8px;
    }
    
    @media (max-width: 480px) {
        .text {
            margin-right: 0;
        }
    }  

`;

const Background = styled.img`
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border: 0;
    height: 378px;
    /* height: 683px; */
    width: 683px;
    aspect-ratio: 16/9;
`

const CantBuyButton = styled.button`
    font-size: ${props => props.theme.fonts.sizes.paragraph};
    font-family: ${props => props.theme.fonts.title};
    color: FFF;
    width:150px;
    box-shadow:inset 0px 1px 0px 0px #004e92;
    background-color: grey;
    background-size: 400%;
    border-radius: 26px;
    border:1px solid #000428;
    cursor:pointer;
    color:#ffffff;
    font-weight:bold;
    padding:5px 29px;
    text-decoration:none;
    text-shadow:0px 0px 0px #9b14b3;
    margin-top: 16px;

    &:hover {
        animation: gradientRotate 2s infinite;
        &::before {
          opacity: 1;
          animation: gradientRotate 2s infinite;
        }
      }

    @keyframes gradientRotate {
        0% {
          background-position: 0% 0%;
        }
        100% {
          background-position: 100% 100%;
        }
      }
`;

const BuyButton = styled.button`
    font-size: ${props => props.theme.fonts.sizes.paragraph};
    font-family: ${props => props.theme.fonts.body};
    color: FFF;
    width:150px;
    cursor: pointer;
    box-shadow:inset 0px 1px 0px 0px #004e92;
    background-image: linear-gradient(90deg, #0065ff, #6942ef, #6554c0, #008cff, #0065ff, #6942ef);
    background-size: 400%;
    border-radius: 26px;
    border:1px solid #000428;
    cursor:pointer;
    color:#ffffff;
    font-weight:bold;
    padding:11px 29px;
    text-decoration:none;
    text-shadow:0px 0px 0px #9b14b3;
    margin-top: 16px;

    &:hover {
        animation: gradientRotate 2s infinite;
        &::before {
          opacity: 1;
          animation: gradientRotate 2s infinite;
        }
      }

    @keyframes gradientRotate {
        0% {
          background-position: 0% 0%;
        }
        100% {
          background-position: 100% 100%;
        }
      }
`;

const TextContaniner = styled.div`
    position:absolute;
    z-index:1;
    right:80px;
    bottom:40px;
    display:flex;
    flex-direction:column;
    align-items:center;
`

const PurchaseCounter = styled.h4`
    font-size: 14px;
    color: white;
    margin: 0 auto;
    margin-top: 8px;
`

const ChestContentText = styled.p`
    margin-top:16px;
    color:white;
    margin-bottom:60px;
`

const Modal = styled.div`
    width:100vw;
    position:fixed;
    height:100vh;
    top:0;
    left:0;
    background-color: #00000080;
    z-index:10000;
    display:flex;
    align-items:center;
    justify-content:center;

    & > div{
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:space-between;
        height:200px;
        background-color:#E0CBC9;
        border-radius:8px;
        max-width:500px;
    }

    & h2{
        color:${props => props.theme.colors.primaryHover};
        font-family:'Balthazar';
        font-size:px;
    }

    & p {
        margin-top:16px;
        color:white;
        color:${props => props.theme.colors.primaryHover};
    }
`

const ErrorText = styled.h2`
    color:red;
    margin-top:20px;
`

const ModalHead = styled.div`
    padding:8px;
    background-color: #4C3B47;
    width:100%;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    justify-content: center;

    & h2{
        color:#fff;
    }
`

const ModalBody = styled.div`
    padding:0px 16px;
    color:#4C3B47;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;

    & b{
        font-weight:600;
    }
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const LoadIcon = styled.img`
    margin-top:10px;
    animation: ${rotate} 4s infinite linear;
`

const LoadingText = styled.p`
   color:white;
`

const SupportText = styled.p`
    color:white;

    a{
        color:${props => props.theme.colors.primary};
    }
`
const BasicText = styled.p`
    color:white;
    margin-top: 40px;
    
`

const TableContainer = styled.div`
    width:80vw;
    overflow:auto;
`

const HistoryTable = styled.table`
    color:#F1DBD8;
    background-color:#21151C;
    margin:0 auto;
    
    & tbody {
        background-color:#4C3B47;
    }

    & td, th{
        padding:18px 16px;
    }
`

const PendingTag = styled.div`
    background-color:#2F556C;
    color:white;
    padding:4px 8px;
`

const PaidTag = styled.div`
    background-color:#3C5E46;
    color:white;
    padding:4px 8px;
`

const CancelledTag = styled.div`
    background-color:#BF2D2F;
    color:white;
    padding:4px 8px;
`

export function StorePage (props) {
    const [wallet, setWallet] = useState(0);
    const [transfser, setTransfer] = useState(0);
    const [balance, setBalance] = useState(0);
    const [requests, setRequests] = useState();
    const [withdraw, setWithdraw] = useState(0);
    const [buying, setBuying] = useState();
    const [refresh, setRefresh] = useState(0);
    const [error, setError] = useState();
    const [history, setHistory] = useState();
    const navegate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("email") === null){
            navegate("/Login");
            return null;
        }

        if (window.ethereum){
            window.ethereum.on('accountsChanged', async () => {
                navegate("/Login");
            return null;
            });
        }
        
        setWallet(localStorage.getItem("address"));
        ReloadPayment();
    }, [refresh]);

    function StartDeposit(){
        console.log("Start process");
        setTransfer(transfser.replace(',', '.'));
        console.log(transfser);
        setBuying(true);
        SendDeposit(transfser, () => {
            setBuying(false);
            ReloadPayment();
        }, (err) => {
            setError(err);
            console.log(err);
            setBuying(false);
        });
    }

    function StartWithdraw(){
        setBuying(true);

        setWithdraw(withdraw.replace(',', '.'));

        SendWithdraw(withdraw, (response) => {
            setBuying(false);
            ReloadPayment();
            setWithdraw(0);
        }, (err) => {
            console.log(err);
            setError(err.data.response.data.message);
            console.log(err);
            setBuying(false);
        });
    }

    function ReloadPayment(){
        ConfirmDeposit((data) => {
        })

        GetAbyss((data) => {
            setBalance(parseFloat(data.data.abyss).toFixed(3));
        })

        GetWithdraw((response) => {
            setHistory(response.data);
        });
    }

    function RenderModal(){
        return <Modal>
            <div>
                <ModalHead>
                    <h2>Processing Purchase</h2>
                </ModalHead>
                <ModalBody>
                    <p><b>do not refresh</b> this page or <b>queue purchases</b></p>
                    <p>Need help? <a href="https://forms.gle/3LYEqaBQhob6U54CA" target="_blank"> downbelow.support</a></p>
                    <LoadIcon src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/Load-wheel.png"/>
                </ModalBody>
                <div/>
            </div>
        </Modal>
    }

    function RenderError(){
        console.log(history);
        return <Modal onClick={() => setError(null)}>
            <div>
                <ModalHead>
                    <h2>ERROR</h2>
                </ModalHead>
                <ModalBody>
                    <p>Page found the following error: <b>{error}</b></p>
                    <p>Need help? <a href="https://forms.gle/3LYEqaBQhob6U54CA" target="_blank"> downbelow.support</a></p>
                </ModalBody>
                <div/>
            </div>
        </Modal>
    }

    function RenderStatustag(status){
        if(status === 0)
        return <PendingTag styleStatus={status}>PENDING</PendingTag>

        if(status === 1)
        return <PaidTag styleStatus={status}>PAID</PaidTag>

        if(status === 2)
        return <CancelledTag styleStatus={status}>CANCELLED</CancelledTag>
    }

    
    function RenderHistory(){
        if(!Array.isArray(history))
            return <div></div>

        if(history.length === 0)
            return <div></div>

        return <TableContainer>
        <HistoryTable>
            <thead>
                <tr>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Resolved At</th>
                    <th>Amount</th>
                    <th>Tx Hash</th>
                </tr>
            </thead>
            <tbody>
                {history.map((element) => {
                    return(
                    <tr key={element.createdAt}>
                        <td>{"UTC " +  moment(new Date(element.createdAt)).utcOffset('+0000').format('YYYY-MM-DD hh:mm:ss')}</td>
                        <td>{RenderStatustag(element.statusPayment)}</td>
                        <td>{element.datePayment == null? "Open" : "UTC " +  moment(element.datePayment).utcOffset('+0000').format('YYYY-MM-DD hh:mm:ss')}</td>
                        <td>{parseFloat(element.value).toFixed(3)}</td>
                        <td>{element.payment}</td>
                    </tr>
                    )
                })}
            </tbody>
        </HistoryTable>
        </TableContainer>
    }

    function setDepositValue(){
        let value = parseFloat(transfser).toFixed(3);
        if(isNaN(value)){
            value = 0;
        }
        value = value.toString().replace(',', '.');
        setTransfer(value);
    }

    function setWithdrawValue(){
        let value = parseFloat(withdraw).toFixed(3);
        if(isNaN(value)){
            value = 0;
        }
        value = value.toString().replace(',', '.');
        setWithdraw(value);
    }
    
    return <MainSection>
        <DivTop>
            <MainBar></MainBar>
        </DivTop>
        <DivSecntion>
            <DivTitle>
                <h1>GAME</h1>
                <BalanceToken>ABYSS BALANCE: {balance}</BalanceToken>
                {!balance && <p>Please login again</p>}
            </DivTitle>
            <div>
                <DownloadButton>
                    <a href="https://downbelow-patch.s3.us-east-2.amazonaws.com/patch/Launcher.zip" download>
                        <img src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Icons/BT.png"></img>
                    </a>
                </DownloadButton>
                <DownloadButton>
                    <a href="https://downbelow-patch-mac.s3.us-east-2.amazonaws.com/patch/Down+Below.zip" download>
                        <img src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/Icons/BT-Mac.png"></img>
                    </a>
                </DownloadButton>
            </div>
        </DivSecntion>
        <aside>
            <BackgroundBanner title="DEPOSIT" src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/card-bg.png">
                <ShopGrid>
                    <input onBlur={() => setDepositValue()} type="number" value={transfser} onChange={e => setTransfer(e.target.value)}></input>
                    <span>Confirm your deposit</span>
                    <BackgroundButton handleClick={() => StartDeposit()} src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/button-bg.png">
                        <FeatureTitle>DEPOSIT</FeatureTitle>
                    </BackgroundButton>
                </ShopGrid>
            </BackgroundBanner>
        </aside>
        <aside>
            <BackgroundBanner title="WITHDRAW" src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/card-bg.png">
                <ShopGrid>
                    <input type="number" value={withdraw} onBlur={() => setWithdrawValue()} onChange={e => setWithdraw(e.target.value)}></input>
                    <span></span>
                    <BackgroundButton handleClick={() => StartWithdraw()}  src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/button-bg.png">
                        <FeatureTitle>WITHDRAW</FeatureTitle>
                    </BackgroundButton>
                    <WithdrawText>Withdraws are done manually and have <br/> a maximum wait time of 48 hrs</WithdrawText>
                </ShopGrid>
            </BackgroundBanner>
        </aside>
        {history && RenderHistory()}
        {buying && RenderModal()}
        {error && RenderError()}
    </MainSection>
}

const BalanceToken = styled.p`
    font-size:14px;
`

const ShopGrid = styled.div`
    padding-bottom:17px;
    
    display:flex;
    flex-direction:column;

    & input{
        padding:13px;
        background-color:#E0CBC9;
        color:#74675E;
        font-size:18px;
        width:280px;
    }

    & input:disabled{
        padding:13px;
        background-color:#18171a;
        color:#21151C;
        stroke:#4C3B47;
        font-size:18px;
    }

    & span{
        color:#E0CBC9;
        font-size:22px;
        margin:25px auto;
    }

    & button{
        margin: 0 auto;
        font-family:Balthazar;
    }
`

const WithdrawText = styled.p`
    color:#E0CBC9;
    margin-top:16px;
    text-align:center;
`

const DownloadButton = styled.div`
    padding: 10px 20px;
    border-radius: 8px;
    height: 64px;
    width: 320px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    
`

const DivSecntion = styled.div`
    display:flex;
    align-items:left;
    margin-bottom:100px;

`
