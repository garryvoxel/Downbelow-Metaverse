'use strict';

const utility = require('../../helpers/utility');
const returnMessage = require('../../helpers/returnMessage');
const weapon = require('../../models/weapon');
const weaponModel = weapon();

module.exports.weaponShow = async (event) => {

  try {
    
    let listWeapon;
    let filter = { where: {status: 1}, limit: utility.totalRecordPagination() };
    
    if(event.pathParameters){
      filter.where.id = event.pathParameters.id;
      listWeapon = await weaponModel.findOne(filter);
    }
    else{
      listWeapon = await weaponModel.findAll(filter);
    }
    
    return returnMessage.generic(200, listWeapon);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.weaponCreate = async (event) => {

  const transaction = await utility.sequelizeTransaction();

  try {

    const { description } = JSON.parse(event.body);

    if (!description) {

      return returnMessage.generic(400, {
        message: 'description is mandatory in the body',
      });
    
    }

    let body = JSON.parse(event.body);
    let weaponCreate = {};
    
    if(!body.id){

      body.status = 1;
      weaponCreate = await weaponModel.create(body, { transaction: transaction });

    }
    else{

      await weaponModel.update(body, {where: {id: body.id}, transaction: transaction });
      weaponCreate = body;

    }

    await transaction.commit();
    
    return returnMessage.generic(201, weaponCreate);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};