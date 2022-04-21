'use strict';

const op  = require("sequelize").Op;
const web3 = require('../../helpers/web3');
const utility = require('../../helpers/utility');
const returnMessage = require('../../helpers/returnMessage');
const userStarterPacks = require('../../models/userStarterPacks');
const userCharacter = require('../../models/userCharacter');
const userWeapon = require('../../models/userWeapon');
const userSkill = require('../../models/userSkill');
const userParty = require('../../models/userParty');
const partyCharacter = require('../../models/partyCharacter');
const partyContract = require('../../models/partyContract');
const userCharacterSkill = require('../../models/userCharacterSkill');
const userCharacterWeapon = require('../../models/userCharacterWeapon');
const party = require('../../models/party');
const user = require('../../models/user');
const idlePveMode = require('../../models/idlePveMode');
const deposit = require('../../models/deposit');
const withdraw = require('../../models/withdraw');
const skill = require('../../models/skill');
const weapon = require('../../models/weapon');
const transactionAbyssUnclaimed = require('../../models/transactionAbyssUnclaimed');
const userStarterPacksModel = userStarterPacks();
const userCharacterModel = userCharacter();
const userModel = user();
const userWeaponModel = userWeapon();
const userSkillModel = userSkill();
const partyCharacterModel = partyCharacter();
const partyModel = party();
const partyContractModel = partyContract();
const userCharacterSkillModel = userCharacterSkill();
const userCharacterWeaponModel = userCharacterWeapon();
const userPartyModel = userParty();
const idlePveModeModel = idlePveMode();
const depositModel = deposit();
const withdrawModel = withdraw();
const skillModel = skill();
const weaponModel = weapon();
const transactionAbyssUnclaimedModel = transactionAbyssUnclaimed();

const updateStatus = 99;

module.exports.userDepositAnalyze = async (event) => {

  return returnMessage.generic(200, true);

  let listUser = [
    '03f19ae0-e77d-4b1d-85bb-9ff84d537fa9', 
    '13b6db1c-cde2-4b17-8900-20749cbcecee', 
    '20343a49-24a6-44dc-aa75-28c3297ad80e', 
    '239812f1-f11f-49f5-a3e1-3ecc737af53b', 
    '33a37eef-64e2-4609-b169-7357b51fe7f6', 
    '49f8c761-b065-4fdf-b718-53c1eb15671f',
    '668ef7e7-48b8-4f30-a3f0-e80aad55a838',
    '68d880a8-e2ae-41dd-aa3b-68a4c1c1bda1',
    '8832e96d-faea-4045-94e8-e4eef77c440e',
    '8eb2f0e2-551b-4732-8742-88775d3e35e5',
    'a118fc69-0750-4a6b-9b18-1daf1b54c6c0',
    'ab5f25dc-23a7-4851-8588-c4aaeacd90d2',
    'c3b2e2db-48db-4f85-88dd-d0e303630390',
    'e8ca711a-845e-4a3a-874b-25b542888d4b',
    'eb59cd88-ec9f-44df-a107-c10260ff13bc'
  ];

  let list = [];
  let listTotalwithdraw = [];

  let listDeposit = await depositModel.findAll({where: {userId: listUser, status: 1}, group: ['userId']});

  if(listDeposit.length > 0){

    for (var i = 0; i < listDeposit.length; i++) {
    
      if(listDeposit[i].payment){

        listDeposit[i].payment = listDeposit[i].payment.replace(/\s/g, '');

        let receiptTransactionReceiptStatus = await web3.getTransactionReceipt(listDeposit[i].payment);

        if(receiptTransactionReceiptStatus.status == false){

          let totalWithdraw = 0;
          let withdrawList = [];
          let valueList = [];

          let withdrawListResult = await withdrawModel.findAll({where: {to: listDeposit[i].from, statusPayment: 1, status: 1}});

          if(withdrawListResult.length > 0){

            withdrawList = withdrawListResult;
            valueList = await utility.arrayColumn(withdrawListResult, 'value');
            totalWithdraw = await utility.sumList(valueList);

          }

          listTotalwithdraw.push(totalWithdraw);
          listDeposit[i].setDataValue('user', {id: listDeposit[i].userId, totalWithdraw: totalWithdraw, withdrawList: withdrawList});

          list.push(listDeposit[i]);
        
        }

      }

    }
  
  }

  listTotalwithdraw = await utility.sumList(listTotalwithdraw);

  return returnMessage.generic(200, {totalUser: list.length, totalwithdraw: listTotalwithdraw, list: list});

};

