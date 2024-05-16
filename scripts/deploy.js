// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const Factory = await UniswapV2Factory.deploy("0xd4E3Af72cf9d2B310CeE15363bFF29D43cA34788");
  await Factory.deployed();

  console.log("Factory", Factory.address);

  const WETH = await hre.ethers.getContractFactory("WETH");
  const wETH = await WETH.deploy();
  await wETH.deployed();

  console.log("wETH", wETH.address);


  const UniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");
  const Router = await UniswapV2Router02.deploy(Factory.address,wETH.address);
  await Router.deployed();

  console.log("Router", Router.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
