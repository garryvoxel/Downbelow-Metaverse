'use strict';
const op  = require("sequelize").Op;
const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const user = require('../../models/user');
const party = require('../../models/party');
const partyContract = require('../../models/partyContract');
const userParty = require('../../models/userParty');
const floor = require('../../models/floor');
const transactionAbyssUnclaimed = require('../../models/transactionAbyssUnclaimed');
const transactionAbyssClaimed = require('../../models/transactionAbyssClaimed');
const partyContractModel = partyContract();
const floorModel = floor();
const userPartyModel = userParty();
const partyModel = party();
const userModel = user();
const transactionAbyssUnclaimedModel = transactionAbyssUnclaimed();
const transactionAbyssClaimedModel = transactionAbyssClaimed();
var moment = require('moment');

module.exports.partyContractShow = async (event) => {

  try {

    let listPartyContract;
    let filter = { where: {status: 1}, limit: utility.totalRecordPagination() };

    if(event.pathParameters){
      filter.where.id = event.pathParameters.id;
      listPartyContract = await partyContractModel.findOne(filter);
    }
    else{
      listPartyContract = await partyContractModel.findAll(filter);
    }
    
    return returnMessage.generic(200, listPartyContract);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.partyContractCreate = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    let bodyUpdateUser = {};
    let currentBalance = 0;
    let balanceUpdate = 0;
    const { typeContract, paymentMethod, partyId } = body;

    if (!typeContract || !paymentMethod || !partyId) {

      return returnMessage.generic(400, {
        message: 'typeContract, paymentMethod and partyId are all required in the body',
      });
    
    }

    if(paymentMethod != 'abyssClaimed' && paymentMethod != 'abyssUnclaimed'){
      return returnMessage.generic(400, {
        message: 'Payment method not allowed'
      });
    }

    userPartyModel.belongsTo(partyModel, { foreignKey : 'partyId'});
    userPartyModel.belongsTo(userModel, { foreignKey : 'userId'});
    let resultUserParty = await userPartyModel.findOne(
      {
        where: {userId: resultUserDataSession.id, partyId: body.partyId, status: 1},
        include: [
          {model: partyModel, where: {status: 1}, required: false},
          {model: userModel, where: {status: 1}, required: false}
        ]
      }
    );

    if(!resultUserParty){
      return returnMessage.generic(400, {
        message: 'UserParty not found'
      });
    }

    if(resultUserParty.party.partyContractId){

      let validPartyContractActive = await utility.validPartyContractActive(resultUserParty.party.partyContractId);

      if(validPartyContractActive){
        return returnMessage.generic(400, {
          message: 'This party already has a contract'
        });
      }
    
    }

    let resultFloor = await floorModel.findOne(
      {
        where: {apRequirement: {[op.lte]: resultUserParty.party.ap } , status: 1}, order: [['createdAt', 'DESC']]
      }
    );

    if(!resultFloor){
      return returnMessage.generic(400, {
        message: "Party's AP is too low"
      });
    }

    if(body.typeContract != "1" && body.typeContract != "2"){
      return returnMessage.generic(400, {
        message: 'typeContract not found'
      });
    }

    let duration = 0;
    let priceContract = 0;

    if(body.typeContract == "1"){
      duration = 1;
      priceContract = parseFloat(resultFloor.contract1Day);
    }
    else if(body.typeContract == "2"){
      duration = 7;
      priceContract = parseFloat(resultFloor.contract7Day);
    }

    if(body.paymentMethod == 'abyssClaimed'){
      
      currentBalance = parseFloat(resultUserParty.user.abyss);

      if(currentBalance == 0){
        return returnMessage.generic(400, {
          message: 'Insufficient balance abyssClaimed'
        });
      }

      balanceUpdate = (currentBalance - priceContract);
      bodyUpdateUser.abyss = balanceUpdate;

      let bodyTransactionAbyssClaimed = {
        type: 'DEBIT', 
        value: priceContract, 
        contents: 'Buy contract', 
        status: 1, 
        userId: resultUserParty.user.id
      }

      await transactionAbyssClaimedModel.create(bodyTransactionAbyssClaimed, { transaction: transaction });

    }
    else if(body.paymentMethod == 'abyssUnclaimed'){
      
      currentBalance = parseFloat(resultUserParty.user.abyssUnclaimed);

      if(currentBalance == 0){
        return returnMessage.generic(400, {
          message: 'Insufficient balance abyssUnclaimed'
        });
      }

      balanceUpdate = (currentBalance - priceContract);
      bodyUpdateUser.abyssUnclaimed = balanceUpdate;

      let bodyTransactionAbyssUnclaimed = {
        type: 'DEBIT', 
        value: priceContract, 
        contents: 'Buy contract', 
        status: 1, 
        userId: resultUserParty.user.id
      }
  
      await transactionAbyssUnclaimedModel.create(bodyTransactionAbyssUnclaimed, { transaction: transaction });

    }
    
    if(currentBalance < priceContract){
      return returnMessage.generic(400, {
        message: 'Insufficient balance'
      });
    }

    let partyContractCreate = {};
    
    if(!body.id){

      body.startDate = moment(new Date());
      body.endDate = moment(new Date()).add('days', duration);
      body.maximumOfDay = duration;
      body.status = 1;
      body.value = priceContract;
      body.paymentMethod = body.paymentMethod;
      partyContractCreate = await partyContractModel.create(body, { transaction: transaction });

      
      await userModel.update(bodyUpdateUser, {where: {id: resultUserParty.user.id}, transaction: transaction});
      await partyModel.update({partyContractId: partyContractCreate.id}, {where: {id: body.partyId}, transaction: transaction});

    }
    else{

      delete body.startDate;
      delete body.endDate;
      delete body.maximumOfDay;
      delete body.breachOfContract;
      delete body.paymentMethod;
      delete body.value;

      await partyContractModel.update(body, {where: {id: body.id}, transaction: transaction});
      partyContractCreate = body;

    }

    await transaction.commit();
    
    return returnMessage.generic(201, partyContractCreate);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.partyContractBreachOfContract = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    const { partyContractId } = body;

    if (!partyContractId) {

      return returnMessage.generic(400, {
        message: 'Party does not have a contract',
      });
    
    }

    let resultPartyContract = await partyContractModel.findOne({where: {id: body.partyContractId}});
    let resultParty = await partyModel.findOne({where: {partyContractId: body.partyContractId}});
    
    if(!resultPartyContract && !resultParty){
      return returnMessage.generic(400, {
        message: 'Party contract not found'
      });
    }

    if(resultParty.exhausted == 1){
      return returnMessage.generic(400, {
        message: 'Exhausted partys cannot be edited'
      });
    }

    let resultUserParty = await userPartyModel.findOne({where: {partyId: resultParty.id, userId: resultUserDataSession.id}});

    if(!resultUserParty){
      return returnMessage.generic(400, {
        message: 'Party Contract does not belong to the user'
      });
    }

    let validPartyContractActive = await utility.validPartyContractActive(body.partyContractId);

    if(!validPartyContractActive){
      return returnMessage.generic(400, {
        message: 'Party contract expired'
      });
    }
    

    let partyContractCreate = {};
    await partyContractModel.update({breachOfContract: 1, status: 0}, {where: {id: body.partyContractId}, transaction: transaction});
    await partyModel.update({partyContractId: null}, {where: {id: resultParty.id}, transaction: transaction});
    partyContractCreate = body;
    
    await transaction.commit();
    
    return returnMessage.generic(200, partyContractCreate);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};