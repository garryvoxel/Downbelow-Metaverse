const hre = require("hardhat");
async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // We get the contract to deploy
    const Downbelow = await hre.ethers.getContractFactory("Downbelow");

    const address = '0x7093ed76D3D629B2367c4eCab7e335753896b91A';

    const downbelow = await Downbelow.attach(address);

    await downbelow.connect(deployer).deposit(
        hre.ethers.utils.parseEther("2000"),
        1686913074,
        28,
        "0x3731de31f4530996df22137d0587fc7d1efa210b5e8e33ef86125b1afcca992c",
        "0x2981e5743a1670d4159137a1c116d64a472bac979b1269f3ff1ac95a24dd2784"
    );
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});