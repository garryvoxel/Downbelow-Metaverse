'use strict';

const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const userStarterPacks = require('../../models/userStarterPacks');
const user = require('../../models/user');
const userCharacter = require('../../models/userCharacter');
const userSkill = require('../../models/userSkill');
const skill = require('../../models/skill');
const userWeapon = require('../../models/userWeapon');
const weapon = require('../../models/weapon');
const userStarterPacksModel = userStarterPacks();
const userCharacterModel = userCharacter();
const userModel = user();
const userSkillModel = userSkill();
const userWeaponModel = userWeapon();
const skillModel = skill();
const weaponModel = weapon();

module.exports.userStarterPacksShow = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  try {

    userSkillModel.belongsTo(skillModel, { foreignKey : 'skillId'});
    userWeaponModel.belongsTo(weaponModel, { foreignKey : 'weaponId'});
    
    userModel.hasMany(userWeaponModel, { foreignKey : 'userId'});
    userModel.hasMany(userSkillModel, { foreignKey : 'userId'});
    userModel.hasMany(userCharacterModel, { foreignKey : 'userId'});
    userStarterPacksModel.belongsTo(userModel, { foreignKey : 'userId'});
    
    let listStarterPacks = {};
    let filter = { attributes: ['id', 'starterPacksId', 'amountCharacter', 'amountWeapon', 'amountSkills'], where: {statusPayment: 1, openPackage: 0, status: 1} };

    let include = [
      { 
        model: userModel, 
        attributes: ['id'], 
        where: {status: 1}, 
        required: false,
        include: [
          {
            model: userCharacterModel, 
            where: {status: 1}, 
            order: [['createdAt', 'DESC']], 
            limit: 4, 
            required: false,
          },
          {
            model: userSkillModel, 
            where: {status: 1}, 
            order: [['createdAt', 'DESC']], 
            limit: 8, 
            required: false,
            include: {model: skillModel, as: 'skill', where: {status: 1}, required: false}
          },
          {
            model: userWeaponModel, 
            where: {status: 1}, 
            order: [['createdAt', 'DESC']], 
            limit: 4, 
            required: false,
            include: {model: weaponModel, as: 'weapon', where: {status: 1}, required: false}
          }
        ] 
      },
    ];

    filter.include = include;
    
    filter.where.userId = resultUserDataSession.id;

    if(event.pathParameters){
      filter.where.openPackage = 1;
      filter.where.id = event.pathParameters.id;
      listStarterPacks = await userStarterPacksModel.findOne(filter);
    }
    else{
      listStarterPacks.packs = await userStarterPacksModel.findAll(filter);
    }
    
    return returnMessage.generic(200, listStarterPacks);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};