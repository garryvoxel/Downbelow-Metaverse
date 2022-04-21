'use strict';
const purchaseWhitelist = require('../models/purchaseWhitelist');
const partyContract = require('../models/partyContract');
const idlePveMode = require('../models/idlePveMode');
const smugglerConfig = require('../models/smugglerConfig');
const connectionDB = require('./connection');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRESIN = process.env.JWT_EXPIRESIN;
const purchaseWhitelistModel = purchaseWhitelist();
const idlePveModeModel = idlePveMode();
const partyContractModel = partyContract();
const smugglerConfigModel = smugglerConfig();
const moment = require('moment');

module.exports.totalRecordPagination = function(){
    return 50;
};

module.exports.setPagination = async function(model, filter){

    let result = null;

    try{

        result = await model.paginate(filter);

        if(result){
            result.currentPage = (filter.page) ? filter.page : 1;
            result.perPage = (filter.paginate) ? filter.paginate : 1;
        }

    }
    catch(error){
        
    }
    
    return result;

};

module.exports.newToken = function(size = 5){
    
    let token = randToken.generate(size);

    return token;

};

module.exports.getUserDataSession = function(event){
    
    let result = null;

    if(event){

        const authorizationToken = event.headers.Authorization.split(' ')[1];
        const resultJwtDecode = this.jwtDecode(authorizationToken);

        if(resultJwtDecode){
            
            result = resultJwtDecode;
        }

    }
    
    return result;

};

module.exports.getAuthorizationToken = function(event){
    
    let result = null;
    
    const authorizerToken = event.authorizationToken;
    
    if(authorizerToken){

        const authorizerArr = authorizerToken.split(' ');

        if(authorizerArr.length === 2 && authorizerArr[0] === 'Bearer' && authorizerArr[1].length !== 0) {
            
            const token = authorizerArr[1];

            result = token
            
        }

    }
    
    return result;

};

module.exports.jwtDecode = function(token){
    
    let result = null;

    if(token){

        let decodedJwt = jwt.verify(token, JWT_SECRET);
        result = decodedJwt;

    }
    
    return result;

};

module.exports.jwtSign = function(payload, subject = null){
    
    let tokenJwt = jwt.sign(
        payload,
        JWT_SECRET,
        { 
            subject: subject,  
            expiresIn: JWT_EXPIRESIN,
            algorithm: 'HS256' 
        }
    );

    return tokenJwt;

};

module.exports.sumList = function(list){
    
    return list.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);

};

module.exports.arrayColumn = function(arr, column){
    
    return arr.map(item => item[column]);

};

module.exports.sequelizeTransaction = async function(){

    let connection = connectionDB();
    
    let transaction = connection.transaction();

    return transaction;

};


module.exports.totalizerWhitelist = async function(){

    const publicSale = true;
    const limitTotal = 343; 
    const limitStandardPack = 305; 
    const limitEpicPack = 38; 

    let totalizer = {
        purchasePublic: false, 
        limitTotal: limitTotal, 
        limitStandardPack: limitStandardPack, 
        limitEpicPack: limitEpicPack, 
        totalPurchaseStandardPack: 0, 
        totalPurchaseEpicPack: 0
    };

    let resultPurchaseWhitelistStandardPack = await purchaseWhitelistModel.count({where: {starterPacksId: '1'}});
    let resultPurchaseWhitelistEpicPack = await purchaseWhitelistModel.count({where: {starterPacksId: '2'}});

    totalizer.totalPurchaseStandardPack = resultPurchaseWhitelistStandardPack;
    totalizer.totalPurchaseEpicPack = resultPurchaseWhitelistEpicPack;

    if(publicSale){
        totalizer.purchasePublic = true;
    }

    return totalizer;
    
};

module.exports.validPartyContractActive = async function(partyContractId){

    let result = false;

    try{

        if(partyContractId){

            let partyContractResult = await partyContractModel.findOne({where: {id: partyContractId, status: 1}});
            
            if(partyContractResult){
                
                let dateNow = moment(new Date());
                let endDate =  moment(partyContractResult.endDate);
                let duration = moment.duration(endDate.diff(dateNow));
                let daysRemaining = duration.asDays();
                
                if(daysRemaining > 0){
                    result = true;
                }
                
            }
    
        }

    }
    catch(errro){

    }

    return result;

};

module.exports.expeditionPartyContractTime = async function(endDate){

    let result = 0;

    if(endDate){

        endDate = moment(endDate);
        let dateNow = moment(new Date());
        let duration = moment.duration(endDate.diff(dateNow));
        let seconds = duration.asSeconds();

        seconds = (seconds > 0) ? seconds : 0;

        result = seconds;

    }

    return result = (result > 0) ? result: 0;

};

