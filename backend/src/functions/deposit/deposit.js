'use strict';

const returnMessage = require('../../helpers/returnMessage');
const web3 = require('../../helpers/web3');
const abiAbyysToken = require('../../helpers/abyysToken');
const utility = require('../../helpers/utility');
const deposit = require('../../models/deposit');
const user = require('../../models/user');
const depositModel = deposit();
const userModel = user();

module.exports.depositShow = async (event) => {

  const transaction = await utility.sequelizeTransaction();

  try {

    let listDeposit = [];
    let filter = { where: {status: 1}, order: [['createdAt', 'DESC']],  limit: 300 };
    
    if(event.pathParameters){
      filter.where.from = event.pathParameters.id;
      listDeposit = await depositModel.findAll(filter);
    }

    listDeposit = await updateUserAbyss(listDeposit, transaction);
    
    await transaction.commit();

    return returnMessage.generic(200, listDeposit);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.depositCheckPending = async (event) => {

  const transaction = await utility.sequelizeTransaction();

  try {

    let listDepositResult = [];

    let body = JSON.parse(event.body);
    
    if (!body) {

      return returnMessage.generic(400, {
        message: 'No body',
      });
    
    }

    let listDeposit = body;

    for (var i = 0; i < listDeposit.length; i++) {

      let hashPaymentExist = await depositModel.findOne({attributes: ['id'], where: {payment: listDeposit[i].hashTransaction, from: listDeposit[i].walletAddress}});

      if(!hashPaymentExist){
        
        let createDpositBody = {
          walletAddress: listDeposit[i].walletAddress,
          hashTransaction: listDeposit[i].hashTransaction,
        };

        listDeposit[i] = await createDposit(createDpositBody);

        listDepositResult.push(listDeposit[i]);
      
      }

    }
    
    await transaction.commit();

    return returnMessage.generic(200, listDepositResult);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.depositCreate = async (event) => {

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);

    const { walletAddress, value, hashTransaction } = body;

    if (!walletAddress || !value || !hashTransaction) {
      return returnMessage.generic(400, {
        message: 'walletAddress, value and hashTransaction are all required in the body',
      });
    
    }

    let hashPaymentExist = await depositModel.findOne({where: {payment: body.hashTransaction, from: body.walletAddress}});

    if(hashPaymentExist){
      return returnMessage.generic(400, {
        message: 'Hash transaction not permission'
      });
    }

    let createDeposit = await createDposit(body);

    if(!createDeposit){
      return returnMessage.generic(400, {
        message: 'Not committed'
      });
    }

    await transaction.commit();

    return returnMessage.generic(200, createDeposit);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error);
  
  }
  
};


async function createDposit(body, transaction) {

  let result = false;

  try{

    let bodyCreateDeposit = {
      type: 'ABYSS',
      payment: body.hashTransaction,
      from: body.walletAddress,
      status: 1
    };

    result = await depositModel.create(bodyCreateDeposit, { transaction: transaction });

  }
  catch(error){
    await transaction.rollback();
  }

  return result;

};


async function updateUserAbyss(list, transaction) {

  let userResult = null;
  let updateBalanceResult = 0;
  let listUpdateBalance = [];

  try{

    if(list.length > 0){

      for (var i = 0; i < list.length; i++) {
        
        if(list[i].statusPayment == 0){

          let receiptTransactionReceiptStatus = await web3.getTransactionReceipt(list[i].payment);
          let receiptTransactionReceipt = await abiAbyysToken.getTransaction(list[i].payment);
          
          if(receiptTransactionReceipt && receiptTransactionReceiptStatus.status == true){

            if(receiptTransactionReceipt.transactionIndex >= 4){

              if(receiptTransactionReceipt.from.toLowerCase() === list[i].from.toLowerCase()){

                if(receiptTransactionReceipt.to.toLowerCase() == ('0x240905c74c2aeb2689ac620f622b835e80e2d238').toLowerCase()){

                  list[i].value = parseFloat(receiptTransactionReceipt.value);
                  list[i].statusPayment = 1;
                  list[i].to = receiptTransactionReceipt.to;
  
                  userResult = await userModel.findOne({attributes: ['id', 'abyss'], where: {walletAddress: list[i].from}});
                  
                  if(userResult){
  
                    let updateBalance = (list[i].value);
                    listUpdateBalance.push(updateBalance);
                    
                    await depositModel.update({value: list[i].value, statusPayment: list[i].statusPayment, to: list[i].to, userId: userResult.id}, {where: {id: list[i].id}, transaction: transaction});
                    
  
                    list[i] = list[i];
  
                  }
                  
                }

              }

            }

          }

        }

      }

      if(userResult){

        let currentBalance = parseFloat(userResult.abyss);
        updateBalanceResult = (currentBalance + utility.sumList(listUpdateBalance));
        await userModel.update({abyss: updateBalanceResult}, {where: {id: userResult.id}, transaction: transaction});

      }

    }

    return list;
    
  }
  catch(error){
    await transaction.rollback();
  }

};
