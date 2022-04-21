import SimpleRestAPI from './API';
import { GetAddress } from '../Services/Metamask';

export const Login = (email, password, callback, Failed) => {
    const api = new SimpleRestAPI(); 

    const body = {
        "email": email,
        "password": password
    }
    
    api.PostDataNoRefresh('/login', body, (response) => {
        localStorage.setItem('token', null);
        console.log(response.status);
        if(response.status < 300){
            callback(response);
            localStorage.setItem("token", response.data.token);
        }else{
            Failed(response);
        }
    }, (err) => {
        Failed(err);
    })
}

export const Register = (name, email, password, callback, Failed) => {
    const api = new SimpleRestAPI(); 

    let walletAddress = "";

    const GetWallet = async (e) => {
        walletAddress = await GetAddress();
    }

    GetWallet().then(() => {
        const body = {
            "name": name,
            "email": email,
            "password": password,
            "walletAddress": walletAddress
        }
    
        console.log(body);
    
        api.PostDataNoRefresh('/user', body, (response) => {
            if(response.status < 300){
                callback();
            }else{
                Failed(response);
            }
        }, (err) => {
            Failed(err);
        })
    })
}

export const GetPlayerData = (callback) => {
    const api = new SimpleRestAPI();

    api.GetData(`/user/${localStorage.getItem("id")}`, (response) => {
        if(response.status < 300){
            callback(response);
        }
    })

}

export const CreateAcessCode = (email, callback) => {
    const api = new SimpleRestAPI();

    const body = {
        "email": email
    }

    localStorage.setItem("email", email);

    api.PostDataNoRefresh('/accessCode', body, (response) => {
        if(response.status < 300){
            callback();
        }
    }, (response) => console.log(response));
}

export const ActivateCode = (email, code, callback) => {
    const api = new SimpleRestAPI();

    const body = {
        "email":email,
        "codeActive": code
    }

    api.PostDataNoRefresh('/activeCode', body, (response) => {
        if(response.status < 300){
            callback();
        }
    }, (response) => console.log(response))
}

export const GetUserInventory = (userID, email, password, wallet, callback) => {
    const api = new SimpleRestAPI();

    const body = {
        "userID": userID,
    }

    api.GetData('/user', body, (response) => {
        if(response.status < 300){
            callback();
        }
    })
}


export const SendPasswordReset = (email, callback) => {
    const api = new SimpleRestAPI();

    const body = {
        "email": email,
    }

    console.log("SENT ")
    api.PostDataNoRefresh('/passwordResets', body, (response) => {
        if(response.status < 300){
            callback();
        }
    })
}


export const UpdatePassword = (email, password, code, callback) => {
    const api = new SimpleRestAPI();

    const body = {
        "email": email,
        "password": password,
        "codeActive":code
    }

    console.log("SENT ")
    api.PostDataNoRefresh('/passwordActive', body, (response) => {
        if(response.status < 300){
            callback();
        }
    })
}