'use strict';

const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const userParty = require('../../models/userParty');
const party = require('../../models/party');
const partyContract = require('../../models/partyContract'); 
const partyCharacter = require('../../models/partyCharacter');
const userCharacter = require('../../models/userCharacter');
const userCharacterModel = userCharacter();
const partyCharacterModel = partyCharacter();
const userPartyModel = userParty();
const partyModel = party();
const partyContractModel = partyContract();

module.exports.userPartyShow = async (event) => {

  try {

    const resultUserDataSession = utility.getUserDataSession(event);

    partyModel.belongsTo(partyContractModel, { foreignKey : 'partyContractId'});
    
    partyModel.hasMany(partyCharacterModel, { foreignKey : 'partyId'});
    userPartyModel.belongsTo(partyModel, { foreignKey : 'partyId'});
    userCharacterModel.hasMany(partyCharacterModel, { foreignKey : 'userCharacterId'});
    
    let listUserParty = null;
    let filter = { where: {status: 1}, order: [['createdAt', 'DESC']] };
    let include = [
      { 
        model: partyModel, 
        where: {status: 1}, 
        required: false,
        include: [
          { model: partyContractModel, where: {status: 1}, required: false },
          { 
            model: partyCharacterModel, 
            where: {status: 1}, 
            required: false 
          }
        ] 
      },
    ];

    filter.include = include;
    filter.where.userId = resultUserDataSession.id;
    if(event.pathParameters){

      filter.where.id = event.pathParameters.id;
      listUserParty = await userPartyModel.findOne(filter);
    }
    else{
      listUserParty = await userPartyModel.findAll(filter);
    }

    if(listUserParty){

      if(Array.isArray(listUserParty) ){

        for (var i = 0; i < listUserParty.length; i++) {

          if(listUserParty[i].party){
            
            let exhaustedTimeSecondsRemaining = await utility.expeditionIdlePVETime(listUserParty[i].userId, listUserParty[i].party.id);

            listUserParty[i].party.setDataValue('exhaustedTimeSecondsRemaining', exhaustedTimeSecondsRemaining);

            await isPartyNotExhausted(listUserParty[i].party.id, exhaustedTimeSecondsRemaining);

            if(listUserParty[i].party.partyContract){

              let timeRemaining = await utility.expeditionPartyContractTime(listUserParty[i].party.partyContract.endDate);
              listUserParty[i].party.partyContract.setDataValue('timeRemaining', timeRemaining);
  
            }

          }

        }
  
      }
      
    }

    return returnMessage.generic(200, listUserParty);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};


async function isPartyNotExhausted(partyId, exhausted){

  let result = true;

  let updateExhausted = (exhausted > 0) ? 1 : 0;
  
  await partyModel.update({exhausted: updateExhausted}, {where: {id: partyId}});

  return result;

}