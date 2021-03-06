// migrations/2_deploy.js
const BadgeDefinitionFactory = artifacts.require("BadgeDefinitionFactory");
const BadgeTokenFactory = artifacts.require("BadgeTokenFactory");
// const BadgeQueryOracle = artifacts.require("BadgeQueryOracle");

module.exports = async function (deployer) {
  await deployer.deploy(BadgeDefinitionFactory);
  await deployer.deploy(BadgeTokenFactory, BadgeDefinitionFactory.address);
  // await deployer.deploy(BadgeQueryOracle);
};