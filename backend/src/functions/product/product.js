'use strict';
const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const product = require('../../models/product');
const productModel = product();

module.exports.productShow = async (event) => {

  try {
    
    let listProduct;
    let filter = { where: {status: 1}, limit: utility.totalRecordPagination() };
    
    if(event.pathParameters){
      filter.where.id = event.pathParameters.id;
      listProduct = await productModel.findOne(filter);
    }
    else{
      listProduct = await productModel.findAll(filter);
    }
    
    return returnMessage.generic(200, listProduct);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.productCreate = async (event) => {

  const transaction = await utility.sequelizeTransaction();

  try {

    const { name } = JSON.parse(event.body);

    if (!name) {

      return returnMessage.generic(400, {
        message: 'name is mandatory in the body',
      });
    
    }

    let body = JSON.parse(event.body);
    let productCreate = {};
    
    if(!body.id){

      body.status = 1;
      productCreate = await productModel.create(body, { transaction: transaction });

    }
    else{

      await productModel.update(body, {where: {id: body.id}, transaction: transaction});
      productCreate = body;

    }

    await transaction.commit();
    
    return returnMessage.generic(201, productCreate);
    
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};