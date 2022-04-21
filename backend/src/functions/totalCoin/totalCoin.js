'use strict';

const returnMessage = require('../../helpers/returnMessage');
const abiAbyysToken = require('../../helpers/abyysToken');

module.exports.totalCoinShow = async (event) => {

  try {

    let totalSuplay = await abiAbyysToken.totalSupply();
    
    return returnMessage.generic(200, parseFloat(totalSuplay));
    
  
  } catch (error) {
    
    return returnMessage.generic(500, error);
  
  }
  
};
