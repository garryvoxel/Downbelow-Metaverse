import SimpleRestAPI from './API';
import { GetAddress } from '../Services/Metamask';

export const WhitelistWallet = (callback) => {
    const api = new SimpleRestAPI(); 

    const GetWallet = async (e) => {
        await GetAddress().then((walletID) => {
            api.GetData(`/whitelist/${walletID}`, (response) => {
                console.log("CONFIRM WHITELIST");
                if(response.data.id !== undefined){
                    console.log("is on whitelist");
                    console.log(response)
                    callback(true);
                }else{
                    console.log("NOT ON WHITELIST");
                    console.log(response);
                    callback(false);
                }
            })
        })
    } 

    GetWallet();
}