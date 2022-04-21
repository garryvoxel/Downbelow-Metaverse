import React, {useState, useEffect} from 'react';
import { GetInventory } from "../../Services/API_Purchase";
import { StayUpdated } from '../Modules/StayUpdated';
import { useNavigate } from "react-router-dom";
import { ConfirmTransaction, GetStarterPacks } from "../../Services/API_Purchase";
import { MainBar } from '../Modules/MainBar';
import styled from 'styled-components';

const MainSection = styled.main`
    margin-top: 0px;
    padding: 64px 64px;
    background-color:${props=> props.theme.colors.fonts.primary};
    display:flex;
    flex-flow: row wrap;
    align-items:center;
    justify-content:center;

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
    display: flex;
    flex-basis: 100%;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    margin-top: 30px;
    line-height: 7vh;
    

    h1 {
        font-size: ${props => props.theme.fonts.sizes.secondtitle};
        color: white;
        font-family: ${props => props.theme.fonts.title};
    }

    p {
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

const InventoryCard = styled.div `
    margin: 10px;
    flex: 0 0 30.333333%;
`;

const DivCardImg = styled.div `
    img {
        object-fit: cover;
        width: 250px;
    }
`;

const DivCardTitle = styled.div `
    text-align: center;

    h1 {
        color: white;
        font-weight: 600;
        font-size: ${props => props.theme.fonts.sizes.feature};
    }
`;

const DivInventory = styled.div `
    display: flex;
    flex-wrap: wrap;
    justify-content:space-evenly;
    flex: 0 0 50%;

    & p{
        color:white;
    }
`;

const FeedbackText = styled.h2`
    font-family:'Balthazar';
    margin-top:40px;
    color:white;
`

export function InvetoryPage (props) {
    const [invetory, setInventory] = useState();
    const navegate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("email") === null){
            navegate("/Login");
            return null;
        }

        GetInventory((data) => {
            if(data.list !== undefined)
                setInventory(data.list);
        });
    }, []);

    function RenderInventory (){
        if(!Array.isArray(invetory))
            return<FeedbackText>Loading...</FeedbackText>

        if(invetory.length === 0)
            return<FeedbackText>Inventory is empty</FeedbackText>
            
        return <DivInventory>
            {invetory && invetory.map(element => {
            let image = "";
            if(element.starterPacksId === "1"){
                image = "https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Portraits/pt8.png"
            }else{
                image = "https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Portraits/pt9.png"
            }
            return <InventoryCard key={element.id}>
                <DivCardImg>
                    <img src={image}></img>
                </DivCardImg>
                {element.statusPayment === 0? <p>Waiting for blockchain confirmation</p> : <p>Confirmed</p>}
            </InventoryCard>
            })}
        </DivInventory>
    }

    return <MainSection>
        <DivTop>
            <MainBar></MainBar>
        </DivTop>
        <DivTitle>
            <h1>Inventory</h1>
            <p>Welcome to the Inventory!</p>
        </DivTitle>
        {invetory && RenderInventory()}
        {!invetory && <p>Loading</p>}
    </MainSection>
}