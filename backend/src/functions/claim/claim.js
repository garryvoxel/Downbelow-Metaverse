'use strict';

const utility = require('../../helpers/utility');
const returnMessage = require('../../helpers/returnMessage');
const claimAbyss = require('../../providers/claimAbyss/claimAbyss');
const user = require('../../models/user');
const transactionAbyssUnclaimed = require('../../models/transactionAbyssUnclaimed');
const transactionAbyssClaimed = require('../../models/transactionAbyssClaimed');
const transactionAbyssUnclaimedModel = transactionAbyssUnclaimed();
const transactionAbyssClaimedModel = transactionAbyssClaimed();
const userModel = user();

module.exports.claimCreate = async (event) => {

  const transaction = await utility.sequelizeTransaction();
  const resultUserDataSession = utility.getUserDataSession(event);

  try {

    let body = JSON.parse(event.body);
    let currentBalanceAbyssUnclaimed = 0;
    let currentBalanceAbyssClaimed = 0;
    const { userId } = body;

    if (!userId) {

      return returnMessage.generic(400, {
        message: 'userId is mandatory in the body',
      });
    
    }

    if(resultUserDataSession.id != userId){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    let userResult = await userModel.findOne({where: {id: userId, status: 1}});

    if(!userResult){
      return returnMessage.generic(400, {
        message: 'User not found'
      });
    }

    body.amount = userResult.abyssUnclaimed;

    currentBalanceAbyssUnclaimed = parseFloat(userResult.abyssUnclaimed);
    currentBalanceAbyssClaimed = parseFloat(userResult.abyss);
    
    if(currentBalanceAbyssUnclaimed <= 0){
      return returnMessage.generic(400, {
        message: 'Insufficient balance'
      });
    }
    
    let estimatedFeeResult = await claimAbyss.estimatedFee(body.userId);
    let valueFee = (parseFloat(body.amount) * estimatedFeeResult) / 100;

    let valueAbyss = (parseFloat(body.amount) - valueFee);

    let claimCreate = {};

    let bodyTransactionAbyssUnclaimed = {
      type: 'DEBIT', 
      value: parseFloat(body.amount), 
      contents: 'Transfer AbyssUnclaimed to AbyssClaimed', 
      status: 1, 
      userId: userResult.id
    };

    let bodyTransactionAbyssClaimed = {
      type: 'CREDIT', 
      value: valueAbyss, 
      contents: 'Transfer AbyssUnclaimed to AbyssClaimed', 
      status: 1, 
      userId: userResult.id
    };

    await transactionAbyssUnclaimedModel.create(bodyTransactionAbyssUnclaimed, { transaction: transaction });
    await transactionAbyssClaimedModel.create(bodyTransactionAbyssClaimed, { transaction: transaction });

    let updateBalanceAbyssClaimed = (currentBalanceAbyssClaimed + valueAbyss);
    let updateBalanceAbyssUnclaimed = (currentBalanceAbyssUnclaimed - parseFloat(body.amount));
    
    await userModel.update({abyss: updateBalanceAbyssClaimed, abyssUnclaimed: updateBalanceAbyssUnclaimed}, {where: {id: userResult.id}, transaction: transaction});
    
    claimCreate.transactionAbyssUnclaimed = bodyTransactionAbyssUnclaimed;
    claimCreate.transactionAbyssClaimed = bodyTransactionAbyssClaimed;
    claimCreate.estimatedFee = estimatedFeeResult;
    claimCreate.valueFee = valueFee;
    claimCreate.abyss = updateBalanceAbyssClaimed;
    claimCreate.abyssUnclaimed = updateBalanceAbyssUnclaimed;

    await transaction.commit();
    
    return returnMessage.generic(201, claimCreate);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.unclaimedToClaimed = async function(value, userId, daysTraveled, transaction){

  let result = false;
  let lastWithdrawal = null;

  try {

  }
  catch(error){

  }

  return result;
  
};