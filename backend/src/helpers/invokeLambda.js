'use strict';
const aws = require('aws-sdk');
const lambda = new aws.Lambda({
    region: process.env.REGION,
    endpoint: process.env.IS_OFFLINE ? "http://localhost:3000" : "https://lambda.us-east-2.amazonaws.com"
});

module.exports.invoke = async function(functionName, payload, invocationType = 'RequestResponse'){
    
    let params = {
        FunctionName: functionName,
        InvocationType: invocationType,
        Payload: JSON.stringify(payload)
    };

    return await lambda.invoke(params).promise();    
};