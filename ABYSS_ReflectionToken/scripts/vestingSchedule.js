let vestingSchedule = [
    //Team
    {
      beneficiary: "0xd5Ec83303e00411Ee458018C516C300386314CE2", 
      vestingPeriod: [
        2419200,   // 2022-03-04
        2678400,   // 2022-04-04
        2592000,   // 2022-05-04
        2678400,   // 2022-06-04
        2592000,   // 2022-07-04
        2678400,   // 2022-08-04
        2678400,   // 2022-09-04
        2592000,   // 2022-10-04
        2678400,   // 2022-11-04
        2592000,   // 2022-12-04
        2678400,   // 2023-01-04
        2678400   // 2023-02-04
      ],
      releaseAmount: [
        720000, 720000, 720000, 720000,
        1440000, 1440000, 1440000, 1440000,
        2340000, 2340000, 2340000, 2340000 
      ],
      vestAmount: 18000000
    },
    //Strategic Partnerships
    {
      beneficiary: "", 
      vestingPeriod: [
        0,
        2419200,   // 2022-03-04
        2678400,   // 2022-04-04
        2592000,   // 2022-05-04
      ],
      releaseAmount: [
        1750000, 1750000, 1750000, 1750000
      ],
      vestAmount: 7000000
    },
    //Marketing
    {
      beneficiary: "", 
      vestingPeriod: [
        0,
        2419200,   // 2022-03-04
        2678400,   // 2022-04-04
        2592000,   // 2022-05-04
      ],
      releaseAmount: [
        750000, 750000, 750000, 750000
      ],
      vestAmount: 3000000
    },
    //Investors
    {
      beneficiary: "", 
      vestingPeriod: [
        0,
        2419200,   // 2022-03-04
        2678400,   // 2022-04-04
        2592000,   // 2022-05-04
      ],
      releaseAmount: [
        500000, 500000, 500000, 500000
      ],
      vestAmount: 2000000
    }
];

export { vestingSchedule };