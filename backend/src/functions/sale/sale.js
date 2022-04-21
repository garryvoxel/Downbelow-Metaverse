'use strict';
const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const user = require('../../models/user');
const sale = require('../../models/sale');
const itemSale = require('../../models/itemSale');
const product = require('../../models/product');
const transactionAbyssUnclaimed = require('../../models/transactionAbyssUnclaimed');
const transactionAbyssClaimed = require('../../models/transactionAbyssClaimed');
const saleModel = sale();
const userModel = user();
const itemSaleModel = itemSale();
const productModel = product();
const transactionAbyssUnclaimedModel = transactionAbyssUnclaimed();
const transactionAbyssClaimedModel = transactionAbyssClaimed();

module.exports.saleShow = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  try {

    saleModel.hasMany(itemSaleModel, { foreignKey : 'saleId'});
    
    let listSale;
    let filter = { where: {status: 1}, limit: utility.totalRecordPagination() };

    let include = [
      { model: itemSaleModel, where: {status: 1}, required: false },
    ];

    filter.include = include;
    filter.where.userId = resultUserDataSession.id;
    
    if(event.pathParameters){

      filter.where.id = event.pathParameters.id;
      
      listSale = await saleModel.findOne(filter);
    
    }
    else{
      listSale = await saleModel.findAll(filter);
    }
    
    return returnMessage.generic(200, listSale);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.saleCreate = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    let bodyUpdateUser = {};
    let currentBalance = 0;
    let balanceUpdate = 0;

    const { amount, total, userId, paymentMethod, itemSale } = body;

    if (!amount || !total || !userId || !paymentMethod || !itemSale) {

      return returnMessage.generic(400, {
        message: 'amount, total, userId, paymentMethod and itemSale are all required in the body',
      });
    
    }

    if(body.amount <= 0){
      return returnMessage.generic(400, {
        message: 'Total amount not allowed'
      });
    }

    if(body.total <= 0){
      return returnMessage.generic(400, {
        message: 'Total not allowed'
      });
    }

    if(body.paymentMethod != 'abyssClaimed' && body.paymentMethod != 'abyssUnclaimed'){
      return returnMessage.generic(400, {
        message: 'Payment method not allowed'
      });
    }

    if(resultUserDataSession.id != body.userId){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    let userResult = await userModel.findOne({where: {id: body.userId, status: 1}});

    if(!userResult){
      return returnMessage.generic(400, {
        message: 'User not found'
      });
    }

    if(body.itemSale.length <= 0){
      return returnMessage.generic(400, {
        message: 'Total items not allowed'
      });
    }

    let verifySaleData = await verifySale(body);

    if(!verifySaleData){
      return returnMessage.generic(400, {
        message: 'Incompatible sales data'
      });
    }

    let saleCreate = {};
    
    if(!body.id){

      body.status = 1;
      saleCreate = await saleModel.create(body, { transaction: transaction });

    }
    else{

      await saleModel.update(body, {where: {id: body.id}, transaction: transaction});
      saleCreate = body;

    }

    let createListItem = await createItemSale(saleCreate.id, userResult.id, body.itemSale || [], transaction);

    if(!createListItem){

      await transaction.rollback();

      return returnMessage.generic(400, {
        message: 'Invalid item list'
      });
    }

    if(body.paymentMethod == 'abyssClaimed'){
      
      currentBalance = parseFloat(userResult.abyss);
      balanceUpdate = (currentBalance - parseFloat(body.total));
      bodyUpdateUser.abyss = balanceUpdate;

      let bodyTransactionAbyssClaimed = {
        type: 'DEBIT', 
        value: parseFloat(body.total), 
        contents: 'Buy in store', 
        status: 1, 
        userId: userResult.id
      }

      await transactionAbyssClaimedModel.create(bodyTransactionAbyssClaimed, { transaction: transaction });

    }
    else if(body.paymentMethod == 'abyssUnclaimed'){
      
      currentBalance = parseFloat(userResult.abyssUnclaimed);
      balanceUpdate = (currentBalance - parseFloat(body.total));
      bodyUpdateUser.abyssUnclaimed = balanceUpdate;

      let bodyTransactionAbyssUnclaimed = {
        type: 'DEBIT', 
        value: parseFloat(body.total), 
        contents: 'Buy in store', 
        status: 1, 
        userId: userResult.id
      }
  
      await transactionAbyssUnclaimedModel.create(bodyTransactionAbyssUnclaimed, { transaction: transaction });

    }

    if(currentBalance < parseFloat(body.total)){

      await transaction.rollback();

      return returnMessage.generic(400, {
        message: 'Insufficient balance'
      });
    }

    await userModel.update(bodyUpdateUser, {where: {id: userResult.id}, transaction: transaction});
    await saleModel.update({statusPayment: 1, paymentMethod: body.paymentMethod}, {where: {id: saleCreate.id}, transaction: transaction});

    await transaction.commit();
    
    return returnMessage.generic(201, saleCreate);
    
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

async function createItemSale(saleId, userId, list = [], transaction) {

  let result = false;

  try{

    if(list.length > 0){

      for (var i = 0; i < list.length; i++) {

        let itemSale = {};
  
        if(!list[i].id){

          if(parseInt(list[i].amount) > 0){

            itemSale.amount = list[i].amount;
            itemSale.price = parseFloat(list[i].price);
            itemSale.total = parseFloat(list[i].total);
            itemSale.saleId = saleId;
            itemSale.productId = list[i].productId;
            itemSale.userId = userId;
            itemSale.status = 1;

            await itemSaleModel.create(itemSale, {transaction: transaction});

            let isQueenStoneStoneRationsOne = await isStockQueenStoneRations(list[i].productId);
            
            if(isQueenStoneStoneRationsOne.name == 'Queen Stone'){
              await updateBalanceQueenStone(userId, itemSale.amount, transaction);
            }

            if(isQueenStoneStoneRationsOne.name == 'Rations'){
              await updateBalanceRations(userId, itemSale.amount, transaction);
            }

          }
          
        }
        else{
          
          list[i].price = parseFloat(list[i].price);
          list[i].total = parseFloat(list[i].total);
          itemSale = list[i];
          await itemSaleModel.update(itemSale, {where: {id: list[i].id}, transaction: transaction});
        
        }
      
      }

      result = true;

    }

  }
  catch(error){
    await transaction.rollback();
  }

  return result;

};

async function verifySale(bodySale) {

  let response = false;

  try {

    if(bodySale.itemSale.length > 0){

      let itemSale = bodySale.itemSale;
      let listAmountTotalProductItem = [];
      let listPriceTotalProductItem = [];
      
      let totalListAmountProductItem = 0;
      let totalListPriceProductItem = 0;

      for (var i = 0; i < itemSale.length; i++) {
        
        let product = await productModel.findOne({
          attributes: ['price'],
          where: {id: itemSale[i].productId}
        });

        if(product){
          listAmountTotalProductItem.push( (parseInt(itemSale[i].amount)) );
          listPriceTotalProductItem.push( (parseFloat(product.price)) * (parseInt(itemSale[i].amount)) );
        }
        
      }

      totalListAmountProductItem = utility.sumList(listAmountTotalProductItem);
      totalListPriceProductItem = utility.sumList(listPriceTotalProductItem);

      if(totalListAmountProductItem == parseInt(bodySale.amount) && totalListPriceProductItem == parseFloat(bodySale.total)){
        response = true;
      }

    }
    
  } catch (error) {
    
  }

  return response;

};

async function updateBalanceQueenStone(userId, total, transaction) {
  
  let result = false;

  try{

    let resultUser = await userModel.findOne({where: {id: userId, status: 1}});

    if(resultUser){

      let currentBalanceQueenStone = parseFloat(resultUser.queenStone);
      let balanceUpdateQueenStone = (currentBalanceQueenStone + total);
      await userModel.update({queenStone: balanceUpdateQueenStone}, {where: {id: resultUser.id}, transaction: transaction});
      result = true;

    }

  }
  catch(error){
    await transaction.rollback();
  }

  return result;

}

async function updateBalanceRations(userId, total, transaction) {
  
  let result = false;

  try{

    let resultUser = await userModel.findOne({where: {id: userId, status: 1}});

    if(resultUser){

      let currentBalanceRations = parseFloat(resultUser.rations);
      let balanceUpdateRations = (currentBalanceRations + total);
      await userModel.update({rations: balanceUpdateRations}, {where: {id: resultUser.id}, transaction: transaction});
      result = true;

    }

  }
  catch(error){
    await transaction.rollback();  
  }

  return result;

}

const isStockQueenStoneRations = async function(id){

  let result = null;

  let resultProduct = await productModel.findOne({where: {id: id, status: 1}, limit: 1});

  if(resultProduct){
    result = resultProduct;
  }

  return result;

};