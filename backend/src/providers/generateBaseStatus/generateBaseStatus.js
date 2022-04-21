'use strict';

const characterList = ['ASSASSIN', 'MAGE', 'PRIEST', 'ARCHER', 'KNIGHT', 'BRAWLER'];
const statusList = ['damage', 'critical', 'accuracy', 'defense', 'dodge', 'life', 'speed'];

let rarityLevelRandom = 0;

module.exports.randomizeRarityLevel = async function(starterPacksActive){
    
    const common = starterPacksActive[0];
    const rare = starterPacksActive[1];
    const epic = starterPacksActive[2];
    const legendary = starterPacksActive[3];
    const mythic = starterPacksActive[4];
    const godlike = starterPacksActive[5];

    let resultRandomizeRarity = common;
    let resultRandomBase = randomBaseFloat(0, 100);
    rarityLevelRandom = resultRandomBase;

    if(resultRandomBase <= common.value){
        resultRandomizeRarity = common;
    }
    else if(resultRandomBase <= rare.value){
        resultRandomizeRarity = rare;
    }
    else if(resultRandomBase <= epic.value){
        resultRandomizeRarity = epic;
    }
    else if(resultRandomBase <= legendary.value){
        resultRandomizeRarity = legendary;
    }
    else if(resultRandomBase <= mythic.value){
        resultRandomizeRarity = mythic;
    }
    else if(resultRandomBase <= godlike.value){
        resultRandomizeRarity = godlike;
    }

    return resultRandomizeRarity;
    
};

module.exports.randomizeCharacter = async function(){
    
    let totalCharacter = characterList.length;
    let resultRandomize = randomBase(0, totalCharacter);
    let resultRandomizeCharacter = characterList[resultRandomize];
    
    return resultRandomizeCharacter;
    
};

module.exports.randomizeAPCharacterRarityLevel = async function(rarity){
    
    let resultApRarity = 0;
    
    if(rarity == 'COMMON'){
        resultApRarity = 40;
    }
    else if(rarity == 'RARE'){
        resultApRarity = randomBase(41, 88);
    }
    else if(rarity == 'EPIC'){
        resultApRarity = randomBase(89, 144);
    }
    else if(rarity == 'LEGENDARY'){
        resultApRarity = randomBase(145, 208);
    }
    else if(rarity == 'MYTHIC'){
        resultApRarity = randomBase(209, 280);
    }
    else if(rarity == 'GODLIKE'){
        resultApRarity = randomBase(281, 360);
    }

    return resultApRarity;
    
};

module.exports.randomizeAPSkillRarityLevel = async function(rarity){
    
    let resultApRarity = 0;
    
    if(rarity == 'COMMON'){
        resultApRarity = 5;
    }
    else if(rarity == 'RARE'){
        resultApRarity = randomBase(6, 11);
    }
    else if(rarity == 'EPIC'){
        resultApRarity = randomBase(12, 18);
    }
    else if(rarity == 'LEGENDARY'){
        resultApRarity = randomBase(19, 26);
    }
    else if(rarity == 'MYTHIC'){
        resultApRarity = randomBase(27, 35);
    }
    else if(rarity == 'GODLIKE'){
        resultApRarity = randomBase(36, 45);
    }

    return resultApRarity;
    
};

module.exports.randomizeAPWeaponRarityLevel = async function(rarity){
    
    let resultApRarity = 0;
    
    if(rarity == 'COMMON'){
        resultApRarity = 20;
    }
    else if(rarity == 'RARE'){
        resultApRarity = randomBase(21, 44);
    }
    else if(rarity == 'EPIC'){
        resultApRarity = randomBase(45, 72);
    }
    else if(rarity == 'LEGENDARY'){
        resultApRarity = randomBase(73, 104);
    }
    else if(rarity == 'MYTHIC'){
        resultApRarity = randomBase(105, 140);
    }
    else if(rarity == 'GODLIKE'){
        resultApRarity = randomBase(141, 180);
    }

    return resultApRarity;
    
};

module.exports.generateBaseStatusPotential = async function(starterPacksActive, className = null){

    const character = require('../../models/character');
    const characterModel = character();
    const multiplierPotencia = 10;

    let result = null;
    let rarityLevel = await this.randomizeRarityLevel(starterPacksActive.rarity);
    let ap = await this.randomizeAPCharacterRarityLevel(rarityLevel.name);
    let potenciaDistribution = 0;
    let potencia = (ap * multiplierPotencia);
    
    try{

        let classNameCharacter = null;

        if(!className){

            let randomizeCharacter = await randomBase(0, characterList.length);
            classNameCharacter = characterList[randomizeCharacter];

        }
        else{
            classNameCharacter = className;
        }

        let characterResult = await characterModel.findOne({where: {className: classNameCharacter}});

        if(characterResult){

            let distributionDamage = (potencia * characterResult.damage);
            let distributionCriticalChance = (potencia * characterResult.criticalChance);
            let distributionAccuracy = (potencia * characterResult.accuracy);
            let distributionDefense = (potencia * characterResult.defense);
            let distributionDodge = (potencia * characterResult.dodge);
            let distributionLife = (potencia * characterResult.life);
            let distributionSpeed = (potencia * characterResult.speed);

            characterResult.damage = distributionDamage;
            characterResult.criticalChance = distributionCriticalChance;
            characterResult.accuracy = distributionAccuracy;
            characterResult.defense = distributionDefense;
            characterResult.dodge = distributionDodge;
            characterResult.life = distributionLife;
            characterResult.speed = distributionSpeed;

            potenciaDistribution = potencia;

            potenciaDistribution = (potenciaDistribution - distributionDamage);
            potenciaDistribution = (potenciaDistribution - distributionCriticalChance);
            potenciaDistribution = (potenciaDistribution - distributionAccuracy);
            potenciaDistribution = (potenciaDistribution - distributionDefense);
            potenciaDistribution = (potenciaDistribution - distributionDodge);
            potenciaDistribution = (potenciaDistribution - distributionLife);
            potenciaDistribution = (potenciaDistribution - distributionSpeed);

            if(potenciaDistribution <= 0){
                potenciaDistribution = 0;
            }

            let restDistribution = potenciaDistribution;

            let rolls = 0;
            let increment = 0;
            while (restDistribution > 1) {

                rolls = randomBase(0, 6);
                let rollsStatus = statusList[rolls];

                increment = randomBase(1, restDistribution);
                characterResult[rollsStatus] = (characterResult[rollsStatus] + increment);

                restDistribution = (restDistribution - increment);
            }

            result = {
                name: rarityLevel.name,
                rarityLevelRandom: rarityLevelRandom,
                rarityLevel: rarityLevel,
                multiplierPotencia: multiplierPotencia,
                ap: ap,
                potencia: potencia,
                restDistribution: restDistribution,
                characterResult: characterResult
            };

        }

    }
    catch(error){
     
    }

    return result;

};

const randomBaseFloat = function(min, max) {

    return (Math.random() * (max - min) + min);

};

const randomBase = function(min, max) {
    
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;

};