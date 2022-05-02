const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainContractFactory.deploy("tge");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  let txn = await domainContract.registerDomain("eofice", {
    value: hre.ethers.utils.parseEther("0.1"),
  });
  txn = await domainContract.setRecord(
    "eofice",
    "data",
    "Office of The Galactic Emperor"
  );
  await txn.wait();

  console.log("Set record for eofice.tge");

  const address = await domainContract.getAddress("eofice");
  console.log("Owner of domain eofice:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
