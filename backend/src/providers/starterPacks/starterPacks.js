'use strict';

const starterPacksList = [
    {
        id: '1',
        name: 'STANDARD PACK',
        price: 100,
        amountCharacter: 4,
        amountWeapon: 4,
        amountSkills: 8,
        limit: 2,
        rarity: [
            {
                name: 'COMMON',
                value: 65
            },
            {
                name: 'RARE',
                value: 85
            },
            {
                name: 'EPIC',
                value: 95
            },
            {
                name: 'LEGENDARY',
                value: 98.5
            },
            {
                name: 'MYTHIC',
                value: 99.7
            },
            {
                name: 'GODLIKE',
                value: 100
            }
        ],
        staus: 1
    },
    {
        id: '2',
        name: 'EPIC PACK',
        price: 500,
        amountCharacter: 4,
        amountWeapon: 4,
        amountSkills: 8,
        limit: 1,
        rarity: [
            {
                name: 'COMMON',
                value: 10
            },
            {
                name: 'RARE',
                value: 40
            },
            {
                name: 'EPIC',
                value: 92.5
            },
            {
                name: 'LEGENDARY',
                value: 97.5
            },
            {
                name: 'MYTHIC',
                value: 99.5
            },
            {
                name: 'GODLIKE',
                value: 100
            }
        ],
        staus: 1
    }
];

module.exports = starterPacksList;
