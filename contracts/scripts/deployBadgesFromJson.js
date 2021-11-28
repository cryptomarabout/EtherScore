// scripts/index2.js
// var bigInt = require("big-integer");

module.exports = async function main(callback) {
  try {
    // Retrieve accounts from the local node
    const accounts = await web3.eth.getAccounts();
    console.log(accounts)
    let badgeId = 0

    // Set up a Truffle contract, representing our deployed BadgeTokenFactory instance
    const BadgeDefinitionFactory = artifacts.require("BadgeDefinitionFactory");
    const badgeDefinitionFactory = await BadgeDefinitionFactory.deployed();

    const jsonFile = require('./badges.json');
    for (var badgeIndex in jsonFile['badges']) {
      var badge = jsonFile['badges'][badgeIndex]
      await badgeDefinitionFactory.createBadgeDefinition(badge.name, badge.description, badge.tags, "i.redd.it/rq36kl1xjxr01.png", false);
      console.log(badge.id, badge.name, badge.description)
      await badgeDefinitionFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          badgeId = badge.id;
      });
      console.log("createBadgeDefinition: The new BadgeDefinitionId for badge definition#" + badge.id, "is", badgeId.toString());

      for (var conditionIndex in badge.conditions){
        var condition = badge.conditions[conditionIndex]
        await badgeDefinitionFactory.addBadgeAttributionCondition(badgeId, condition.description, condition.indexer, condition.protocol, "fakeQuery", condition.operator, condition.target.toString());
        console.log("*" + condition.protocol, condition.indexer, condition.description , condition.operator, condition.target)
      }
      await badgeDefinitionFactory.publishBadgeDefinition(badgeId);
      value = await badgeDefinitionFactory.getBadgeDefinitionAttributionCondition(badgeId);
      console.log("getBadgeDefinitionAttributionCondition: The BadgeDefinitionId", badgeId, "has got", value[0].toString(), "condition(s)");
      console.log(value[1]);
    }

    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
}