module.exports.userBonusIsFullGenesis = async (event) => {

  return returnMessage.generic(200, true);

  const transaction = await utility.sequelizeTransaction();

  const bonus = 2;

  let list = [];
  let total = [];

  try{

    let idlePveResult = await idlePveModeModel.findAll(
      {
        attributes: ['id', 'resultRandom', 'rewards', 'userId', 'elvenSilver', 'partyId'],
        where: {createdAt: {[op.lte]: '2022-02-14' }, status: 1}
      }
    );

    if(idlePveResult.length > 0){

      for (var i = 0; i < idlePveResult.length; i++) {

        let partyCharacterResult = await partyCharacterModel.findAll(
          {
            where: {partyId: idlePveResult[i].partyId, status: 1}
          }
        );

        let transactionAbyssUnclaimedResult = await transactionAbyssUnclaimedModel.findOne({where: {userId: idlePveResult[i].userId,  contents: {[op.eq]: 'Bonus 2x party is full genesis' }}});

        if(partyCharacterResult.length > 0 && (!transactionAbyssUnclaimedResult)){

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

          if(userCharacterResult.length > 0){
            
            let isFullGenesisResult = await utility.isFullGenesis(userCharacterResult);
            
            if(isFullGenesisResult && idlePveResult[i].resultRandom){

              let rewards = parseFloat(idlePveResult[i].rewards);
              let elvenSilver = parseFloat(idlePveResult[i].elvenSilver);

              rewards = (rewards * bonus);
              elvenSilver = (elvenSilver * bonus);

              let userResult = await userModel.findOne({where: {id: idlePveResult[i].userId}});

              let currentBalanceAbyssUnclaimed = parseFloat(userResult.abyssUnclaimed);
              let balanceUpdateAbyssUnclaimed = (currentBalanceAbyssUnclaimed + rewards);
              
              let currentBalanceElvenSilver = parseFloat(userResult.elvenSilver);
              let balanceUpdateElvenSilver = (currentBalanceElvenSilver + elvenSilver);

              let bodyTransactionAbyssUnclaimed = {
                type: 'CREDIT', 
                value: rewards, 
                contents: 'Bonus 2x party is full genesis', 
                status: 1, 
                userId: userResult.id
              };
        
              await transactionAbyssUnclaimedModel.create(bodyTransactionAbyssUnclaimed, { transaction: transaction });
              await userModel.update({abyssUnclaimed: balanceUpdateAbyssUnclaimed, elvenSilver: balanceUpdateElvenSilver}, {where: {id: userResult.id}, transaction: transaction});
    
              list.push(idlePveResult[i]);
              total.push(1);
            }
          
          }
        
        }

      }

    }

    await transaction.commit();

    return returnMessage.generic(200, {total: total.length, list: list});

  }  
  catch (error) {
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  }

};

