'use strict';

const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const withdraw = require('../../models/withdraw');
const user = require('../../models/user');
const withdrawModel = withdraw();
const userModel = user();
const moment = require('moment');

module.exports.withdrawShow = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  try {

    let listWithdraw = [];
    let filter = { attributes: ['createdAt', 'datePayment', 'statusPayment', 'payment', 'to', 'value'], where: {status: 1}, order: [['createdAt', 'DESC']],  limit: 200 };
    
    if(!resultUserDataSession.id){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    filter.where.userId = resultUserDataSession.id;
    listWithdraw = await withdrawModel.findAll(filter);

    return returnMessage.generic(200, listWithdraw);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.withdrawCreate = async (event) => {

  // statusPayment
  // 0 =  Pending
  // 1 =  Confirmed
  // 2 =  called off

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);

    const { walletAddress, value, email } = body;

    if (!walletAddress || !value || !email) {
      return returnMessage.generic(400, {
        message: 'walletAddress, value and email are all required in the body',
      });
    
    }

    body.value = parseFloat(body.value);

    if(body.value <= 0){
      return returnMessage.generic(400, {
        message: 'Withdraw amount not allowed'
      });
    }
    
    let userResult = await userModel.findOne({where: {email: body.email, walletAddress: body.walletAddress, status: 1}});

    if(!userResult){
      return returnMessage.generic(400, {
        message: 'Email or wallet not correct'
      });
    }

    userResult.abyss = parseFloat(userResult.abyss);

    if(userResult.abyss < body.value){
      return returnMessage.generic(400, {
        message: 'Insufficient balance'
      });
    }

    let currentBalance = 0;
    let balanceUpdate = 0;

    let createwithdraw = {};
    let dateNow = moment(new Date());
    let bodyCreateWithdraw = {
      type: 'ABYSS',
      to: body.walletAddress,
      value: body.value,
      userId: userResult.id,
      dateRequest: dateNow,
      status: 1
    };

    createwithdraw = await withdrawModel.create(bodyCreateWithdraw, { transaction: transaction });

    if(createwithdraw){

      currentBalance = userResult.abyss;
      balanceUpdate = (currentBalance - body.value);

      await userModel.update({abyss: balanceUpdate}, {where: {id: userResult.id}, transaction: transaction});
      
    }

    await transaction.commit();

    return returnMessage.generic(201, createwithdraw);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error);
  
  }
  
};

