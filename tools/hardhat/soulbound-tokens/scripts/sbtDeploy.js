const { ethers } = require("hardhat");


async function main() {
  const deployerAddr = "Paste Your MetaMask Wallet Address Here";
  const deployer = await ethers.getSigner(deployerAddr);

  console.log(`Deploying contracts with the account: ${deployer.address}`);
  console.log(`Account balance: ${(await deployer.provider.getBalance(deployerAddr)).toString()}`);


  const sbtContract = await ethers.deployContract("SoulBoundToken");
  await sbtContract.waitForDeployment();

  console.log(
    `Congratulations! You have just successfully deployed your soul bound tokens.`
  );
  console.log(
    `SBT contract address is ${sbtContract.target}. You can verify on https://baobab.scope.klaytn.com/account/${sbtContract.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