module.exports.userCharacterValidator = async (event) => {

  return returnMessage.generic(200, true);

  const transaction = await utility.sequelizeTransaction();

  try {

    let list = [];
    
    // let listIdUser = ['c49f5cea-2446-4203-a5b6-07e8340deed5','c223e2d5-d04f-4904-afd6-8f8a52639d2b','d446c65f-2641-47d2-b536-3cd5e8f10f9e','2c0e2d93-834e-4e0f-be45-88eb74eface1','c4f5eb6b-b36b-46c0-934a-fd01afd6396e','e2373df5-3a09-414b-aa97-867361ae6c94','316faff6-6217-410f-bfdb-2aead0346ee3','5eb1d75c-c812-4fc1-9b25-6c5c4091d993','177a47c2-d7e9-4f84-aaca-97e85c289ec9','c7f082f1-0903-4f48-874e-5877ad91798d','8aa21420-7654-41ec-87f2-d8ada6984b96','f0ba3b2a-f584-4101-bb41-7b4d28a435c2','ec354cb6-8bbe-4ad2-bf61-d654ed4a8bb7','2733a902-c804-4c98-bd59-3b66ae98fee4','86797358-f709-41de-a745-217b449d8bc9','274858ee-887e-43c1-b395-fd38048f506d','d6fddb46-31ad-436a-937c-ed34896252c1','9ecfc94f-1f3a-4895-90dc-816b2e5a96ca','6ad6fbf3-f32d-4aa4-aa69-a772a7213c27','88fe6646-5916-4bbd-a849-4cba840aa07d','4db475dc-72dc-43a2-a8c6-15556bd0bac8','937bdc8d-d007-4a00-833a-8d69b2d93df3','13ec1574-50d0-494d-95bc-c8aef5f01101','7a8c54eb-45f8-483b-a05a-08651e2c41c9','023635ee-7312-4cfc-ad59-99a371586d08','fbe395dd-ed04-4b3d-ae30-7892e5df8419','6103b24c-1554-4ca6-9d47-1544339a78a2','a733e5b8-0f06-4ba8-a3cb-85978d0795c7','4bcb1409-6f31-4e1c-ba49-65dfa19a82e2','107acf31-46d6-4ad1-8b6e-98199b1c3937','4839e41b-f4d9-497f-bb24-9e2d52c7f6c4','f1212853-1653-43bd-848d-cbe789006575'];
    
    let listIdUser = ['13ec1574-50d0-494d-95bc-c8aef5f01101'];
    
    let filterUser = { attributes: ['id'], where: {status: 1, id: listIdUser}, order: [['createdAt', 'ASC']] };
    let listUser = await userModel.findAll(filterUser);

    if(listUser.length > 0){

      for (let iUser = 0; iUser < listUser.length; iUser++) {

        let filterUserStarterPacks = { attributes: ['id', 'amountCharacter', 'createdAt'], where: {userId: listUser[iUser].id, status: 1, openPackage: 1} };
        let listUserStarterPacks = await userStarterPacksModel.findAll(filterUserStarterPacks);

        if(listUserStarterPacks.length > 0){

          let totalCharacterStarterPacks = (listUserStarterPacks.length * 4); 

          for (let i = 0; i < listUserStarterPacks.length; i++) {
  
            let listUserCharacter = await userCharacterModel.findAll(
              {
                attributes: ['id', 'price', 'createdAt'],
                where: {price: 0, userId: listUser[iUser].id},
                order: [['createdAt', 'ASC']]
              }
            );

            if(listUserCharacter.length > totalCharacterStarterPacks){
              
              let listUserCharacterValid = [];
              let listUserCharacterInvalid = [];

              for (let iv = 0; iv < listUserCharacter.length; iv++) {

                let finListCharacter = await userCharacterModel.findAll({attributes: ['id', 'userId', 'createdAt'], where: {createdAt: listUserCharacter[iv].createdAt}});
                
                if(finListCharacter.length == 4){
                  listUserCharacterValid = finListCharacter;
                }
                else{
                  
                  listUserCharacterInvalid.push(finListCharacter);
                  
                }
                
              }

              await userCharacterUpdate(listUserCharacterInvalid, transaction);
              // await userWeaponUpdate(listUserCharacterInvalid, transaction);
              // await userSkillUpdate(listUserCharacterInvalid, transaction);

              list.push(
                {
                  listUserCharacterInvalid: listUserCharacterInvalid
                }
              );
            
            }
  
          }

        }

      }
      
    }

    
    await transaction.commit();
    
    return returnMessage.generic(200, {totalUser: listUser.length, listUserCharacterResult: list});
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

async function userCharacterUpdate(list, transaction) {

  let result = null;

  try{

    if(list.length > 0){

      for (let i = 0; i < list.length; i++) {

        if(list[i].length > 0){

          for (let ii = 0; ii < list[i].length; ii++) {

            await userCharacterModel.update({status: updateStatus}, {where: {id: list[i][ii].id}, transaction: transaction});

            await partyCharacterUpdate(list[i][ii].id);
            await userCharacterWeaponUpdate(list[i][ii].id);
            await userCharacterSkillUpdate(list[i][ii].id);
            

          }

        }
      
      }

    }

  }
  catch(error){
    console.log("not");
  }

  return result;

};

async function partyCharacterUpdate(idCharacter, transaction) {

  let result = null;

  try{

    partyCharacterModel.belongsTo(partyModel, { foreignKey : 'partyId'});
    let partyCharacterInvalid = await partyCharacterModel.findOne(
      {
        attributes: ['id', 'partyId'], 
        where: {userCharacterId: idCharacter},
        include: { model: partyModel, where: {status: 1}, required: false }
      }
    );

    if(partyCharacterInvalid){
      await partyCharacterModel.update({status: updateStatus}, {where: {partyId: partyCharacterInvalid.partyId}, transaction: transaction});
      await partyModel.update({status: updateStatus}, {where: {id: partyCharacterInvalid.partyId}, transaction: transaction});

      if(partyCharacterInvalid.party){
        
        await userPartyModel.update({status: updateStatus}, {where: {partyId: partyCharacterInvalid.partyId}, transaction: transaction});
        
        if(partyCharacterInvalid.party.partyContractId){
        
          await partyContractModel.update({breachOfContract: 1, status: updateStatus}, {where: {id: partyCharacterInvalid.party.partyContractId}, transaction: transaction});
          
        }
      
      }
      
    }

  }
  catch(error){
    console.log("not");
  }

  return result;

};

async function userCharacterWeaponUpdate(idCharacter, transaction) {

  let result = null;

  try{

    let userCharacterWeapon = await userCharacterWeaponModel.findAll(
      {
        attributes: ['id', 'userWeaponId'], 
        where: {userCharacterId: idCharacter},
      }
    );

    if(userCharacterWeapon.length > 0){
      
      for (let i = 0; i < userCharacterWeapon.length; i++) {

        await userWeaponModel.update({isEquipped: 0}, {where: {id: userCharacterWeapon[i].userWeaponId}, transaction: transaction});
        await userCharacterWeaponModel.destroy({where: {id: userCharacterWeapon[i].id}, transaction: transaction});
      
      }

    }

  }
  catch(error){
    console.log("not");
  }

  return result;

};

async function userCharacterSkillUpdate(idCharacter, transaction) {

  let result = null;

  try{

    let userCharacterSkill = await userCharacterSkillModel.findAll(
      {
        attributes: ['id', 'userSkillId'], 
        where: {userCharacterId: idCharacter},
      }
    );

    if(userCharacterSkill.length > 0){
      
      for (let i = 0; i < userCharacterSkill.length; i++) {

        await userSkillModel.update({isEquipped: 0}, {where: {id: userCharacterSkill[i].userSkillId}, transaction: transaction});
        await userCharacterSkillModel.destroy({where: {id: userCharacterSkill[i].id}, transaction: transaction});
        

      }

    }

  }
  catch(error){
    console.log("not");
  }

  return result;

};