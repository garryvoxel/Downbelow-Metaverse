import SimpleRestAPI from './API';

export const GetContent = (callback) => {
    const api = new SimpleRestAPI(); 

    api.GetData('/teste', (response) => {
        console.log(response);
        if(response.status < 300){
            callback(response.data);
        }
    })
}

export const GetSideContent = (callback) => {
    const api = new SimpleRestAPI(); 

    api.GetData('/teste', (response) => {
        console.log(response);
        if(response.status < 300){
            callback(response.data);
        }
    })
}

export const GetTestById = (id, callback) => {
    const api = new SimpleRestAPI(); 

    api.GetData('/teste/' + id, (response) => {
        console.log(response);
        if(response.status < 300){
            callback(response.data);
        }
    })
}

export const UploadTest = (title, description, url, callback) => {
    const api = new SimpleRestAPI(); 

    const body = {
        title: title,
        description: description,
        url: url
    }

    api.PostData('/teste', body, response => {
        console.log(response);

        if(response.status < 300){
            callback(response.data);
        }
    })
}