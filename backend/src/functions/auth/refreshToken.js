'use strict';
const utility = require('../../helpers/utility');
const user = require('../../models/user');
const returnMessage = require('../../helpers/returnMessage');

module.exports.refreshToken = async (event, context) => {

    try {
        
        let message = 'Unauthorized refreshToken'

        const { refreshToken } = JSON.parse(event.body);

        if (!refreshToken) {

          return returnMessage.generic(400, {
            message: 'refreshToken required in the body',
          });
      
        }

        let userModel = user();  
        let body = (event.body) ? JSON.parse(event.body) : null;
        let userResult = await userModel.findOne({where: {refreshToken: body.refreshToken}});
        
        if(!userResult){
            return returnMessage.generic(400, {message: message});
        }

        let tokenJwt = utility.jwtSign(
            {
                id: userResult.id,
                email: userResult.email,
                typeUserId: userResult.typeUserId
            },
            userResult.id
        );

        return returnMessage.generic(200, {token: tokenJwt});
        
    } catch (error) {
        
        return returnMessage.errorSql(500, error.parent);
    }
};
