'use strict';
const returnMessage = require('../../helpers/returnMessage');

module.exports.homeShow = async (event) => {

  try {

    return returnMessage.generic(200, {message: `Down Below API ${process.env.V_API}`});
    
  } catch (error) {
    
    return returnMessage.generic(500, error);
  
  }
  
};