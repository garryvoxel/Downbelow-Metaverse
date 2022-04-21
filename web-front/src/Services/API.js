import axios from 'axios';

export default class SimpleRestAPI { 
    constructor(base_URL){
        this.BASE_URL = 'https://api.downbelow.io/v1';
    }

    GetData(params, callback){
        this.SendRequest(
            "get",
            params === ""? this.BASE_URL : this.BASE_URL + params,
            callback
        );
    }

    PostData(params, body, callback, errorCallback){
        this.SendRequest(
            "POST",
            params === ""? this.BASE_URL : this.BASE_URL + params,
            body,
            callback,
            errorCallback
        );
    }

    PostDataNoRefresh(params, body, callback, errorCallback){
        this.SendRequestNoRefresh(
            "POST",
            params === ""? this.BASE_URL : this.BASE_URL + params,
            callback,
            body,
            errorCallback
        );
    }

    PutData(params, body, callback){
        this.SendRequest(
            "put",
            params === ""? this.BASE_URL : this.BASE_URL + params,
            callback,
            body,
        );
    }

    DeleteData(params, callback){
        this.SendRequest(
            "delete",
            params === ""? this.BASE_URL : this.BASE_URL + params,
            callback,
        );
    }
    
    async SendRequest(method, url, callback, body){   
        if(localStorage.getItem("refreshToken") !== null){
            axios.request({
                method: 'POST',
                data: { "refreshToken": localStorage.getItem("refreshToken") },
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                url: this.BASE_URL + "/refreshToken"
            }).then(refresh => {
                localStorage.setItem("token", refresh.data.token);
                console.log("TOKEN REFRESHED", refresh.data.token);
                axios.request({
                    method: method,
                    data: body,
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        "Authorization": "Bearer " + refresh.data.token
                    },
                    url: url
                }) 
                .then(response => {
                    callback({
                        status: response.status,
                        data: response.data
                    });
                })
                .catch(err => {
                    callback({
                        status: err.status,
                        data: err,
                    });
                });
            }).catch(err => {
                callback({
                    status: err.status,
                    data: err,
                });
            })
        }else{
            axios.request({
                    method: method,
                    data: body,
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                    },
                    url: url
                }) 
                .then(response => {
                    callback({
                        status: response.status,
                        data: response.data
                    });
                })
                .catch(err => {
                    callback({
                        status: err.status,
                        data: err,
                    });
                });
        }
    }

    async SendRequestNoRefresh(method, url, callback, body){
        axios.request({
            method: method,
            data: body,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            url: url
        }) 
        .then(response => {
            callback({
                status: response.status,
                data: response.data
            });
        })
        .catch(err => {
            callback({
                error:err
            });
        });
    }

    async DoSendRecipt(path, body, callback){
        axios.request({
            method: "POST",
            data: { "refreshToken": localStorage.getItem("refreshToken") },
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            url: this.BASE_URL + "/refreshToken"
        }).then(refresh => {
            localStorage.setItem("token", refresh.data.token);
            console.log("TOKEN REFRESHED", refresh.data.token);
            axios.request({
                method: 'POST',
                data: body,
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Authorization": "Bearer " + refresh.data.token
                },
                url: this.BASE_URL + path
            }) 
            .then(response => {
                console.log("SENT", response.status)
                callback({
                    status: response.status,
                    data: response.data
                });
            })
            .catch(err => {
                if(err.status === 500){
                    localStorage.setItem("failed", body);
                    console.log("SENDING FAILED");
                }
                callback({
                    status: err.status,
                    data: err,
                });
            });
        })
    }
}