module.exports.expeditionIdlePVETime = async function(userId, partyId){

    let result = 0;

    if(userId && partyId){

        let resultLasIdleEvent = await idlePveModeModel.findOne({attributes: ['createdAt'], where: {userId: userId, partyId: partyId, status: 1}, order: [['createdAt', 'DESC']]});

        if(resultLasIdleEvent){
        
            let secondsDay = (1440 * 60);
        
            let dateIdleEvent = moment(resultLasIdleEvent.createdAt);
            let dateNow = moment(new Date());
            let duration = moment.duration(dateNow.diff(dateIdleEvent));
            let seconds = duration.asSeconds();
        
            seconds = (seconds > 0) ? seconds : 0;
        
            result = (secondsDay - seconds);
            
        }

    }
  
    return result = (result > 0) ? result: 0;

};

module.exports.isFullGenesis = async function(list){

    let result = false;
  
    let listIsGenesis = {0: {ts: 0, tw: 0, s: [], w: []}, 1: {ts: 0, tw: 0, s: [], w: []}, 2: {ts: 0, tw: 0, s: [], w: []}, 3: {ts: 0, tw: 0, s: [], w: []}};
  
    let listuserCharacterGenesis = [];
    
    if(list.length > 0){
      
      for (var i = 0; i < list.length; i++) {
  
        if(list[i].isGenesis == 1){
          listuserCharacterGenesis.push(list[i]);  
        }
        
      }
  
      if(listuserCharacterGenesis.length >= 4){
  
        for (var ic = 0; ic < listuserCharacterGenesis.length; ic++) {
  
          if(listuserCharacterGenesis[ic].userCharacterSkills.length > 0){
            
            listIsGenesis[ic].ts = listuserCharacterGenesis[ic].userCharacterSkills.length;
  
            for (var ics = 0; ics < listuserCharacterGenesis[ic].userCharacterSkills.length; ics++) {
  
              if(listuserCharacterGenesis[ic].userCharacterSkills[ics].userSkill.isGenesis == 1){
                listIsGenesis[ic].s.push(1);
              }
  
            }
            
          }
          
          if(listuserCharacterGenesis[ic].userCharacterWeapons.length > 0){
  
            listIsGenesis[ic].tw = listuserCharacterGenesis[ic].userCharacterWeapons.length;
  
            for (var icw = 0; icw < listuserCharacterGenesis[ic].userCharacterWeapons.length; icw++) {
  
              if(listuserCharacterGenesis[ic].userCharacterWeapons[icw].userWeapon.isGenesis == 1){
                listIsGenesis[ic].w.push(1);
              }
  
            }
  
          }
  
        }
  
        if( (listIsGenesis[0].ts == listIsGenesis[0].s.length && listIsGenesis[0].tw == listIsGenesis[0].w.length) &&  (listIsGenesis[1].ts == listIsGenesis[1].s.length && listIsGenesis[1].tw == listIsGenesis[1].w.length) && (listIsGenesis[2].ts == listIsGenesis[2].s.length && listIsGenesis[2].tw == listIsGenesis[2].w.length) && (listIsGenesis[3].ts == listIsGenesis[3].s.length && listIsGenesis[3].tw == listIsGenesis[3].w.length)){
          result = true;
        }
  
      }
  
    }
  
    return result;
  
  };

module.exports.smugglerIsOpen = async function(){

    let result = {isOpen: 0, startDate: null, endDate: null};

    try{

        let date = moment(new Date());
        let startDate = moment(new Date());
        let endDate = moment(new Date());
        let smugglerConfiResult = await smugglerConfigModel.findOne({where: {status: 1}, order: [['endDate', 'DESC']], limit: 1});

        result.startDate = startDate;
        result.endDate = endDate;

        if(smugglerConfiResult){

            if(smugglerConfiResult.startDate){
    
                startDate = moment(smugglerConfiResult.startDate);
            }
    
            if(smugglerConfiResult.endDate){
                
                endDate = moment(smugglerConfiResult.endDate);
            }
    
            let duration = moment.duration(date.diff(startDate));
            let hours = duration.asHours();
            
            let durationWeeks = moment.duration(endDate.diff(date));
            let weeks = durationWeeks.asWeeks();
    
            if(hours <= 24){
                result.isOpen = 1;
                result.startDate = startDate;
                result.endDate = endDate;
            }

            if(weeks <= 0){

                let dateAdd = date.add(7, 'days');

                await smugglerConfigModel.update({startDate: date, endDate: dateAdd}, {where: {id: smugglerConfiResult.id}});

                result.isOpen = 0;
                result.startDate = date;
                result.endDate = dateAdd;

            }
    
        }

    }
    catch(error){
        
    }

    return result;

};