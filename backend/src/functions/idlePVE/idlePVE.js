'use strict';

const idle = require('../../providers/mode/idle/idle');
const utility = require('../../helpers/utility');
const returnMessage = require('../../helpers/returnMessage');
const user = require('../../models/user');
const userParty = require('../../models/userParty');
const party = require('../../models/party');
const floor = require('../../models/floor');
const skill = require('../../models/skill');
const userSkill = require('../../models/userSkill');
const userWeapon = require('../../models/userWeapon');
const weapon = require('../../models/weapon');
const partyCharacter = require('../../models/partyCharacter');
const userCharacter = require('../../models/userCharacter');
const idlePveMode = require('../../models/idlePveMode');
const userCharacterSkill = require('../../models/userCharacterSkill');
const userCharacterWeapon = require('../../models/userCharacterWeapon');
const transactionAbyssUnclaimed = require('../../models/transactionAbyssUnclaimed');
const idlePveModeModel = idlePveMode();
const userModel = user();
const userPartyModel = userParty();
const partyModel = party();
const floorModel = floor();
const partyCharacterModel = partyCharacter();
const userCharacterModel = userCharacter();
const transactionAbyssUnclaimedModel = transactionAbyssUnclaimed();
const userCharacterSkillModel = userCharacterSkill();
const userCharacterWeaponModel = userCharacterWeapon();
const userWeaponModel = userWeapon();
const userSkillModel = userSkill();
const skillModel = skill();
const weaponModel = weapon();

