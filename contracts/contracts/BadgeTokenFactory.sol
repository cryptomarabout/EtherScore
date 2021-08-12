// contracts/BadgeTokenFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "./BadgeDefinitionFactory.sol";
import "./BadgeQueryOracle.sol";

/**
 * @title BadgeTokenFactory
 * @author Geoffrey Garcia
 * @notice Contract to use to mint and to transfer (if applicable based on associated BadgeDefinition) BadgeToken that are ERC721 tokens.
 * @dev The BadgeTokenFactory contract provides basic structures, functions & modifiers that allow to manage BadgeToken as ERC721 token.
 */
contract BadgeTokenFactory is BadgeFactory {

    using Counters for Counters.Counter;

    /**
    * @notice Event emitted to request for a query to be run.
    * @dev Event emitted to request for a query to be run for BadgeToken minting.
    * @param _requestID The ID of the query.
    * @param _caller The Ethereum address which has requested for the right to mint the token.
    * @param _indexer The service indexing the data (possible values: "thegraph, "covalent").
    * @param _protocol The set/subgraph on the indexer to use (possible values: "uniswap", "compound" ,"aave" ,"ethereum").
    * @param _query The query to run.
    */
    event QueryRequest(bytes32 _requestID, address _caller, string _indexer, string _protocol, string _query);

    /**
    * @notice Event emitted after the query and its result have been record into the blockchain.
    * @dev Event emitted fter the query and its result have been record into the blockchain for BadgeToken minting.
    * @param _requestID The ID of the query.
    * @param _queryResult The result of the query.
    */
    event QueryResultReceived(bytes32 _requestID, string _queryResult);

    /**
    * @notice Event emitted when a BadgeToken is ready to be minted.
    * @dev Event emitted when a BadgeToken is ready to be minted.
    * @param _caller The Ethereum address which has requested for the right to mint the token.
    * @param _badgeDefinitionId The ID of BadgeDefinition associated to this BadgeToken.
    */
    event BadgeTokenReady(address _caller, uint _badgeDefinitionId);

    /**
    * @notice Event emitted after a BadgeToken minting.
    * @dev Event emitted after a BadgeToken minting.
    * @param _badgeTokenId The ID of the BadgeToken.
    * @param _originalOwner The Ethereum address of the user that has minted the token.
    */
    event NewBadgeToken(uint _badgeTokenId, address _originalOwner);

    // Badge token structure
    struct BadgeToken {
        uint badgeDefinitionId;                                 // the ID of BadgeDefinition associated to this BadgeToken
        address originalOwner;                                  // the Ethereum address of the user that has minted the token
        string[maxNumberOfAttributionConditions] specialValues; // the special value associated with this badge (optional)
    }

    // Badge token ownership structure
    struct BadgeOwnership {
        bool isPopulated;                          // true if the user has already owned any badge
        mapping(uint => uint) definitionToIndex;   // the BadgeDefinition referring to an index
        mapping(uint => uint) indexToToken;        // the index referring to an BadgeToken
        uint maxIndex;                             // the number of tokens ever owned
        address previousRank;                      // the previous account in the token leader board ('0' if leader)
        address nextRank;                          // the next account in the token leader board ('0' if last)
        uint isThreshold;                          // set with the threshold value if applicable ('-1' if not)
    }

    // Pending minting structure
    struct PendingMinting {
        address caller;                                // the Ethereum address which has requested for the query result
        uint badgeDefinitionId;                        // the ID of BadgeDefinition associated to the BadgeToken the user want to mint
        uint numberOfConditions;                       // the number of conditions that have to be evaluated through as many queries
        mapping (uint => bytes32) _queryIndex;            // the IDs of the queries
        mapping (bytes32 => bool) _pendingQueryStatus;    // the current status of the queries (true if pending)
        mapping (bytes32 => string) _queryResult;         // the results of the queries (usable only if associated _pendingQueryStatus value is false)
        mapping (bytes32 => string) _evaluationOperator;  // the operator allowing to compare the query return
        mapping (bytes32 => string) _evaluationCondition; // the value to compare with the query result
    }

    // Storage of the badge tokens
    BadgeToken[] private _badgeTokens;                       // BadgeToken storage
    address _boardLeader;                                    // The leader is the account owning the most tokens
    address _boardLast;                                      // The last is the account owning the least tokens
    mapping(uint => address) private _boardThresholds;       // List of thresholds of the leaderboard of owned tokens
    mapping(address => BadgeOwnership) private _ownedBadges; // List of BadgeToken IDs per owner per BadgeDefinition
    string badgeTokenSymbol = "BTO";                         // Symbol of the ERC721 tokens of the BadgeToken

    // Storage for the badge minting
    Counters.Counter private _mintingNonce;                                     // a nonce injected to build the ID of the condition group to mint the badge
    mapping(bytes32 => PendingMinting) private _pendingMintings;                // the list of pending badge mintings
    mapping(address => mapping(uint => bytes32)) private _pendingMintingBadges; // List of pending badge mintings per owner per BadgeDefinition
    mapping(bytes32 => bytes32) private _pendingQueries;                        // the list of pending queries

    // Reference to the BadgeDefinitionFactory contract allowing to manage BadgeDefinition
    BadgeDefinitionFactory badgeDefinitionFactory;
    // Reference to the BadgeQueryOracle contract allowing to run query on off-chain ressources
    BadgeQueryOracle badgeQueryOracle;

    /**
    * @dev See {ERC721-constructor}.
    * @param _badgeDefinitionFactoryAddress The Ethereum address of the BadgeDefinitionFactory contract allowing to manage BadgeDefinition.
    */
    constructor(address _badgeDefinitionFactoryAddress) BadgeFactory("BadgeToken", badgeTokenSymbol) {
        // Linking this contract with the already deployed one BadgeDefinitionFactory
        badgeDefinitionFactory = BadgeDefinitionFactory(_badgeDefinitionFactoryAddress);
        // Linking this contract with a freshly instantiated BadgeQueryOracle
        badgeQueryOracle = new BadgeQueryOracle();
    }

    /**
    * @dev Throws if the badge is already owned.
    * @param _badgeDefinitionId The ID of BadgeDefinition associated to this BadgeToken.
    * @param _to The Ethereum address of the user that could receive the token.
    */
    modifier notOwned(uint _badgeDefinitionId, address _to) {
        require(_ownedBadges[_to].definitionToIndex[_badgeDefinitionId] == 0, string(abi.encodePacked(badgeTokenSymbol, ": already owned")));
        //TODO: check orignalOwner instead?
        _;
    }

    /**
    * @notice Function to mint a BadgeToken as ERC721 tokens.
    * @dev Creates & store a BadgeToken.
    * @param _badgeDefinitionId The ID of BadgeDefinition associated to this BadgeToken.
    */
    function requestBadgeTokenMinting(uint _badgeDefinitionId) external {
        requestBadgeTokenDroping(_badgeDefinitionId, _msgSender());
    }

    /**
    * @notice Function to mint a BadgeToken as ERC721 tokens.
    * @dev Creates & store a BadgeToken.
    * @param _badgeDefinitionId The ID of BadgeDefinition associated to this BadgeToken.
    * @param _to The Ethereum address of the user that could receive the token.
    */
    function requestBadgeTokenDroping(uint _badgeDefinitionId, address _to) notOwned(_badgeDefinitionId, _to) public {
        require(_pendingMintingBadges[_to][_badgeDefinitionId] == 0, string(abi.encodePacked(badgeTokenSymbol, ": in minting process")));
        // Creating for the penting minting
        _mintingNonce.increment();
        bytes32 badgeConditionGroupID = keccak256(abi.encodePacked(block.timestamp, _to, _mintingNonce.current()));

        // Add the badge minting to the ones asked by the user
        _pendingMintingBadges[_to][_badgeDefinitionId] = badgeConditionGroupID;

        // Storing for the penting minting
        PendingMinting storage pendingMinting = _pendingMintings[badgeConditionGroupID];
        pendingMinting.caller = _to;

        // Get the BadgeAttributionCondition list associated to this BadgeDefinition
        BadgeAttributionCondition[maxNumberOfAttributionConditions] memory badgeAttributionCondition;
        uint numberOfConditions;
        // uint numberOfConditions = 0;
        (numberOfConditions, badgeAttributionCondition) = badgeDefinitionFactory.getBadgeDefinitionAttributionCondition(_badgeDefinitionId);
        pendingMinting.numberOfConditions = numberOfConditions;

        // Check for every condition in the list
        for(uint i=0; i < numberOfConditions; i++){
            // Ask the Oracle to obtain the result of the query
            bytes32 requestID = badgeQueryOracle.runQuery(_to, badgeConditionGroupID, badgeAttributionCondition[i].indexer, badgeAttributionCondition[i].protocol, badgeAttributionCondition[i].query);
            
            // Asking for the query to be run
            emit QueryRequest(requestID, _to, badgeAttributionCondition[i].indexer, badgeAttributionCondition[i].protocol, badgeAttributionCondition[i].query);
            
            // Store the references & status of the query
            _pendingQueries[requestID] = badgeConditionGroupID;
            pendingMinting._queryIndex[i] = requestID;
            pendingMinting._pendingQueryStatus[requestID] = true;
            pendingMinting._evaluationOperator[requestID] = badgeAttributionCondition[i].operator;
            pendingMinting._evaluationCondition[requestID] = badgeAttributionCondition[i].condition;
        }
    }

    /**
    * @notice Function to get the result of a query.
    * @dev Store the result of the query then ask for the Oracle to write it into the blockchain.
    * @param _requestID The ID of the query.
    * @param _queryResult The result of the query.
    */
    function updateBadgeTokenMinting(bytes32 _requestID, string memory _queryResult) external {
        bytes32 badgeConditionGroupID = _pendingQueries[_requestID];
        // string memory requestIDString = _bytes32ToString(_requestID);
        // require(badgeConditionGroupID != 0, string(abi.encodePacked(badgeTokenSymbol, ": wrong request ID(", requestIDString, ") badgeConditionGroupID:", badgeConditionGroupID)));
        require(badgeConditionGroupID != 0, string(abi.encodePacked(badgeTokenSymbol, ": wrong request ID(", _requestID, ")")));

        // Storing the result
        PendingMinting storage pendingMinting = _pendingMintings[badgeConditionGroupID];
        pendingMinting._pendingQueryStatus[_requestID] = false;
        pendingMinting._queryResult[_requestID] = _queryResult;

        // Sending the result to the Oracle
        badgeQueryOracle.recordQueryResult(pendingMinting.caller, badgeConditionGroupID, _requestID, _queryResult);

        // Telling the query has been recorded
        emit QueryResultReceived(_requestID, _queryResult);

        // Evaluating overall minting process status
        bool evaluationResult = false;
        for(uint i=0; (i < pendingMinting.numberOfConditions) && (evaluationResult == false); i++){
            // Retrieving another query ID
            bytes32 requestID = pendingMinting._queryIndex[i];
            
            // Evaluate if the condition is met
            evaluationResult = pendingMinting._pendingQueryStatus[requestID];
        }

        // Emetting a signal if all the queries have been run
        if(evaluationResult == false){
            emit BadgeTokenReady(pendingMinting.caller, pendingMinting.badgeDefinitionId);
        }
    }

    /**
    * @notice Function to mint a BadgeToken as ERC721 tokens.
    * @dev Creates & store a BadgeToken.
    * @param _badgeDefinitionId The ID of BadgeDefinition associated to this BadgeToken.
    * @return _badgeTokenId The ID of the new BadgeToken.
    */
    function mintBadgeToken(uint _badgeDefinitionId) external returns (uint _badgeTokenId) {
        // Returning the ID of the new BadgeToken
        return dropBadgeToken(_badgeDefinitionId, _msgSender());
    }

    /**
    * @notice Function to drop a BadgeToken as ERC721 tokens.
    * @dev Creates & store a BadgeToken.
    * @param _badgeDefinitionId The ID of BadgeDefinition associated to this BadgeToken.
    * @param _to The Ethereum address of the user that could receive the token.
    * @return _badgeTokenId The ID of the new BadgeToken.
    */
    function dropBadgeToken(uint _badgeDefinitionId, address _to) notOwned(_badgeDefinitionId, _to) public returns (uint _badgeTokenId) {
        // Identifying the badge the user want to mint
        bytes32 badgeConditionGroupID = _pendingMintingBadges[_to][_badgeDefinitionId];
        PendingMinting storage pendingMinting = _pendingMintings[badgeConditionGroupID];
        require(_to == pendingMinting.caller, string(abi.encodePacked(badgeTokenSymbol, ": not the right user")));

        string[maxNumberOfAttributionConditions] memory _specialValues;
        require(_assessAttributionCondition(pendingMinting, _specialValues), string(abi.encodePacked(badgeTokenSymbol, ": not fullfilling the conditions")));
        
        // Storing the BadgeToken
        _badgeTokens.push(BadgeToken({ badgeDefinitionId: _badgeDefinitionId, originalOwner: _to, specialValues:  _specialValues}));
        
        // Getting the ID of the new BadgeToken
        uint badgeTokenId = _badgeTokens.length;

        // Add the badge to the ones owned by the user
        _setOwnership(_to, badgeTokenId);

        // Minting the BadgeToken
        _safeMint(_to, badgeTokenId);

        // Removing the stored pending badge minting
        for(uint i=0; i < pendingMinting.numberOfConditions; i++){
            bytes32 requestID = pendingMinting._queryIndex[i];
            delete _pendingQueries[requestID];
            delete pendingMinting._pendingQueryStatus[requestID];
            delete pendingMinting._queryResult[requestID];
            delete pendingMinting._evaluationOperator[requestID];
            delete pendingMinting._evaluationCondition[requestID];
            delete pendingMinting._queryIndex[i];
        }
        delete _pendingMintingBadges[_to][_badgeDefinitionId];
        delete _pendingMintings[badgeConditionGroupID];

        // Emit the appropriate event
        emit NewBadgeToken(badgeTokenId, _to);

        return badgeTokenId;
    }

    /**
    * @notice Function to test if the badge produced using a BadgeDefinition can be mint.
    * @dev Check if the conditions to mint the badge are met.
    * @param _pendingMinting The pending badge minting structure.
    * @param _specialValues The special values to be stored (optional).
    * @return _evaluationResult The result of the test.
    */ 
    function _assessAttributionCondition(PendingMinting storage _pendingMinting, string[maxNumberOfAttributionConditions] memory _specialValues) private view returns (bool _evaluationResult) {
        _evaluationResult = true;

        // Check for every condition in the list
        for(uint i=0; (i < _pendingMinting.numberOfConditions) && (_evaluationResult == true); i++){
            // Retrieving the query ID
            bytes32 requestID = _pendingMinting._queryIndex[i];
            
            // Evaluate if the condition is met
            _evaluationResult = _evaluateCondition(_pendingMinting._queryResult[requestID], _pendingMinting._evaluationOperator[requestID], _pendingMinting._evaluationCondition[requestID], _specialValues[i]);
        } 

        return _evaluationResult;
    }

    /**
    * @notice Function to retreive all badges (and associated IDs of BadgeDefinition) the user currently owns.
    * @dev Return two lists of IDs correlated by their index.
    * @param _owner The Ethereum address of the user.
    * @return _totalNumberOfBadges The size of the returned lists.
    * @return _badgeDefinitionIds The ID of BadgeDefinition associated to the BadgeToken the user owns.
    * @return _badgeTokenIds The ID of BadgeToken the user owns.
    */
    function getAllOwnedBadges(address _owner) external view returns (uint _totalNumberOfBadges, uint[] memory _badgeDefinitionIds, uint[] memory _badgeTokenIds) {
        // Looking for a BadgeToken owned by this user
        if(_ownedBadges[_owner].isPopulated == true){
            uint ownedToken;
            _badgeDefinitionIds = new uint[](this.balanceOf(_owner));
            _badgeTokenIds = new uint[](this.balanceOf(_owner));
            for(uint i=1; i <= _ownedBadges[_owner].maxIndex; i++){
                ownedToken = _ownedBadges[_owner].indexToToken[i];
                // Only concidering still owned tokens
                if(ownedToken != 0){
                    _badgeDefinitionIds[_totalNumberOfBadges] = _badgeTokens[ownedToken - 1].badgeDefinitionId;
                    _badgeTokenIds[_totalNumberOfBadges] = ownedToken;
                    (_totalNumberOfBadges)++;
                }
            } 
        } 

        return (_totalNumberOfBadges, _badgeDefinitionIds, _badgeTokenIds);
    }

    /**
    * @notice Function to test if the badge produced using a BadgeDefinition can be mint.
    * @dev Check if the conditions to mint the badge are met.
    * @param _owner The Ethereum address of the user.
    * @param _badgeDefinitionId The ID of BadgeDefinition.
    * @return _evaluationResult The result of the test.
    */
    function doesOwnBadgeFromGivenDefinition(address _owner, uint _badgeDefinitionId) external view returns (bool _evaluationResult) {
        _evaluationResult = true;

        // Check for a BadgeToken potentially owned by this user associated to the BadgeDefinition
        uint tokenIndex = _ownedBadges[_owner].definitionToIndex[_badgeDefinitionId];
        if(tokenIndex == 0){
            _evaluationResult = false;
        } 

        return _evaluationResult;
    }

    /**
    * @notice Function to transfer a token (if applicable).
    * @dev Transfers `tokenId` from `from` to `to`.
    * @param from The Ethereum address of the user that own the token.
    * @param to The Ethereum address of the user that could receive the token.
    * @param tokenId The ID of the BadgeToken.
    */
    function _transfer(address from, address to, uint256 tokenId) internal override {
        uint tokenIndex = tokenId - 1;

        // Check if the token can be transfered
        require(badgeDefinitionFactory.isBadgeTransferable(_badgeTokens[tokenIndex].badgeDefinitionId), string(abi.encodePacked(badgeTokenSymbol, ": nontransferable", _badgeTokens[tokenIndex].originalOwner)));

        // Creating the new ownership
        _setOwnership(to, tokenId);

        // Removing the old ownership
        uint oldIndex = _ownedBadges[from].definitionToIndex[_badgeTokens[tokenIndex].badgeDefinitionId];
        _ownedBadges[from].definitionToIndex[_badgeTokens[tokenIndex].badgeDefinitionId] = 0;
        _ownedBadges[from].indexToToken[oldIndex] = 0;

        // Updating the leaderboard (WIP)
        //_updateLeaderboard(from);

        // Transfer the token (if applicable)
        super._transfer(from, to, tokenId);
    }

    /**
    * @notice Function to define a token ownership.
    * @dev The address `_owner` become the owner of the token `_tokenId`.
    * @param _owner The Ethereum address of the user.
    * @param _tokenId The ID of the BadgeToken.
    */
    function _setOwnership(address _owner, uint _tokenId) internal {
        // Creating the ownership
        if(_ownedBadges[_owner].isPopulated == false){
            _ownedBadges[_owner].isPopulated = true;
        }
        (_ownedBadges[_owner].maxIndex)++;
        _ownedBadges[_owner].definitionToIndex[_badgeTokens[_tokenId - 1].badgeDefinitionId] = _ownedBadges[_owner].maxIndex;
        _ownedBadges[_owner].indexToToken[_ownedBadges[_owner].maxIndex] = _tokenId;

        // Updating the leaderboard (WIP)
        //_updateLeaderboard(_owner);
    }

    /**
    * @notice Function to define a token ownership.
    * @dev The address `_owner` become the owner of the token `_tokenId`.
    * @param _owner The Ethereum address of the user.
    */
    function _updateLeaderboard(address _owner) internal {
        uint balance = balanceOf(_owner);

        // Removing old links (if applicable)
        if((_ownedBadges[_owner].previousRank != address(0)) || (_ownedBadges[_owner].nextRank != address(0))){ 
            _ownedBadges[_ownedBadges[_owner].previousRank].nextRank = _ownedBadges[_owner].nextRank;
            _ownedBadges[_ownedBadges[_owner].nextRank].previousRank = _ownedBadges[_owner].previousRank;
            if(_ownedBadges[_owner].isThreshold != 0){
                // Updating threshold indexes
                _ownedBadges[_ownedBadges[_owner].nextRank].isThreshold = _ownedBadges[_owner].isThreshold;
            }
        } 

        // Identify new rank
        address previous;
        address next;
        if(balance == 0){
            // Taking the last rank
            previous = _boardLast;
            next = address(0);
            _boardLast = _owner;
        } else {
            // Locating next & previous rank
            next = _boardThresholds[balance - 1];
            if(next == address(0)){
                // Taking the last rank
                previous = _boardLast;
                _boardLast = _owner;
            } else {
                previous = _ownedBadges[next].previousRank;
            } 
            if(previous == address(0)){
                // Taking the lead
                _boardLeader = _owner;
                _ownedBadges[_owner].isThreshold = balance;
                _boardThresholds[balance] = _owner;
            }
        }

        // Updating new links
        _ownedBadges[_owner].previousRank = previous;
        _ownedBadges[_owner].nextRank = next;

        // Updathing thresholds
        // TODO
    }

    /**
    * @notice Function to get the URI associated to a token.
    * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
    * @param tokenId The ID of the BadgeToken.
    * @return The result URI associated to the token.
    */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: nonexistent token");

        uint tokenIndex = tokenId - 1;
        
        string memory URI = badgeDefinitionFactory.tokenURI(_badgeTokens[tokenIndex].badgeDefinitionId);
        return bytes(URI).length > 0
            ? string(URI)
            : '';
    }
}