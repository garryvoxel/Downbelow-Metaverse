'use strict';

const utility = require('../../helpers/utility');
const returnMessage = require('../../helpers/returnMessage');
const character = require('../../models/character');
const characterModel = character();

module.exports.characterShow = async (event) => {

  try {

    let listCharacter;
    let filter = { where: {status: 1}, limit: utility.totalRecordPagination() };
    
    if(event.pathParameters){
      filter.where.id = event.pathParameters.id;
      listCharacter = await characterModel.findOne(filter);
    }
    else{
      listCharacter = await characterModel.findAll(filter);
    }
    
    return returnMessage.generic(200, listCharacter);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.characterCreate = async (event) => {

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    const { className } = body;

    if (!className) {

      return returnMessage.generic(400, {
        message: 'className is mandatory in the body',
      });
    
    }

    let characterCreate = {};
    
    if(!body.id){

      body.status = 1;
      characterCreate = await characterModel.create(body, { transaction: transaction });
    
    }
    else{

      await characterModel.update(body, {where: {id: body.id}, transaction: transaction});
      characterCreate = body;

    }

    await transaction.commit();
    
    return returnMessage.generic(201, characterCreate);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};