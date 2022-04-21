'use strict';
const apigClientFactory = require('aws-api-gateway-client').default;
const config = {region: process.env.REGION, invokeUrl: process.env.DOMAIN}
const apigClient = apigClientFactory.newClient(config);

module.exports.invokeApiAws = async function(method, pathTemplate, body = null, additionalParams = null, pathParams = null){
    
    let response = false; 
    
    let sendEmail = await apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body);
    
    if(sendEmail.status == 200){
        response = true;
    }

    return response;
      
};