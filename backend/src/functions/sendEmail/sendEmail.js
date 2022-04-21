'use strict';
const returnMessage = require('../../helpers/returnMessage');
const aws = require("aws-sdk");
const ses = new aws.SES({ region: process.env.REGION });

exports.send = async (event) => {

  const { from, to, subject, text, html = null } = JSON.parse(event.body);

  if (!from || !to || !subject || !text) {

    return returnMessage.generic(400, {
      message: 'from, to, subject and text are all required in the body',
    });
  
  }

  const params = {
    Destination: {
        ToAddresses: [to],
    },
    Message: {
        Body: {
            Text: {
              Charset: "UTF-8", 
              Data: text 
            },
            Html: {
              Charset: "UTF-8",
              Data: html 
            }
        },
        Subject: { Data: subject },
    },
    Source: from,
  };

  try {
    
    await ses.sendEmail(params).promise();
    return returnMessage.generic(200, {message: 'Email successfully sent',});
  
  } catch (error) {
    
    return returnMessage.generic(400, {message: 'The email failed to send'});
  
  }
  
};