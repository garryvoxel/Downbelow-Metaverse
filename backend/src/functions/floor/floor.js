'use strict';
const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const typePartyContract = require('../../models/typePartyContract');
const floor = require('../../models/floor');
const floorModel = floor();
const typePartyContractModel = typePartyContract();

module.exports.floorShow = async (event) => {

  try {

    floorModel.belongsTo(typePartyContractModel, { foreignKey : 'typePartyContractId'});

    let listFloor;
    let filter = { where: {status: 1}, order: [['createdAt', 'ASC']], limit: utility.totalRecordPagination() };
    let include = [
      { model: typePartyContractModel, where: {status: 1}, required: false }
    ];
    
    filter.include = include;
    
    if(event.pathParameters){
      filter.where.id = event.pathParameters.id;
      listFloor = await floorModel.findOne(filter);
    }
    else{
      listFloor = await floorModel.findAll(filter);
    }
    
    return returnMessage.generic(200, listFloor);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.floorCreate = async (event) => {

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);

    const { name, typePartyContractId } = body;

    if (!name || !typePartyContractId) {

      return returnMessage.generic(400, {
        message: 'name and typePartyContractId are all required in the body',
      });
    
    }

    let floorCreate = {};
    
    if(!body.id){

      body.status = 1;
      floorCreate = await floorModel.create(body, { transaction: transaction });

    }
    else{

      await floorModel.update(body, {where: {id: body.id}, transaction: transaction});
      floorCreate = body;

    }

    await transaction.commit();
    
    return returnMessage.generic(201, floorCreate);
    
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};