'use strict';
const utility = require('../../helpers/utility');
const user = require('../../models/user');
const returnMessage = require('../../helpers/returnMessage');

module.exports.activeCodeActive = async (event, context) => {

  try {
      
      let message = "Unauthorized User";
      
      const { email, codeActive } = JSON.parse(event.body);

      if (!email || !codeActive) {

        return returnMessage.generic(400, {
          message: 'email and codeActive are all required in the body',
        });
    
      }

      let userModel = user();  
      let body = (event.body) ? JSON.parse(event.body) : null;
      let userResult = await userModel.findOne({where: {email:body.email, codeActive: body.codeActive}});

      if(!userResult){
          return returnMessage.generic(404, {message: message});    
      }

      await userModel.update({activeToken: utility.newToken(8), codeActive: body.codeActive, status: 1}, {where: {id: userResult.id}});

      return returnMessage.generic(200, body);
      
  } catch (error) {
      
      return returnMessage.errorSql(500, error.parent);
  
  }
};
