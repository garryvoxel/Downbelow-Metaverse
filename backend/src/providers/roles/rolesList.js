'use strict';

const v = process.env.V_API;

const rolesList = {
    "System": [
        `POST:/${v}/user`,
        `GET:/${v}/user`,
        
        `POST:/${v}/floor`,
        `GET:/${v}/floor`,
        
        `POST:/${v}/weapon`,
        `GET:/${v}/weapon`,
        
        `POST:/${v}/skill`,
        `GET:/${v}/skill`,
        
        `POST:/${v}/character`,
        `GET:/${v}/character`,
        
        `GET:/${v}/party`,
        `POST:/${v}/party`,
        
        `POST:/${v}/partyContract`,
        `POST:/${v}/breachOfContract`,
        `GET:/${v}/partyContract`,
        
        `POST:/${v}/idlePVEResult`,
        `GET:/${v}/idlePVE`,

        `GET:/${v}/starterPacks`,

        `GET:/${v}/whitelist`,

        `POST:/${v}/generateBaseStatus`,
        `GET:/${v}/generateBaseStatus`,

        `POST:/${v}/generateUserCharacterSkillWeapon`,

        `POST:/${v}/product`,
        `GET:/${v}/product`,

        `POST:/${v}/sale`,
        `GET:/${v}/sale`,

        `GET:/${v}/userCharacter`,
        `POST:/${v}/userCharacter`,
        `POST:/${v}/userCharacterEquip`,

        `POST:/${v}/userCharacterSale`,
        `POST:/${v}/userSkillSale`,
        `POST:/${v}/userWeaponSale`,

        `GET:/${v}/userWeapon`,
        `POST:/${v}/userWeapon`,

        `GET:/${v}/userSkill`,
        `POST:/${v}/userSkill`,

        `GET:/${v}/userStarterPacks`,

        `GET:/${v}/userParty`,

        `POST:/${v}/claim`,

        `GET:/${v}/deposit`,

        `POST:/${v}/partyUpdatePartyAp`,

        `GET:/${v}/withdraw`,
        `POST:/${v}/withdraw`,
        
    ],
    "Player": [
        `POST:/${v}/user`,
        `GET:/${v}/user`,
        
        `GET:/${v}/floor`,
        
        `GET:/${v}/weapon`,
        
        `GET:/${v}/skill`,
        
        `GET:/${v}/character`,
        
        `GET:/${v}/party`,
        `POST:/${v}/party`,
        
        `POST:/${v}/partyContract`,
        `POST:/${v}/breachOfContract`,
        `GET:/${v}/partyContract`,
        
        `POST:/${v}/idlePVEResult`,
        `GET:/${v}/idlePVE`,
        
        `GET:/${v}/starterPacks`,

        `GET:/${v}/whitelist`,

        `POST:/${v}/generateBaseStatus`,
        `GET:/${v}/generateBaseStatus`,

        `POST:/${v}/generateUserCharacterSkillWeapon`,

        `GET:/${v}/product`,

        `POST:/${v}/sale`,

        `GET:/${v}/userCharacter`,
        `POST:/${v}/userCharacter`,
        `POST:/${v}/userCharacterEquip`,

        `POST:/${v}/userCharacterSale`,
        `POST:/${v}/userSkillSale`,
        `POST:/${v}/userWeaponSale`,

        `GET:/${v}/userWeapon`,
        `POST:/${v}/userWeapon`,

        `GET:/${v}/userSkill`,
        `POST:/${v}/userSkill`,

        `GET:/${v}/userStarterPacks`,
        
        `GET:/${v}/userParty`,

        `POST:/${v}/claim`,

        `GET:/${v}/deposit`,

        `POST:/${v}/partyUpdatePartyAp`,

        `GET:/${v}/withdraw`,
        `POST:/${v}/withdraw`
    ]
};

module.exports = rolesList;