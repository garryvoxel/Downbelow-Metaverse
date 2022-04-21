'use strict';

const utility = require('../../helpers/utility');
const returnMessage = require('../../helpers/returnMessage');
const skill = require('../../models/skill');
const skillModel = skill();

module.exports.skillShow = async (event) => {

  try {
    
    let listSkill;
    let filter = { where: {status: 1}, limit: utility.totalRecordPagination() };
    
    if(event.pathParameters){
      filter.where.id = event.pathParameters.id;
      listSkill = await skillModel.findOne(filter);
    }
    else{
      listSkill = await skillModel.findAll(filter);
    }
    
    return returnMessage.generic(200, listSkill);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.skillCreate = async (event) => {

  const transaction = await utility.sequelizeTransaction();

  try {

    const { description } = JSON.parse(event.body);

    if (!description) {

      return returnMessage.generic(400, {
        message: 'description is mandatory in the body',
      });
    
    }

    let body = JSON.parse(event.body);
    let skillCreate = {};
    
    if(!body.id){

      body.status = 1;
      skillCreate = await skillModel.create(body, { transaction: transaction });

    }
    else{

      await skillModel.update(body, {where: {id: body.id}, transaction: transaction});
      skillCreate = body;

    }

    await transaction.commit();
    
    return returnMessage.generic(201, skillCreate);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};