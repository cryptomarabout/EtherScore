// scripts/badgetoken_example.js
module.exports = async function main(callback) {
  try {
    // Retrieve accounts from the local node
    const accounts = await web3.eth.getAccounts();
    console.log(accounts)
    let owner_address = accounts[8];
    let owner2_address = accounts[9];
    let badgeId = 0;
    let badgeId2 = 1;
    let token_number = Math.ceil(Math.random() * 10000);
    let token_number2 = Math.ceil(Math.random() * 10000);
    console.log("The 1st BadgeToken will be called token#" + token_number + "(will be user-bind)");
    console.log("The 2nd BadgeToken will be called token#" + token_number2 + "(will be transferrable)");

    // Set up a Truffle contract, representing our deployed BadgeTokenFactory instance
    const BadgeTokenFactory = artifacts.require("BadgeTokenFactory");
    const badgeTokenFactory = await BadgeTokenFactory.deployed();

    // Call the requestBadgeTokenMinting function of the deployed BadgeTokenFactory contract
    // (badge 1 - BadgeToken NOT transferrable)
    await badgeTokenFactory.requestBadgeTokenMinting(badgeId, {from: owner_address});
    console.log("requestBadgeTokenMinting: The user", owner_address, "ask to mint a token with BadgeDefinitionId", badgeId);
    await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
    .then(function(events){
        // lastBlock = events;
        // requestID1_1 = web3.utils.hexToAscii(events[0]["returnValues"]["_requestID"]);
        // requestID1_2 = web3.utils.hexToAscii(events[1]["returnValues"]["_requestID"]);
        requestID1_1 = events[0]["returnValues"]["_requestID"];
        requestID1_2 = events[1]["returnValues"]["_requestID"];
    });

    // console.log("requestBadgeTokenMinting: last block is", lastBlock);
    console.log("requestBadgeTokenMinting: The query with ID", requestID1_1, "has been requested to be run");
    console.log("requestBadgeTokenMinting: The query with ID", requestID1_2, "has been requested to be run");
  
    // (badge 2 - BadgeToken transferrable)
    await badgeTokenFactory.requestBadgeTokenMinting(badgeId2, {from: owner2_address});
    console.log("requestBadgeTokenMinting: The user", owner2_address, "ask to mint a token with BadgeDefinitionId", badgeId2);
    
    await badgeTokenFactory.getPastEvents( 'QueryRequest', { fromBlock: 'latest', toBlock: 'latest' } )
    .then(function(events){
        // requestID2_1 = web3.utils.hexToAscii(events[0]["returnValues"]["_requestID"]);
        requestID2_1 = events[0]["returnValues"]["_requestID"];
    });
    console.log("requestBadgeTokenMinting: The query with ID", requestID2_1, "has been requested to be run");

    // Call the updateBadgeTokenMinting function of the deployed BadgeTokenFactory contract
    // (badge 1 - BadgeToken NOT transferrable)
    await badgeTokenFactory.updateBadgeTokenMinting(requestID1_1, "51", {from: owner_address});
    // let random = web3.utils.randomHex(32);
    // console.log("lol:", random);
    // await badgeTokenFactory.updateBadgeTokenMinting(random, "51", {from: owner_address});

    await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
    .then(function(events){
        // lastBlock = events;
        // console.log("updateBadgeTokenMinting: last block is", lastBlock);
        queryResult1_1 = events[0]["returnValues"]["_queryResult"];
    }); 
    console.log("updateBadgeTokenMinting: The new result of the query", requestID1_1, "is", queryResult1_1);

    await badgeTokenFactory.updateBadgeTokenMinting(requestID1_2, "52", {from: owner_address});

    await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
    .then(function(events){
        queryResult1_2 = events[0]["returnValues"]["_queryResult"];
    }); 
    console.log("updateBadgeTokenMinting: The new result of the query", requestID1_2, "is", queryResult1_2);

    // (badge 2 - BadgeToken transferrable)
    await badgeTokenFactory.updateBadgeTokenMinting(requestID2_1, "55", {from: owner2_address});
    
    await badgeTokenFactory.getPastEvents( 'QueryResultReceived', { fromBlock: 'latest', toBlock: 'latest' } )
    .then(function(events){
        queryResult2_1 = events[0]["returnValues"]["_queryResult"];
    });
    console.log("updateBadgeTokenMinting: The new result of the query", requestID2_1, "is", queryResult2_1);

    // Call the mintBadgeToken function of the deployed BadgeTokenFactory contract
    // (badge 1 - BadgeToken NOT transferrable)
    await badgeTokenFactory.mintBadgeToken(badgeId, {from: owner_address});

    await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
    .then(function(events){
        tokenId = events[0]["returnValues"]["tokenId"];
    }); 
    console.log("mintBadgeToken: The new BadgeTokenId for badge token#" + token_number, "is", tokenId.toString());

    // (badge 2 - BadgeToken transferrable)
    await badgeTokenFactory.mintBadgeToken(badgeId2, {from: owner2_address});
    
    await badgeTokenFactory.getPastEvents( 'Transfer', { fromBlock: 'latest', toBlock: 'latest' } )
    .then(function(events){
        tokenId2 = events[0]["returnValues"]["tokenId"];
    });
    console.log("mintBadgeToken: The new BadgeTokenId for badge token#" + token_number2, "is", tokenId2.toString());

    // Call the doesOwnBadgeFromGivenDefinition function of the deployed BadgeTokenFactory contract
    // (owner_address)
    value = await badgeTokenFactory.doesOwnBadgeFromGivenDefinition(owner_address, badgeId);
    console.log("doesOwnBadgeFromGivenDefinition: Does the user", owner_address,"has a BadgeToken produced using BadgeDefinitionId", badgeId, "?", value.toString());
    value = await badgeTokenFactory.doesOwnBadgeFromGivenDefinition(owner_address, badgeId2);
    console.log("doesOwnBadgeFromGivenDefinition: Does the user", owner_address,"has a BadgeToken produced using BadgeDefinitionId", badgeId2, "?", value.toString());

    // (owner2_address)
    value = await badgeTokenFactory.doesOwnBadgeFromGivenDefinition(owner2_address, badgeId);
    console.log("doesOwnBadgeFromGivenDefinition: Does the user", owner2_address,"has a BadgeToken produced using BadgeDefinitionId", badgeId, "?", value.toString());
    value = await badgeTokenFactory.doesOwnBadgeFromGivenDefinition(owner2_address, badgeId2);
    console.log("doesOwnBadgeFromGivenDefinition: Does the user", owner2_address,"has a BadgeToken produced using BadgeDefinitionId", badgeId2, "?", value.toString());

    // ERC721 functions
    //function balanceOf(address owner) public view returns (uint256)
    // (owner_address)
    value = await badgeTokenFactory.balanceOf(owner_address);
    console.log("balanceOf: The account", owner_address, "has got", value.toString(), "badge(s)");

    // (owner2_address)
    value = await badgeTokenFactory.balanceOf(owner2_address);
    console.log("balanceOf: The account", owner2_address, "has got", value.toString(), "badge(s)");

    //function ownerOf(uint256 tokenId) public view returns (address)
    // (badge 1)
    value = await badgeTokenFactory.ownerOf(tokenId);
    console.log("ownerOf: The owner of the badge", tokenId.toString(), "is the account", value.toString());

    // (badge 2)
    value = await badgeTokenFactory.ownerOf(tokenId2);
    console.log("ownerOf: The owner of the badge", tokenId2.toString(), "is the account", value.toString());

    //function name() public view returns (string memory) 
    value = await badgeTokenFactory.name();
    console.log("name: The name of the contract is", value);

    //function symbol() public view returns (string memory)
    value = await badgeTokenFactory.symbol();
    console.log("symbol: The symbol of the badges of the contract is", value);

    //function tokenURI(uint256 tokenId) public view returns (string memory)
    value = await badgeTokenFactory.tokenURI(tokenId);
    console.log("tokenURI: The URI associated with the badge", tokenId.toString(), "is", value.toString());

    //function approve(address to, uint256 tokenId) public

    //function getApproved(uint256 tokenId) public view returns (address)
 
    //function setApprovalForAll(address operator, bool approved) public

    //function isApprovedForAll(address owner, address operator) public view virtual override returns (bool)

    //function transferFrom(address from, address to, uint256 tokenId) public virtual override
    // (badge 1)

    // (badge 2)
    await badgeTokenFactory.transferFrom(owner2_address, owner_address, tokenId2, {from: owner2_address});
    console.log("transferFrom: The badge", tokenId2.toString(), "has been transferred by the account", owner2_address, "to the account", owner_address);

    //CHECK
    //function balanceOf(address owner) public view returns (uint256)
    // (owner_address)
    total1 = await badgeTokenFactory.balanceOf(owner_address);
    console.log("balanceOf: The account", owner_address, "has got", total1.toString(), "badge(s)");

    // (owner2_address)
    total2 = await badgeTokenFactory.balanceOf(owner2_address);
    console.log("balanceOf: The account", owner2_address, "has got", total2.toString(), "badge(s)");

    //function ownerOf(uint256 tokenId) public view returns (address)
    // (badge 1)
    value = await badgeTokenFactory.ownerOf(tokenId);
    console.log("ownerOf: The owner of the badge", tokenId.toString(), "is the account", value.toString());

    // (badge 2)
    value = await badgeTokenFactory.ownerOf(tokenId2);
    console.log("ownerOf: The owner of the badge", tokenId2.toString(), "is the account", value.toString());

    //function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override

    //function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override

    // ERC721Enumerable functions
    //function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721) returns (bool)
    //ERC721
    value = await badgeTokenFactory.supportsInterface('0x80ac58cd');
    console.log("supportsInterface: Does the contract support IERC721?", value.toString());

    //function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override returns (uint256)
    // (badge 1)
    for(i = 0; i < total1; i++){
      value = await badgeTokenFactory.tokenOfOwnerByIndex(owner_address, i);
      console.log("tokenOfOwnerByIndex: The badge own by", owner_address, "at the index", i.toString(), "is", value.toString())
    } 

    // (badge 2)
    for(i = 0; i < total2; i++){
      value = await badgeTokenFactory.tokenOfOwnerByIndex(owner2_address, i);
      console.log("tokenOfOwnerByIndex: The badge own by", owner2_address, "at the index", i.toString(), "is", value.toString())
    } 

    //function totalSupply() public view virtual override returns (uint256)
    amount = await badgeTokenFactory.totalSupply();
    console.log("totalSupply: The total amount of badges is", amount.toString());

    //function tokenByIndex(uint256 index) public view virtual override returns (uint256)
    for(i = 0; i < amount; i++){
      value = await badgeTokenFactory.tokenByIndex(i);
      console.log("tokenByIndex: The badge at the index", i.toString(), "is", value.toString());
    }

    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
}