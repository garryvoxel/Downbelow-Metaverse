'use strict';

const bcrypt = require('bcryptjs');
const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const user = require('../../models/user');
const userStarterPacks = require('../../models/userStarterPacks');
const userModel = user();
const userStarterPacksModel = userStarterPacks();


module.exports.login = async (event, context) => {

    const transaction = await utility.sequelizeTransaction();

    try {
        
        let body = (event.body) ? JSON.parse(event.body) : null;
        let userResult = await userModel.findOne(
            {
                where: {email:body.email}
            }
        );
        
        if(!userResult){
            return returnMessage.generic(403, {message: 'Incorrect login information'});
        }

        let compareResult = bcrypt.compareSync(body.password, userResult.password);
        
        if(!compareResult){
            return returnMessage.generic(403, {message: 'Incorrect login information'});    
        }

        if(!userResult.activeToken){
            return returnMessage.generic(200, {status: false, message: 'Activation code not confirmed, check you email'});    
        }

        let refreshToken = utility.newToken(72);
        await userModel.update({refreshToken: refreshToken}, {where: {id: userResult.id}, transaction: transaction });

        let tokenJwt = utility.jwtSign(
            {
                id: userResult.id,
                email: userResult.email,
                typeUserId: userResult.typeUserId
            },
            userResult.id
        );

        userResult = {id: userResult.id, name: userResult.name, nike: userResult.nike, email: userResult.email, walletAddress: userResult.walletAddress};

        let userStarterPacksResult = await userStarterPacksModel.findAll({where: {statusPayment: 0, walletAddress: userResult.walletAddress, giveAway: 1, status: 1}});

        if(userStarterPacksResult.length > 0){

          for (let i = 0; i < userStarterPacksResult.length; i++) {

            await userStarterPacksModel.update({statusPayment: 1, userId: userResult.id}, {where: {id: userStarterPacksResult[i].id}, transaction: transaction});
            
          }

        }

        await transaction.commit();
        return returnMessage.generic(200, {status: true, token: tokenJwt, refreshToken: refreshToken, user: userResult});
        
    } catch (error) {
        await transaction.rollback();
        return returnMessage.errorSql(500, error.parent);
    }
};