module.exports.idlePVEShow = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  try {

    let listIdlePVE;
    let filter = { where: {status: 1}, order: [['createdAt', 'DESC']], limit: utility.totalRecordPagination() };
    
    filter.where.userId = resultUserDataSession.id;

    listIdlePVE = await idlePveModeModel.findAll(filter);
    
    return returnMessage.generic(200, listIdlePVE);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.idlePVEResult = async (event) => {

  const transaction = await utility.sequelizeTransaction();
  
  const resultUserDataSession = utility.getUserDataSession(event);

  try {

    let body = JSON.parse(event.body);

    const { userId, partyId, floorId } = JSON.parse(event.body);

    if (!userId || !partyId || !floorId) {
      
      return returnMessage.generic(400, {
        message: 'userId, partyId and floorId are all required in the body'
      });
    
    }

    if(resultUserDataSession.id != body.userId){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    let partyResult = await partyModel.findOne({where: {id: body.partyId}});

    if(!partyResult){
      return returnMessage.generic(400, {
        message: 'Party not found'
      });
    }

    if(partyResult.exhausted == 1){
      return returnMessage.generic(400, {
        message: 'Party is exhausted'
      });
    }

    let userResult = await userModel.findOne({where: {id: body.userId}});

    if(!userResult){
      return returnMessage.generic(400, {
        message: 'User not found'
      });
    }

    userPartyModel.belongsTo(partyModel, { foreignKey : 'partyId'});
    let userPartyResult = await userPartyModel.findOne(
      {
        include: [{ model: partyModel, as: 'party', where: {status: 1}, required: false }], 
        where: {userId: body.userId, partyId: body.partyId, status: 1}}
    );
    
    if(!userPartyResult){
      return returnMessage.generic(400, {
        message: 'Party not found'
      });
    }

    if(!userPartyResult.party.partyContractId){
      return returnMessage.generic(400, {
        message: 'Party contract not found'
      });
    }

    if(userPartyResult.party.partyContractId){
      
      let validPartyContractActive = await utility.validPartyContractActive(userPartyResult.party.partyContractId);
  
      if(!validPartyContractActive){
        return returnMessage.generic(400, {
          message: 'Party contract inactive'
        });
      }
      
    }

    let partyCharacterResult = await partyCharacterModel.findAll(
      {
        where: {partyId: userPartyResult.party.id, status: 1}
      }
    );

    if(partyCharacterResult.length <= 0){
      return returnMessage.generic(400, {
        message: 'PartyAdventurer not found'
      });
    }

    let listIdUserCharacter = utility.arrayColumn(partyCharacterResult, 'userCharacterId');

    userWeaponModel.belongsTo(weaponModel, { foreignKey : 'weaponId'});
    userSkillModel.belongsTo(skillModel, { foreignKey : 'skillId'});
    
    userCharacterSkillModel.belongsTo(userSkillModel, { foreignKey : 'userSkillId'});
    userCharacterModel.hasMany(userCharacterSkillModel, { foreignKey : 'userCharacterId'});

    userCharacterWeaponModel.belongsTo(userWeaponModel, { foreignKey : 'userWeaponId'});
    userCharacterModel.hasMany(userCharacterWeaponModel, { foreignKey : 'userCharacterId'});

    let userCharacterResult = await userCharacterModel.findAll(
      {
        where: {id: listIdUserCharacter, status: 1},
        include: [
          { 
            model: userCharacterSkillModel, 
            where: {status: 1}, 
            required: false, 
            include: {model: userSkillModel,  where: {status: 1}, required: false, include: {model: skillModel, where: {status: 1}, required: false} } },
          { 
            model: userCharacterWeaponModel, 
            where: {status: 1}, 
            required: false, 
            include: {model: userWeaponModel, where: {status: 1}, required: false, include: {model: weaponModel, where: {status: 1}, required: false}} 
          }
        ]
      }
    );

    if(userCharacterResult.length <= 0){
      return returnMessage.generic(400, {
        message: "userAdventurer not found"
      });
    }

    let isFullGenesisResult = await isFullGenesis(userCharacterResult);

    let listUserCharacterSkills = [];
    let listUserCharacterWeapons = [];

    for (var i = 0; i < userCharacterResult.length; i++) {

      if(userCharacterResult[i].userCharacterSkills.length > 0){
        listUserCharacterSkills.push(1);
      }

      if(userCharacterResult[i].userCharacterWeapons.length > 0){
        listUserCharacterWeapons.push(1);
      }

    }

    if(listUserCharacterSkills.length < 4 || listUserCharacterWeapons.length < 4){
      return returnMessage.generic(400, {
        message: "A adventurer isn't equipped"
      });
    }

    let floorResult = await floorModel.findOne({where: {id: body.floorId, status: 1}});

    if(!floorResult){
      return returnMessage.generic(400, {
        message: 'Floor not found'
      });
    }

    if(floorResult.apRequirement > userPartyResult.party.ap){
      return returnMessage.generic(400, {
        message: 'Ap Requirement greater than party AP'
      });
    }

    let currentBalanceRetions = parseFloat(userResult.rations);

    if(currentBalanceRetions < parseInt(floorResult.provisionRequirement)){
      return returnMessage.generic(400, {
        message: 'Insufficient balance rations'
      });
    }

    let limitUserCharacterCorruption = await validateLimitUserCharacterCorruption(userCharacterResult);

    if(limitUserCharacterCorruption){
      return returnMessage.generic(400, {
        message: 'One or more itens from this party are corrupted'
      });
    }

    let bonus = 1;

    if(isFullGenesisResult){
      bonus = 3;
    }

    let baseChanceResult = 0;
    let bonusChanceCalc = (userPartyResult.party.ap - floorResult.apRequirement);
    bonusChanceCalc = (bonusChanceCalc / 40);
    let bonusChance = (bonusChanceCalc < 100) ? bonusChanceCalc : 100;
    baseChanceResult = (floorResult.baseChance + bonusChance);

    let idleResult = await idle.result(userPartyResult.party.ap, baseChanceResult, floorResult.apRequirement);

    let idleResultRewards = 0; 
    let idleResultElvenSilver = 0 
    
    if(idleResult.resultRandom){

      idleResult.rewards = parseFloat(floorResult.rewards);
      idleResult.elvenSilver = parseFloat(floorResult.elvenSilver);

      idleResultRewards = (idleResult.rewards * bonus);
      idleResultElvenSilver = (idleResult.elvenSilver * bonus);

      let currentBalanceElvenSilver = parseFloat(userResult.elvenSilver);
      let balanceUpdateElvenSilver = (currentBalanceElvenSilver + idleResultElvenSilver);
    
      let currentBalanceAbyssUnclaimed = parseFloat(userResult.abyssUnclaimed);
      let balanceUpdateAbyssUnclaimed = (currentBalanceAbyssUnclaimed + idleResultRewards);

      let bodyTransactionAbyssUnclaimed = {
        type: 'CREDIT', 
        value: idleResultRewards, 
        contents: 'Reward Idle PVE Mode', 
        status: 1, 
        userId: userResult.id
      };

      await transactionAbyssUnclaimedModel.create(bodyTransactionAbyssUnclaimed, { transaction: transaction });
      await userModel.update({abyssUnclaimed: balanceUpdateAbyssUnclaimed, elvenSilver: balanceUpdateElvenSilver}, {where: {id: userResult.id}, transaction: transaction});

    }

    let balanceUpdaterations = (currentBalanceRetions - parseInt(floorResult.provisionRequirement));
    await userModel.update({rations: balanceUpdaterations}, {where: {id: userResult.id}, transaction: transaction});

    await userCharacterCorruptionCreate(userCharacterResult, transaction);

    let bodyIdlePve = {
      resultRandom: idleResult.resultRandom, 
      randomBaseChance: idleResult.randomBaseChance, 
      result: idleResult.result, 
      apParty: idleResult.apParty, 
      baseChance: floorResult.baseChance,
      bonusChance: bonusChance,
      baseChanceResult: baseChanceResult, 
      apRequirement: idleResult.apRequirement, 
      multiplier: idleResult.multiplier, 
      rewards: idleResultRewards, 
      elvenSilver: idleResultElvenSilver, 
      status: 1, 
      userId: userResult.id,
      floorId: body.floorId,
      partyId: body.partyId
    };

    await idlePveModeModel.create(bodyIdlePve, { transaction: transaction });
    await partyModel.update({exhausted: 1}, {where: {id: body.partyId}, transaction: transaction});
    
    await transaction.commit();

    return returnMessage.generic(200, bodyIdlePve);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error);
  
  }
  
};

async function validateLimitUserCharacterCorruption(list = []) {

  let result = false;
  let listLimitReachedCharacter = [];
  let listLimitReachedWeapon = [];
  let listLimitReachedSkill = [];
  
  try{

    if(list.length > 0){

      for (var i = 0; i < list.length; i++) {

        if(list[i].corruption >= 60){
          listLimitReachedCharacter.push(list[i].id);
        }

        if(list[i].userCharacterWeapons.length > 0){

          for (var iw = 0; iw < list[iw].userCharacterWeapons.length; iw++) {

            if(list[i].userCharacterWeapons[iw].userWeapon.corruption >= 60){
              listLimitReachedWeapon.push(list[iw].userCharacterWeapons[iw].userWeapon.id);
            }

          }

        }

        if(list[i].userCharacterSkills.length > 0){

          for (var is = 0; is < list[is].userCharacterSkills.length; is++) {

            if(list[i].userCharacterSkills[is].userSkill.corruption >= 60){
              listLimitReachedSkill.push(list[i].userCharacterSkills[is].userSkill.id);
            }

          }

        }

      }

      if(listLimitReachedCharacter.length > 0 || listLimitReachedWeapon.length > 0 || listLimitReachedSkill.length > 0){
        result = true;
      }
    
    }

  }
  catch(error){
    
  }

  return result;

};

async function userCharacterCorruptionCreate(list = [], transaction) {

  try{

    if(list.length > 0){

      for (var i = 0; i < list.length; i++) {

        let currentCorruption = list[i].corruption;
        let valueCorruption = (currentCorruption + 1);
        await userCharacterModel.update({corruption: valueCorruption}, { where: {id: list[i].id}, transaction: transaction});
        await userWeaponCorruptionCreate(list[i].userCharacterWeapons, transaction);
        await userSkillCorruptionCreate(list[i].userCharacterSkills, transaction);

      }

    }

  }
  catch(error){
    await transaction.rollback();
  }

};

async function userWeaponCorruptionCreate(list = [], transaction) {

  try{

    if(list.length > 0){

      for (var i = 0; i < list.length; i++) {

        let currentCorruption = list[i].userWeapon.corruption;
        let valueCorruption = (currentCorruption + 1);
        await userWeaponModel.update({corruption: valueCorruption}, { where: {id: list[i].userWeapon.id}, transaction: transaction});

      }

    }

  }
  catch(error){
    await transaction.rollback();
  }

};

async function userSkillCorruptionCreate(list = [], transaction) {

  try{

    if(list.length > 0){

      for (var i = 0; i < list.length; i++) {

        let currentCorruption = list[i].userSkill.corruption;
        let valueCorruption = (currentCorruption + 1);
        await userSkillModel.update({corruption: valueCorruption}, { where: {id: list[i].userSkill.id}, transaction: transaction});

      }

    }

  }
  catch(error){
    await transaction.rollback();
  }

};

async function isFullGenesis(list){

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