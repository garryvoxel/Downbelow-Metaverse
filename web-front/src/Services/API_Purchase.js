import SimpleRestAPI from './API';
import { GetAddress } from '../Services/Metamask';

export const ConfirmTransaction = async (chestID, receipt, callback, failed) => {
    const api = new SimpleRestAPI();

    await GetAddress().then((wallet) => {
        console.log(wallet);

        const body = {
            "walletAddress": wallet,
            "starterPacksId": chestID,
            "hashTransaction": receipt
        }

        api.DoSendRecipt('/generateBaseStatus', body, (response) => {
            console.log(response);
            if(response.status < 300){
                console.log("SENDING SUCCESS");
                callback(response);
            }else{
                console.log("SENDING FAILED");
                localStorage.setItem("tx", JSON.stringify(body));
                if(response.status === undefined || response.status === 500){
                    failed(response);
                }
            }
        })
    })  
}

export const ConfirmDeposit = async (callback) => {
    const api = new SimpleRestAPI();

    await GetAddress().then((wallet) => {
        api.GetData('/deposit/' + wallet, (response) => {
            callback(response);
        })
    })
}

export const GetWithdraw = async (callback) => {
    const api = new SimpleRestAPI();

    api.GetData('/withdraw', (response) => {
        callback(response);
    })
}

export const GetAbyss = async (callback) => {
    const api = new SimpleRestAPI();

    api.GetData('/user/' + localStorage.getItem("id"), (response) => {
        callback(response);
    })
}

export const SendTransfer = (wallet, value, receipt, callback, failed) => {
    const api = new SimpleRestAPI();

    let body = {
        "walletAddress": wallet,
        "value": value,
        "hashTransaction": receipt
    }

    api.PostDataNoRefresh(`/deposit`, body, callback);
}

export const SendWithdrawRequest = (wallet, email, amount, callback) => {
    const api = new SimpleRestAPI();

    let body = {
        "walletAddress": wallet,
        "value": amount,
        "email": email
    }

    api.PostData(`/withdraw`, (response) => {
        console.log(response);
        callback(response);  
    }, body);
}

export const GetStarterPacks = (callback) => {
    const api = new SimpleRestAPI();

    api.GetData(`/starterPacks`, (response) => {
        if(response){
            console.log(response);
            callback(response.data);
        }
    })
}

export const GetInventory = (callback) => {
    const api = new SimpleRestAPI();
    api.GetData(`/generateBaseStatus`, (response) => {
        if(response){
            console.log(response);
            callback(response.data);
        }
    })
}