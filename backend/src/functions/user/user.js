'use strict';

const bcrypt = require('bcryptjs');
const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const user = require('../../models/user');
const typeUser = require('../../models/typeUser');
const claimAbyss = require('../../providers/claimAbyss/claimAbyss');
const userModel = user();
const typeUserModel = typeUser();


module.exports.userShow = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  try {

    userModel.belongsTo(typeUserModel, { foreignKey : 'typeUserId'});
    
    let listUser;
    let filter = { where: {status: 1}, limit: utility.totalRecordPagination() };
    let include = [
      { model: typeUserModel, as: 'typeUser', where: {status: 1}, required: false }
    ];

    filter.include = include;
    filter.attributes = ['id', 'abyss', 'abyssUnclaimed', 'arenaTickets', 'createdAt', 'dateCodeActive', 'elvenSilver', 'email', 'name', 'nike', 'playedPvE', 'rations', 'queenStone', 'refreshToken', 'status', 'walletAddress'];
    filter.where.id = resultUserDataSession.id;
    if(event.pathParameters){
      
      listUser = await userModel.findOne(filter);
      let estimatedFeeResult = await claimAbyss.estimatedFee(listUser.id);
      listUser.setDataValue('claimFeePercentage', estimatedFeeResult);

      let smuggler = await utility.smugglerIsOpen();
      listUser.setDataValue('smuggler', smuggler);

    }
    else{
      listUser = await userModel.findAll(filter);
    }

    if(!listUser){
      return returnMessage.generic(400, {message: 'Unauthorized User'});
    }

    return returnMessage.generic(200, listUser);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.userCreate = async (event) => {

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    let userCreate = {};
    
    if(!body.id){

      const { name, email, password, walletAddress } = JSON.parse(event.body);

      if (!name || !email || !password || !walletAddress) {

        return returnMessage.generic(400, {
          message: 'name, email, password and walletAddress are all required in the body',
        });
      
      }

      let userResultEmail = await userModel.findOne({attributes: ['id', 'email', 'walletAddress'], where: {email: body.email}});
      let userResultWalletAddress = await userModel.findOne({attributes: ['id', 'email', 'walletAddress'], where: {walletAddress: body.walletAddress}});

      if(userResultEmail){

        return returnMessage.generic(400, {
          message: 'Email already in use'
        });

      }

      if(userResultWalletAddress && (userResultWalletAddress.walletAddress != userResultWalletAddress.email)){

        return returnMessage.generic(400, {
          message: 'Wallet already in use'
        });

      }

      body.password = bcrypt.hashSync(body.password, 10);
      body.tokenApplication = utility.newToken(36);
      body.rations = 0;
      body.queenStone = 0;
      
      if(userResultWalletAddress && userResultWalletAddress.walletAddress === userResultWalletAddress.email){

        await userModel.update({name: body.name, email: body.email, password: body.password, tokenApplication: body.tokenApplication, rations: body.rations, queenStone: body.queenStone}, {where: {id: userResultWalletAddress.id}, transaction: transaction});
        userCreate = body;
      
      }
      else{

        body.typeUserId = 2;
        body.status = 1;
        userCreate = await userModel.create(body, { transaction: transaction });

      }

    }
    else{

      delete body.password;
      delete body.email;
      delete body.walletAddress;
      delete body.typeUserId;
      delete body.abyss;
      delete body.elvenSilver;
      delete body.rations;
      delete body.queenStone;
      delete body.arenaTickets;
      delete body.playedPvE;
      delete body.tokenApplication;
      delete body.refreshToken;
      delete body.activeToken;
      delete body.codeActive;
      delete body.dateCodeActive;

      await userModel.update(body, {where: {id: body.id}, transaction: transaction});
      userCreate = body;

    }

    await transaction.commit();

    return returnMessage.generic(201, userCreate);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};