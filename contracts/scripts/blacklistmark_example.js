// scripts/blacklistmark_example.js
module.exports = async function main(callback) {
    try {
      // Retrieve accounts from the local node
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)
      let creator_address = accounts[0];
      let receiver_000_1 = accounts[1];
      let receiver_100 = accounts[2];
      let receiver_010 = accounts[3];
      let receiver_001 = accounts[4];
      let receiver_110 = accounts[5];
      let receiver_011 = accounts[6];
      let receiver_101 = accounts[7];
      let receiver_111 = accounts[8];
      let receiver_000_2 = accounts[9];
      let token_number = Math.ceil(Math.random() * 10000);
      let token_number2 = Math.ceil(Math.random() * 10000);
      let token_number3 = Math.ceil(Math.random() * 10000);
      console.log("The 1st BadgeDefinition will be called definition#" + token_number + " (will 'Ze hacker')");
      console.log("The 2nd BadgeDefinition will be called definition#" + token_number2 + " (will 'Ze scammer')");
      console.log("The 3rd BadgeDefinition will be called definition#" + token_number3 + " (will 'Ze extortionist')");

      // Set up a Truffle contract, representing our deployed BadgeDefinitionFactory instance
      const BadgeDefinitionFactory = artifacts.require("BadgeDefinitionFactory");
      const badgeDefinitionFactory = await BadgeDefinitionFactory.deployed();

      // Set up a Truffle contract, representing our deployed BadgeTokenFactory instance
      const BadgeTokenFactory = artifacts.require("BadgeTokenFactory");
      const badgeTokenFactory = await BadgeTokenFactory.deployed();

      // Call the createBadgeDefinition function of the deployed BadgeDefinitionFactory contract
      // (mark 1 - Ze hacker)
      await badgeDefinitionFactory.createBadgeDefinition("definition#" + token_number + " ('Ze hacker')", "Allow to identify addresses involved in on-chain hack", ["hack", "mark"], "i.redd.it/rq36kl1xjxr01.png", false);

      await badgeDefinitionFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          badgeId = events[0]["returnValues"]["tokenId"];
      });
      console.log("createBadgeDefinition: The new BadgeDefinitionId for badge definition#" + token_number, "('Ze hacker') is", badgeId.toString());

      // (badge 2 - Ze scammer)
      await badgeDefinitionFactory.createBadgeDefinition("definition#" + token_number2 + " ('Ze scammer')", "Allow to identify addresses involved in scam related to the blockchain (fake contract, spamming, …)", ["scam", "mark"], "i.redd.it/rq36kl1xjxr01.png", false);
      
      await badgeDefinitionFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          badgeId2 = events[0]["returnValues"]["tokenId"];
      });
      console.log("createBadgeDefinition: The new BadgeDefinitionId for badge definition#" + token_number2, "('Ze scammer') is", badgeId2.toString());

      // (badge 3 - Ze scammer)
      await badgeDefinitionFactory.createBadgeDefinition("definition#" + token_number3 + " ('Ze extortionist')", "Allow to identify addresses involved in ransomware business", ["ransom", "mark"], "i.redd.it/rq36kl1xjxr01.png", false);
      
      await badgeDefinitionFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          badgeId3 = events[0]["returnValues"]["tokenId"];
      });
      console.log("createBadgeDefinition: The new BadgeDefinitionId for badge definition#" + token_number3, "('Ze extortionist') is", badgeId3.toString());

      // Call the addBadgeAttributionCondition function of the deployed BadgeDefinitionFactory contract
      let query = "{ swaps(orderBy: timestamp, where: { to: " + creator_address + " }) { id transaction { id timestamp } pair { token0 { symbol } token1 { symbol } } to sender } }";
      let operator = ">=";
      let condition = "50";

      // (badge 1)
      await badgeDefinitionFactory.addBadgeAttributionCondition(badgeId, "condition of definition#" + token_number, "thegraph", "uniswap", query, operator, condition);

      // (badge 2)
      await badgeDefinitionFactory.addBadgeAttributionCondition(badgeId2, "condition of definition#" + token_number2, "thegraph", "uniswap", query, operator, condition);

      // (badge 3)
      await badgeDefinitionFactory.addBadgeAttributionCondition(badgeId3, "condition of definition#" + token_number3, "thegraph", "uniswap", query, operator, condition);

      // Call the publishBadgeDefinition function of the deployed BadgeDefinitionFactory contract
      // (badge 1)
      await badgeDefinitionFactory.publishBadgeDefinition(badgeId);

      // (badge 2)
      await badgeDefinitionFactory.publishBadgeDefinition(badgeId2);

      // (badge 3)
      await badgeDefinitionFactory.publishBadgeDefinition(badgeId3);

      
      // Call the getBadgeDefinition function of the deployed BadgeDefinitionFactory contract
      // (badge 1)
      await badgeDefinitionFactory.getBadgeDefinition(badgeId).then(function(response) {
        console.log("getBadgeDefinition: For the BadgeDefinitionId", badgeId);
        console.log("                    Name:            ", response[0]);
        console.log("                    Description:     ", response[1]);
        console.log("                    Tags:            ", response[2]);
        console.log("                    URI:             ", response[3]);
        console.log("                    Is transferable?:", response[4]);
      });

      // (badge 2)
      await badgeDefinitionFactory.getBadgeDefinition(badgeId2).then(function(response) {
        console.log("getBadgeDefinition: For the BadgeDefinitionId", badgeId2);
        console.log("                    Name:            ", response[0]);
        console.log("                    Description:     ", response[1]);
        console.log("                    Tags:            ", response[2]);
        console.log("                    URI:             ", response[3]);
        console.log("                    Is transferable?:", response[4]);
      });

      // (badge 3)
      await badgeDefinitionFactory.getBadgeDefinition(badgeId3).then(function(response) {
        console.log("getBadgeDefinition: For the BadgeDefinitionId", badgeId3);
        console.log("                    Name:            ", response[0]);
        console.log("                    Description:     ", response[1]);
        console.log("                    Tags:            ", response[2]);
        console.log("                    URI:             ", response[3]);
        console.log("                    Is transferable?:", response[4]);
      });

      // Call the getBadgeDefinitionAttributionCondition function of the deployed BadgeDefinitionFactory contract
      // (badge 1)
      // value = await badgeDefinitionFactory.getBadgeDefinitionAttributionCondition(badgeId);
      // console.log("getBadgeDefinitionAttributionCondition: The BadgeDefinitionId", badgeId, "has got", value[0].toString(), "condition(s)");
      // console.log(value[1]);

      // Call the isBadgeTransferable function of the deployed BadgeDefinitionFactory contract
      // (badge 1)
      // value = await badgeDefinitionFactory.isBadgeTransferable(badgeId);
      // console.log("isBadgeTransferable: Are the badges produced using the BadgeDefinitionId", badgeId, "transferrable?", value.toString());

      // (badge 2)
      // value = await badgeDefinitionFactory.isBadgeTransferable(badgeId2);
      // console.log("isBadgeTransferable: Are the badges produced using the BadgeDefinitionId", badgeId2, "transferrable?", value.toString());

      // ERC721 functions (badgeDefinitionFactory)
      //function balanceOf(address owner) public view returns (uint256)
      // (creator_address)
      value = await badgeDefinitionFactory.balanceOf(creator_address);
      console.log("balanceOf: The account", creator_address, "has got", value.toString(), "badge(s)");

      // (receiver_addresses)
      value = await badgeDefinitionFactory.balanceOf(receiver_000_1);
      console.log("balanceOf: The account", receiver_000_1, "has got", value.toString(), "badge(s)");
      value = await badgeDefinitionFactory.balanceOf(receiver_100);
      console.log("balanceOf: The account", receiver_100, "has got", value.toString(), "badge(s)");
      value = await badgeDefinitionFactory.balanceOf(receiver_010);
      console.log("balanceOf: The account", receiver_010, "has got", value.toString(), "badge(s)");
      value = await badgeDefinitionFactory.balanceOf(receiver_001);
      console.log("balanceOf: The account", receiver_001, "has got", value.toString(), "badge(s)");
      value = await badgeDefinitionFactory.balanceOf(receiver_110);
      console.log("balanceOf: The account", receiver_110, "has got", value.toString(), "badge(s)");
      value = await badgeDefinitionFactory.balanceOf(receiver_011);
      console.log("balanceOf: The account", receiver_011, "has got", value.toString(), "badge(s)");
      value = await badgeDefinitionFactory.balanceOf(receiver_101);
      console.log("balanceOf: The account", receiver_101, "has got", value.toString(), "badge(s)");
      value = await badgeDefinitionFactory.balanceOf(receiver_111);
      console.log("balanceOf: The account", receiver_111, "has got", value.toString(), "badge(s)");
      value = await badgeDefinitionFactory.balanceOf(receiver_000_2);
      console.log("balanceOf: The account", receiver_000_2, "has got", value.toString(), "badge(s)");

      //function ownerOf(uint256 tokenId) public view returns (address)
      // (badge 1)
      value = await badgeDefinitionFactory.ownerOf(badgeId);
      console.log("ownerOf: The owner of the badge", badgeId.toString(), "is the account", value.toString());

      // (badge 2)
      value = await badgeDefinitionFactory.ownerOf(badgeId2);
      console.log("ownerOf: The owner of the badge", badgeId2.toString(), "is the account", value.toString());

      // (badge 3)
      value = await badgeDefinitionFactory.ownerOf(badgeId3);
      console.log("ownerOf: The owner of the badge", badgeId3.toString(), "is the account", value.toString());

      // //function name() public view returns (string memory) 
      // value = await badgeDefinitionFactory.name();
      // console.log("name: The name of the contract is", value);

      // //function symbol() public view returns (string memory)
      // value = await badgeDefinitionFactory.symbol();
      // console.log("symbol: The symbol of the badges of the contract is", value);

      // //function tokenURI(uint256 tokenId) public view returns (string memory)
      // value = await badgeDefinitionFactory.tokenURI(badgeId);
      // console.log("tokenURI: The URI associated with the badge", badgeId.toString(), "is", value.toString());

      //function approve(address to, uint256 tokenId) public
      // await badgeDefinitionFactory.approve(receiver_address, badgeId);
      // console.log("approve: There is an attempt for the account", receiver_address, "to be approved to claim the badge", badgeId.toString());

      //function getApproved(uint256 tokenId) public view returns (address)
      // value = await badgeDefinitionFactory.getApproved(badgeId);
      // console.log("getApproved: The account", value.toString(), "has been approved to claim the badge", badgeId.toString());

      //function setApprovalForAll(address operator, bool approved) public

      //function isApprovedForAll(address owner, address operator) public view virtual override returns (bool)

      // Call the requestBadgeTokenDroping function of the deployed BadgeTokenFactory contract
      // (badge 1)
      await badgeTokenFactory.requestBadgeTokenDroping(badgeId, receiver_100);
      console.log("requestBadgeTokenDroping: The user", receiver_100, "is the target of a drop of a token with BadgeDefinitionId", badgeId);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID1_100 = events[0]["returnValues"]["_requestID"];
      });

      await badgeTokenFactory.requestBadgeTokenDroping(badgeId, receiver_110);
      console.log("requestBadgeTokenDroping: The user", receiver_110, "is the target of a drop of a token with BadgeDefinitionId", badgeId);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID1_110 = events[0]["returnValues"]["_requestID"];
      });

      await badgeTokenFactory.requestBadgeTokenDroping(badgeId, receiver_101);
      console.log("requestBadgeTokenDroping: The user", receiver_101, "is the target of a drop of a token with BadgeDefinitionId", badgeId);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID1_101 = events[0]["returnValues"]["_requestID"];
      });

      await badgeTokenFactory.requestBadgeTokenDroping(badgeId, receiver_111);
      console.log("requestBadgeTokenDroping: The user", receiver_111, "is the target of a drop of a token with BadgeDefinitionId", badgeId);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID1_111 = events[0]["returnValues"]["_requestID"];
      });

      console.log("requestBadgeTokenDroping: The query with ID", requestID1_100, "has been requested to be run");
      console.log("requestBadgeTokenDroping: The query with ID", requestID1_110, "has been requested to be run");
      console.log("requestBadgeTokenDroping: The query with ID", requestID1_101, "has been requested to be run");
      console.log("requestBadgeTokenDroping: The query with ID", requestID1_111, "has been requested to be run");

      // (badge 2)
      await badgeTokenFactory.requestBadgeTokenDroping(badgeId2, receiver_010);
      console.log("requestBadgeTokenDroping: The user", receiver_010, "is the target of a drop of a token with BadgeDefinitionId", badgeId2);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID2_010 = events[0]["returnValues"]["_requestID"];
      });

      await badgeTokenFactory.requestBadgeTokenDroping(badgeId2, receiver_110);
      console.log("requestBadgeTokenDroping: The user", receiver_110, "is the target of a drop of a token with BadgeDefinitionId", badgeId2);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID2_110 = events[0]["returnValues"]["_requestID"];
      });

      await badgeTokenFactory.requestBadgeTokenDroping(badgeId2, receiver_011);
      console.log("requestBadgeTokenDroping: The user", receiver_011, "is the target of a drop of a token with BadgeDefinitionId", badgeId2);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID2_011 = events[0]["returnValues"]["_requestID"];
      });

      await badgeTokenFactory.requestBadgeTokenDroping(badgeId2, receiver_111);
      console.log("requestBadgeTokenDroping: The user", receiver_111, "is the target of a drop of a token with BadgeDefinitionId", badgeId2);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID2_111 = events[0]["returnValues"]["_requestID"];
      });

      console.log("requestBadgeTokenDroping: The query with ID", requestID2_010, "has been requested to be run");
      console.log("requestBadgeTokenDroping: The query with ID", requestID2_110, "has been requested to be run");
      console.log("requestBadgeTokenDroping: The query with ID", requestID2_011, "has been requested to be run");
      console.log("requestBadgeTokenDroping: The query with ID", requestID2_111, "has been requested to be run");

      // (badge 3)
      await badgeTokenFactory.requestBadgeTokenDroping(badgeId3, receiver_001);
      console.log("requestBadgeTokenDroping: The user", receiver_001, "is the target of a drop of a token with BadgeDefinitionId", badgeId3);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID3_001 = events[0]["returnValues"]["_requestID"];
      });

      await badgeTokenFactory.requestBadgeTokenDroping(badgeId3, receiver_101);
      console.log("requestBadgeTokenDroping: The user", receiver_101, "is the target of a drop of a token with BadgeDefinitionId", badgeId3);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID3_101 = events[0]["returnValues"]["_requestID"];
      });

      await badgeTokenFactory.requestBadgeTokenDroping(badgeId3, receiver_011);
      console.log("requestBadgeTokenDroping: The user", receiver_011, "is the target of a drop of a token with BadgeDefinitionId", badgeId3);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID3_011 = events[0]["returnValues"]["_requestID"];
      });

      await badgeTokenFactory.requestBadgeTokenDroping(badgeId3, receiver_111);
      console.log("requestBadgeTokenDroping: The user", receiver_111, "is the target of a drop of a token with BadgeDefinitionId", badgeId3);
      await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          requestID3_111 = events[0]["returnValues"]["_requestID"];
      });

      console.log("requestBadgeTokenDroping: The query with ID", requestID3_001, "has been requested to be run");
      console.log("requestBadgeTokenDroping: The query with ID", requestID3_101, "has been requested to be run");
      console.log("requestBadgeTokenDroping: The query with ID", requestID3_011, "has been requested to be run");
      console.log("requestBadgeTokenDroping: The query with ID", requestID3_111, "has been requested to be run");

      // Call the updateBadgeTokenMinting function of the deployed BadgeTokenFactory contract
      // (badge 1)
      await badgeTokenFactory.updateBadgeTokenMinting(requestID1_100, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult1_100 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID1_100, "is", queryResult1_100);

      await badgeTokenFactory.updateBadgeTokenMinting(requestID1_110, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult1_110 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID1_110, "is", queryResult1_110);

      await badgeTokenFactory.updateBadgeTokenMinting(requestID1_101, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult1_101 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID1_101, "is", queryResult1_101);

      await badgeTokenFactory.updateBadgeTokenMinting(requestID1_111, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult1_111 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID1_111, "is", queryResult1_111);

      // (badge 2)
      await badgeTokenFactory.updateBadgeTokenMinting(requestID2_010, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult2_010 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID2_010, "is", queryResult2_010);

      await badgeTokenFactory.updateBadgeTokenMinting(requestID2_110, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult2_110 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID2_110, "is", queryResult2_110);

      await badgeTokenFactory.updateBadgeTokenMinting(requestID2_011, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult2_011 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID2_011, "is", queryResult2_011);

      await badgeTokenFactory.updateBadgeTokenMinting(requestID2_111, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult2_111 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID2_111, "is", queryResult2_111);

      // (badge 3)
      await badgeTokenFactory.updateBadgeTokenMinting(requestID3_001, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult3_001 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID3_001, "is", queryResult3_001);

      await badgeTokenFactory.updateBadgeTokenMinting(requestID3_101, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult3_101 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID3_101, "is", queryResult3_101);

      await badgeTokenFactory.updateBadgeTokenMinting(requestID3_011, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult3_011 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID3_011, "is", queryResult3_011);

      await badgeTokenFactory.updateBadgeTokenMinting(requestID3_111, "51");
      await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          queryResult3_111 = events[0]["returnValues"]["_queryResult"];
      }); 
      console.log("updateBadgeTokenMinting: The new result of the query", requestID3_111, "is", queryResult3_111);

      // Call the dropBadgeToken function of the deployed BadgeTokenFactory contract
      // (badge 1)
      await badgeTokenFactory.dropBadgeToken(badgeId, receiver_100);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId1_100 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_100, "is", tokenId1_100.toString());

      await badgeTokenFactory.dropBadgeToken(badgeId, receiver_110);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId1_110 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_110, "is", tokenId1_110.toString());

      await badgeTokenFactory.dropBadgeToken(badgeId, receiver_101);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId1_101 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_101, "is", tokenId1_101.toString());

      await badgeTokenFactory.dropBadgeToken(badgeId, receiver_111);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId1_111 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_111, "is", tokenId1_111.toString());

      // (badge 2)
      await badgeTokenFactory.dropBadgeToken(badgeId2, receiver_010);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId2_010 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_010, "is", tokenId2_010.toString());

      await badgeTokenFactory.dropBadgeToken(badgeId2, receiver_110);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId2_110 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_110, "is", tokenId2_110.toString());

      await badgeTokenFactory.dropBadgeToken(badgeId2, receiver_011);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId2_011 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_011, "is", tokenId2_011.toString());

      await badgeTokenFactory.dropBadgeToken(badgeId2, receiver_111);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId2_111 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_111, "is", tokenId2_111.toString());

      // (badge 3)
      await badgeTokenFactory.dropBadgeToken(badgeId3, receiver_001);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId3_001 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_001, "is", tokenId3_001.toString());

      await badgeTokenFactory.dropBadgeToken(badgeId3, receiver_101);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId3_101 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_101, "is", tokenId3_101.toString());

      await badgeTokenFactory.dropBadgeToken(badgeId3, receiver_011);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId3_011 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_011, "is", tokenId3_011.toString());

      await badgeTokenFactory.dropBadgeToken(badgeId3, receiver_111);
      await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
      .then(function(events){
          tokenId3_111 = events[0]["returnValues"]["tokenId"];
      }); 
      console.log("dropBadgeToken: The new BadgeTokenId for the user" + receiver_111, "is", tokenId3_111.toString());

      //function transferFrom(address from, address to, uint256 tokenId) public virtual override
      // (badge 1)
      // await badgeDefinitionFactory.transferFrom(creator_address, receiver_address, badgeId, {from: receiver_address});
      // console.log("transferFrom: The badge", badgeId.toString(), "has been claimed by the account", receiver_address);

      // (badge 2)
      // await badgeDefinitionFactory.transferFrom(creator_address, receiver_address, badgeId2);
      // console.log("transferFrom: The badge", badgeId2.toString(), "has been drop by the account", creator_address, "to the account", receiver_address);

      // ERC721 functions (badgeTokenFactory)
      //function balanceOf(address owner) public view returns (uint256)
      // (creator_address)
      value = await badgeTokenFactory.balanceOf(creator_address);
      console.log("balanceOf: The account", creator_address, "has got", value.toString(), "badge(s)");

      // (receiver_addresses)
      value = await badgeTokenFactory.balanceOf(receiver_000_1);
      console.log("balanceOf: The account", receiver_000_1, "has got", value.toString(), "badge(s)");
      value = await badgeTokenFactory.balanceOf(receiver_100);
      console.log("balanceOf: The account", receiver_100, "has got", value.toString(), "badge(s)");
      value = await badgeTokenFactory.balanceOf(receiver_010);
      console.log("balanceOf: The account", receiver_010, "has got", value.toString(), "badge(s)");
      value = await badgeTokenFactory.balanceOf(receiver_001);
      console.log("balanceOf: The account", receiver_001, "has got", value.toString(), "badge(s)");
      value = await badgeTokenFactory.balanceOf(receiver_110);
      console.log("balanceOf: The account", receiver_110, "has got", value.toString(), "badge(s)");
      value = await badgeTokenFactory.balanceOf(receiver_011);
      console.log("balanceOf: The account", receiver_011, "has got", value.toString(), "badge(s)");
      value = await badgeTokenFactory.balanceOf(receiver_101);
      console.log("balanceOf: The account", receiver_101, "has got", value.toString(), "badge(s)");
      value = await badgeTokenFactory.balanceOf(receiver_111);
      console.log("balanceOf: The account", receiver_111, "has got", value.toString(), "badge(s)");
      value = await badgeTokenFactory.balanceOf(receiver_000_2);
      console.log("balanceOf: The account", receiver_000_2, "has got", value.toString(), "badge(s)");

      //function getAllOwnedBadges(address _owner) external view returns (uint _totalNumberOfBadges, uint[] memory _badgeDefinitionIds, uint[] memory _badgeTokenIds)
      await badgeTokenFactory.getAllOwnedBadges(receiver_000_1).then(function(response) {
        console.log("getAllOwnedBadges: For the account", receiver_000_1);
        console.log("                   Total:        ", response[0]);
        console.log("                   DefinitionIds:", response[1]);
        console.log("                   TokenIds:     ", response[2]);
      });
      await badgeTokenFactory.getAllOwnedBadges(receiver_100).then(function(response) {
        console.log("getAllOwnedBadges: For the account", receiver_100);
        console.log("                   Total:        ", response[0]);
        console.log("                   DefinitionIds:", response[1]);
        console.log("                   TokenIds:     ", response[2]);
      });
      await badgeTokenFactory.getAllOwnedBadges(receiver_010).then(function(response) {
        console.log("getAllOwnedBadges: For the account", receiver_010);
        console.log("                   Total:        ", response[0]);
        console.log("                   DefinitionIds:", response[1]);
        console.log("                   TokenIds:     ", response[2]);
      });
      await badgeTokenFactory.getAllOwnedBadges(receiver_001).then(function(response) {
        console.log("getAllOwnedBadges: For the account", receiver_001);
        console.log("                   Total:        ", response[0]);
        console.log("                   DefinitionIds:", response[1]);
        console.log("                   TokenIds:     ", response[2]);
      });
      await badgeTokenFactory.getAllOwnedBadges(receiver_110).then(function(response) {
        console.log("getAllOwnedBadges: For the account", receiver_110);
        console.log("                   Total:        ", response[0]);
        console.log("                   DefinitionIds:", response[1]);
        console.log("                   TokenIds:     ", response[2]);
      });
      await badgeTokenFactory.getAllOwnedBadges(receiver_011).then(function(response) {
        console.log("getAllOwnedBadges: For the account", receiver_011);
        console.log("                   Total:        ", response[0]);
        console.log("                   DefinitionIds:", response[1]);
        console.log("                   TokenIds:     ", response[2]);
      });
      await badgeTokenFactory.getAllOwnedBadges(receiver_101).then(function(response) {
        console.log("getAllOwnedBadges: For the account", receiver_101);
        console.log("                   Total:        ", response[0]);
        console.log("                   DefinitionIds:", response[1]);
        console.log("                   TokenIds:     ", response[2]);
      });
      await badgeTokenFactory.getAllOwnedBadges(receiver_111).then(function(response) {
        console.log("getAllOwnedBadges: For the account", receiver_111);
        console.log("                   Total:        ", response[0]);
        console.log("                   DefinitionIds:", response[1]);
        console.log("                   TokenIds:     ", response[2]);
      });
      await badgeTokenFactory.getAllOwnedBadges(receiver_000_2).then(function(response) {
        console.log("getAllOwnedBadges: For the account", receiver_000_2);
        console.log("                   Total:        ", response[0]);
        console.log("                   DefinitionIds:", response[1]);
        console.log("                   TokenIds:     ", response[2]);
      });
      
      //function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override
      await badgeTokenFactory.transferFrom(receiver_100, receiver_010, tokenId1_100, {from: receiver_100});
      console.log("transferFrom: The badge", tokenId1_100.toString(), "has been transferred by the account", receiver_100, "to the account", receiver_010);

      //function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override

      // ERC721Enumerable functions
      //function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721) returns (bool)
      //ERC721
      // value = await badgeDefinitionFactory.supportsInterface('0x80ac58cd');
      // console.log("supportsInterface: Does the contract support IERC721?", value.toString());

      //function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override returns (uint256)


      callback(0);
    } catch (error) {
      console.error(error);
      callback(1);
    }
  }