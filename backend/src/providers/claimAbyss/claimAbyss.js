'use strict';
const op  = require("sequelize").Op;
const transactionAbyssUnclaimed = require('../../models/transactionAbyssUnclaimed');
const transactionAbyssUnclaimedModel = transactionAbyssUnclaimed();
const moment = require('moment');

const maxDayFee = 20;

const listPercentagemFee = {
     0: 60,
     1: 57,
     2: 54,
     3: 51,
     4: 48,
     5: 45,
     6: 42,
     7: 39,
     8: 36,
     9: 33,
    10:	30,
    11:	27,
    12:	24,
    13:	21,
    14:	18,
    15:	15,
    16:	12,
    17:	9,
    18:	6,
    19:	3,
    20:	0, 
};

module.exports.estimatedFee = async function(userId){
    
    let result = 0;
    
    try {

        let daysTraveledResult = await daysTraveled(userId);
        result = listPercentagemFee[(daysTraveledResult > maxDayFee) ? maxDayFee : daysTraveledResult];
        
    }
    catch(error){
        
    }

    return result;
    
};

async function daysTraveled(userId){
    
    let result = 0;
    
    try {

        let dateNow = moment(new Date());
        let dateLestClaime = moment(new Date());
    
        let lestTransactionAbyssUnclaimedToClaimedDebit = await transactionAbyssUnclaimedModel.findOne({where: {userId: userId, type: 'DEBIT', contents: 'Transfer AbyssUnclaimed to AbyssClaimed'}, order: [['createdAt','DESC']] }); 
        
        if(lestTransactionAbyssUnclaimedToClaimedDebit){
            dateLestClaime = moment(lestTransactionAbyssUnclaimedToClaimedDebit.createdAt);
        }
        
        let lestTransactionAbyssUnclaimedToClaimedCredit = await transactionAbyssUnclaimedModel.findOne({where: {userId: userId, type: 'CREDIT', createdAt: {[op.gte]: dateLestClaime }}, order: [['createdAt','ASC']] }); 

        if(!lestTransactionAbyssUnclaimedToClaimedCredit){
            dateLestClaime = dateNow;
        }

        if(!lestTransactionAbyssUnclaimedToClaimedDebit){
            let firstTransactionAbyssUnclaimedCredit = await transactionAbyssUnclaimedModel.findOne({where: {userId: userId, type: 'CREDIT'}, order: [['createdAt','ASC']] });
            dateLestClaime = moment(firstTransactionAbyssUnclaimedCredit.createdAt);
        }

        let duration = moment.duration(dateNow.diff(dateLestClaime));
        let days = duration.asDays();
        
        days = (days < 0) ? 0 : days;

        result = parseInt(days);

    }
    catch(error){
        
    }

    return result;
    
};