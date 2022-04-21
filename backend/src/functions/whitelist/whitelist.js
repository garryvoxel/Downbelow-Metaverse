'use strict';

const utility = require('../../helpers/utility');
const returnMessage = require('../../helpers/returnMessage');
const whitelist = require('../../models/whitelist');
const whitelistModel = whitelist();

module.exports.whitelistShow = async (event) => {

  try {

    let listResult = [];
    let listWhitelist;
    let filter = { attributes: ['id'], where: {}, limit: utility.totalRecordPagination() };
    
    if(event.pathParameters){
      filter.where.id = event.pathParameters.id;
      listWhitelist = await whitelistModel.findOne(filter);
      if(listWhitelist){
        listResult = listWhitelist;
      }
    }

    return returnMessage.generic(200, listResult);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};