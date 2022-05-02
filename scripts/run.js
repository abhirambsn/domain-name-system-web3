const main = async () => {
  const [owner, otherUser] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainContractFactory.deploy("tge");
  await domainContract.deployed();
  console.log("Contract Deployed to: ", domainContract.address);
  console.log("Contract Deployed by: ", owner.address);

  let txn = await domainContract.registerDomain("coemperor", {
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await txn.wait();

  const domainOwner = await domainContract.getAddress("coemperor");
  console.log("Owner of Domain: ", domainOwner);

  txn = await domainContract.setRecord(
    "coemperor",
    "url",
    "https://example.com"
  );
  await txn.wait();

  txn = await domainContract.getRecord("coemperor", "url");
  console.log("URL Record is: ", txn);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

  // Oops, looks like the owner is saving their money!
  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();

  const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
  console.log("Balance of owner after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
