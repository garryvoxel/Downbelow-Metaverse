import React from 'react';
import styled from 'styled-components';
import { GetAddress } from '../../Services/Metamask';
import { BackgroundBanner } from './BackgroundBanners';
import { BackgroundButton } from '../Assets/button';
import { FeatureTitle, Paragraph } from '../Assets/typography';

const MetamaskConnectDiv = styled.div `
    & h4{
        margin-top:40px;
    }

    & hr{
        margin-bottom:${props => props.theme.margins.half};
    }
    & p{
        text-align:center;
    }
    & button{
        margin-top: ${props => props.theme.margins.half};
        margin-bottom:${props => props.theme.margins.secondhalf};

        & h4{
            margin:0px;
            
        }
    }
`

const MetamaskButtonContent = styled.div`
    width:100%;
    display:grid;
    grid-template-columns: 60px 1fr;
    padding: 10px 20px;
    justify-items: center;
    align-items: center;
`   


export function MetamaskConnect (props) {
    const GetWalletAddress = async (e) => {
        await GetAddress().then((response) => {
            if(response.connectedStatus == null){
                localStorage.setItem("metamaskwallet", response);
                props.onValidate();
            }
        });
    }

    return <MetamaskConnectDiv>
        <BackgroundBanner title="CONNECT WALLET" src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/card-bg.png">
            <Paragraph>Connect with your available wallet or create <br/> new wallet to join our marketplace</Paragraph>
            <BackgroundButton handleClick={() => GetWalletAddress()} src="https://downbelow-assets.s3.us-east-2.amazonaws.com/Assets/art/Assets/card-bg-large.png">
                <MetamaskButtonContent>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAABC1BMVEVHcEzjeSF2PRXygRl2PRa7YBPmdxj3hht2PBTbchrkdht2PBV2PRZ1PBXkdhq/rZ3ArJ52PRXjdhu7Xi92PBXufhrjdhrrexvKcBvkdRrArp73hBv2hBrkdhvidht4PBOZTxfbchrkdhqfURfFsaPArJ7ArZ51Phb3gxnldRvkdhvhdRvSs5rkdhv2hRt2PRbNYRbidhrneBrZbhrdcBnvfxvXwbP0gxvWahnxgBvufh0WFhaaUBnArZ62XhnRZxiERBZ7QBbsfRqqWRjldh7EZxltTDUoHxfUuaaqmo3jeiImNUYqKzBHQD3Er6GKRxfOcyjfllymZivCejp8cGliWVOVhnzkfh/dm2cVy9PcAAAALXRSTlMApts7/hEcgSH47Ve4hIQj1/bTBGWORisJc7vXzsJhNfDP3t/idO3keby/vftOb/5MAAAC5UlEQVRIx+2Wa1PaQBSGCVplUKGAoqjVqbe2tCch2UACjUkIl1IcdLy2//+XdLO37G7AD53pl47vMMyy5zzkzZ5zAoXCm/6l3v1lUum8Xtl4ndqofDwv5biiFSNonzRWUQcnX+3oziqWcpxlDUOAsrG2DFszyrYdDnGSRm5bRAECgLPWvm4RU7Yb0Jxt5YLrdNOKfUjV3pTUtlNFMUupyQe0ZQmFhOybQn3CjUTC+pYE7mYgtetkoIMxFFjLwVMJtOIIkx7nPMxNYim8fiqBjZpMDkcAXQ522WkK1ZadqrDrCq8g28ydamFHDWK7zKun2Eyd7ijgrqVrQsFQ31fOBhdSj8cuBd1YB0uvWg0Qu0lHv0VLsdoofVKCI5tX0gF3pIS0Xt1S6hGCANM2UsjarnqPUj2GE8h6hyzlQm6rs3xQ5FQwcUEDAdxJwNmiOjkNUo+7EfLMhOaCDEJiev7oLl+N9FyD0CYVZ6m0W9VPdhjs5GecD8NykLdg/vlg0EDi+z5CLhYZyT5eIITwZkLjeznwiPUm6jANyGzwT4j17tEqp+aAk2Sw+pwbmCu87omJH2MyWIQRSR1E4SLodPyxCG8ud5q6G6Ppzc3Up6BP1mMx1+axyu1nzxgPZ/16mCIOPiTmILug7nVTinQpQt+72TvTZwU8liIeKYRHQbKWOdXrRpfJSZVIIC0u2eY5yk9TnTWIm549LTYtR/oViU8qwlLqajV4a0UkxcHlpi2HXw6kpfV5RkUBm3wbcA6eK6fPSLNPfUQ2T2iq81iGzGw6kPPHH0SP42yPqKz9ghrikn7Hhvn97Ok70dPsfg52ZhQMrXNaIgLR/Pes13um4HOvh9HMKJzo/wpEpGxgrNdbUHCRrr8Z4k4g9z+BFqTd2m8UqhcYfflJ9IKveFHFPdn6QBK+5OaxAmd7zQO6rh7ezm6vifDisMqeS02jrhWDNI/y2Lu8uma6ulydtUzVw/dE/HJv+k/1B+WYIAs1m7JLAAAAAElFTkSuQmCC"></img>     
                    <FeatureTitle>Login with MetaMask</FeatureTitle>
                </MetamaskButtonContent>
            </BackgroundButton>
        </BackgroundBanner>
    </MetamaskConnectDiv>
}