// migrations/2_deploy.js
const BadgeDefinitionFactory = artifacts.require("BadgeDefinitionFactory");
const BadgeTokenFactory = artifacts.require("BadgeTokenFactory");
// const BadgeQueryOracle = artifacts.require("BadgeQueryOracle");
// const BadgeViewer = artifacts.require("BadgeViewer");

module.exports = async function (deployer) {
  await deployer.deploy(BadgeDefinitionFactory);
  await deployer.deploy(BadgeTokenFactory, BadgeDefinitionFactory.address);
  // await deployer.deploy(BadgeQueryOracle);
  // await deployer.deploy(BadgeViewer, BadgeDefinitionFactory.address, BadgeTokenFactory.address);
};