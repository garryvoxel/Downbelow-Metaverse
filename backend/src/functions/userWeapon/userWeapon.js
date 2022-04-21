'use strict';

const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const user = require('../../models/user');
const userWeapon = require('../../models/userWeapon');
const weapon = require('../../models/weapon');
const character = require('../../models/character');
const characterModel = character();
const userWeaponModel = userWeapon();
const weaponModel = weapon();
const userModel = user();

module.exports.userWeaponShow = async (event) => {

  try {

    const resultUserDataSession = utility.getUserDataSession(event);

    weaponModel.belongsTo(characterModel, { foreignKey : 'characterId'});
    userWeaponModel.belongsTo(weaponModel, { foreignKey : 'weaponId'});
    
    let listUserWeapon = [];
    let filter = { where: {status: 1}, order: [['createdAt', 'DESC']]};
    let include = [
      { 
        model: weaponModel, 
        attributes: ['id', 'name', 'description', 'damageBonus', 'status'], 
        where: {status: 1}, 
        required: false,
        include: {  model: characterModel, attributes: ['id'], where: {status: 1}, required: false } 
      },
    ];

    filter.include = include;
    filter.where.userId = resultUserDataSession.id;
    if(event.pathParameters){
      filter.where.id = event.pathParameters.id;
      listUserWeapon = await userWeaponModel.findOne(filter);
    }
    else{
      listUserWeapon = await userWeaponModel.findAll(filter);
    }
    
    return returnMessage.generic(200, listUserWeapon);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.userWeaponRetire = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    const { userId, userWeaponId } = body;

    if (!userId || !userWeaponId) {

      return returnMessage.generic(400, {
        message: 'userId and userWeaponId are all required in the body',
      });
    
    }

    if(resultUserDataSession.id != body.userId){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    userWeaponModel.belongsTo(userModel, { foreignKey : 'userId'});
    let resultUserWeapon = await userWeaponModel.findOne(
      {
        where: {id: body.userWeaponId, userId: body.userId, retired: 0, status: 1},
        include: {model: userModel, attributes: ['id', 'abyss'], where: {status: 1}, required: false}
      }
    );

    if(!resultUserWeapon){
      return returnMessage.generic(400, {
        message: 'Weapon not found'
      });
    }

    if(resultUserWeapon.isEquipped == 1){
      return returnMessage.generic(400, {
        message: 'Equipped items cannot be recycled'
      });
    }

    let weaponCreate = {};
    
    if(body.userWeaponId){

      await userWeaponModel.update({retired: 1, status: 0}, {where: {id: body.userWeaponId}, transaction: transaction});

      let reward = (resultUserWeapon.corruption == 60) ? 60 : (30 * 0.20);
      let currentBalance = parseFloat(resultUserWeapon.user.abyss);
      let balanceUpdate = (currentBalance + reward);

      await userModel.update({abyss: balanceUpdate}, {where: {id: resultUserWeapon.user.id}, transaction: transaction});

      resultUserWeapon.user.abyss = balanceUpdate;
      body.user =  resultUserWeapon.user;
      weaponCreate = body;
      
    }
    
    await transaction.commit();
    
    return returnMessage.generic(201, weaponCreate);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};