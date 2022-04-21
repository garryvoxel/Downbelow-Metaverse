'use strict';
const config = require('../../../config/config');
const user = require('../../models/user');
const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const apigClient = require('../../helpers/apigClient');
var moment = require('moment');

module.exports.accessCodeCreate = async (event, context) => {

  try {
        
        let message = "Unauthorized User";
        
        const { email } = JSON.parse(event.body);

        if (!email) {

          return returnMessage.generic(400, {
            message: 'email is mandatory in the body',
          });
      
        }

        let userModel = user();  
        let body = (event.body) ? JSON.parse(event.body) : null;
        let userResult = await userModel.findOne({where: {email:body.email}});

        if(!userResult){
            return returnMessage.generic(404, {message: message});    
        }

        let codeActive = utility.newToken(6);

        let senEmail = await apigClient.invokeApiAws(
          'POST', 
          '/v1/sendEmail', 
          {
            from: config[process.env.STAGE].email,
            to: body.email, 
            subject: 'Active code',
            text: ' ', 
            html: templateEmailAccessCode({codeActive: codeActive})
          },
          {
            headers: 'Content-Type: application/json'  
          }
        );

        if(!senEmail){
          return returnMessage.generic(404, {message: 'Error sending email'});  
        }

        await userModel.update({codeActive: codeActive, dateCodeActive: moment()}, {where: {id: userResult.id}});

        return returnMessage.generic(200, body);
        
    } catch (error) {
        
        return returnMessage.errorSql(500, error.parent);
    
    }
};

const templateEmailAccessCode = function(item) {

  let template = `<!doctype html>
  <html lang="en">
      <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Template email access code</title>
      </head>
      <body> <div> <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#ffffff;font-family:Helvetica,Arial,sans-serif" align="center"> <tbody> <tr> <td align="center" style="padding-top:45px;padding-bottom:45px"> <a href="https://downbelow.io" target="_blank"> <img src="https://downbelow-assets.s3.us-east-2.amazonaws.com/visual-identity/logo/logo.png" alt="" style="max-width:35%!important;width:35%;height:auto!important;"> </a> </td> </tr> <tr> <td style="padding-top:5px;padding-bottom:5px"> <div style="font-family:inherit;text-align:inherit;margin-left:0px"> <span style="box-sizing:border-box;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;margin-top:0px;margin-right:0px;margin-bottom:0cm;margin-left:0px;font-style:inherit;font-variant-ligatures:inherit;font-variant-caps:inherit;font-variant-numeric:inherit;font-variant-east-asian:inherit;font-weight:inherit;font-stretch:inherit;line-height:21px;font-family:inherit;font-size:14px;vertical-align:baseline;border-top-width:0px;border-right-width:0px;border-bottom-width:0px;border-left-width:0px;border-top-style:initial;border-right-style:initial;border-bottom-style:initial;border-left-style:initial;border-top-color:initial;border-right-color:initial;border-bottom-color:initial;border-left-color:initial;text-align:justify;color:#333333;letter-spacing:normal;text-indent:0px;text-transform:none;white-space:pre-wrap;word-spacing:0px;text-decoration-style:initial;text-decoration-color:initial;">I see you are entering the Down Below Universe. We use this easy login code so you don't have to remember or enter another long password.</span> </div> <h4>Your login code is:</h4> <h2 style="text-align:center">${item.codeActive}</h2> </td> </tr> <tr> <td style="padding-top:5px;padding-bottom:5px"> <div style="font-family:inherit;text-align:inherit;margin-left:0px"> <span style="box-sizing:border-box;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;margin-top:0px;margin-right:0px;margin-bottom:0cm;margin-left:0px;font-style:inherit;font-variant-ligatures:inherit;font-variant-caps:inherit;font-variant-numeric:inherit;font-variant-east-asian:inherit;font-weight:inherit;font-stretch:inherit;line-height:21px;font-family:inherit;font-size:14px;vertical-align:baseline;border-top-width:0px;border-right-width:0px;border-bottom-width:0px;border-left-width:0px;border-top-style:initial;border-right-style:initial;border-bottom-style:initial;border-left-style:initial;border-top-color:initial;border-right-color:initial;border-bottom-color:initial;border-left-color:initial;text-align:justify;color:#333333;letter-spacing:normal;text-indent:0px;text-transform:none;white-space:pre-wrap;word-spacing:0px;text-decoration-style:initial;text-decoration-color:initial;">Please note the verification code is only valid for 5 minutes. Do not share this code with anyone. Having trouble logging in, kindly contact our team via this email address <strong>support@downbelow.io</strong> for the best assistance. </span> </div> <h4>If you don't request the code, please ignore this email.</h4> <div style="font-family:inherit;text-align:inherit;margin-left:0px"> <span style="box-sizing:border-box;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;margin-top:0px;margin-right:0px;margin-bottom:0cm;margin-left:0px;font-style:inherit;font-variant-ligatures:inherit;font-variant-caps:inherit;font-variant-numeric:inherit;font-variant-east-asian:inherit;font-weight:inherit;font-stretch:inherit;line-height:21px;font-family:inherit;font-size:14px;vertical-align:baseline;border-top-width:0px;border-right-width:0px;border-bottom-width:0px;border-left-width:0px;border-top-style:initial;border-right-style:initial;border-bottom-style:initial;border-left-style:initial;border-top-color:initial;border-right-color:initial;border-bottom-color:initial;border-left-color:initial;text-align:justify;color:#333333;letter-spacing:normal;text-indent:0px;text-transform:none;white-space:pre-wrap;word-spacing:0px;text-decoration-style:initial;text-decoration-color:initial;">Thank you and have a perfect adventure,</span> </div> </td> </tr> </tbody> </table> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="width:100%;max-width:600px;"> <tbody> <tr> <td> <img border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica,arial,sans-serif;font-size:16px;max-width:100%!important;width:100%;height:auto!important" width="600" alt="" src="https://downbelow-assets.s3.us-east-2.amazonaws.com/visual-identity/banners/pt4.png" tabindex="0"> </td> </tr> </tbody> </table> <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="width:100%;max-width:600px;margin-top:20px"> <tbody> <tr> <td> <img border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica,arial,sans-serif;font-size:16px;max-width:25%!important;width:25%;height:auto!important" width="300" alt="" src="https://downbelow-assets.s3.us-east-2.amazonaws.com/visual-identity/others/binance-smart-chain-1024x286.png" tabindex="0"> </td> </tr> </tbody> </table> </div> </body> 
  </html>`;
  
  return template;

};
