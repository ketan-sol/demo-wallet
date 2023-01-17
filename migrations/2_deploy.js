const MyToken = artifacts.require('MyToken');

module.exports = async function(deployer) {
  await deployer.deploy(MyToken);
  const token = await MyToken.deployed();

  await token.mint(
    '0xfEe4a4857B87D918F91F9B59E4Db4f04c1920975',
    '100000000000000000000000'
  );
};
