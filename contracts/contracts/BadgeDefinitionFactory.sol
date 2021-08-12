// contracts/BadgeDefinitionFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BadgeFactory.sol";

/**
 * @title BadgeDefinitionFactory
 * @author Geoffrey Garcia
 * @notice Contract to use to mint and to transfer BadgeDefinition that are ERC721 tokens.
 * @dev The BadgeDefinitionFactory contract provides basic structures, functions & modifiers that allow to manage BadgeDefinition as ERC721 token.
 */
contract BadgeDefinitionFactory is BadgeFactory {

    /**
    * @notice Event emitted after a BadgeDefinition publishing.
    * @dev Event emitted after a BadgeDefinition publishing.
    * @param _badgeDefinitionId The ID of the BadgeDefinition.
    * @param _name The name of the token.
    * @param _description The descrition of the token.
    * @param _tags The list of the tags associated to the token.
    * @param _image_uri The URI of the image associated to the token.
    */
    event NewBadgeDefinition(uint _badgeDefinitionId, string _name, string _description, string[] _tags, string _image_uri);
    
    // Badge definition structure
    struct BadgeDefinition {
        string name;            // the name of the token
        string description;     // the descrition of the token
        string[] tags;          // the list of the tags associated to the token
        string image_uri;       // the URI of the image associated to the token
        bool isTransferable;    // the flag indicates if BadgeToken producted using it can be transfered
        bool isPublished;       // the flag indicates if it can be used right now
    }

    // Storage of the badge definitionsg
    BadgeDefinition[] private _badgeDefinitions;                      // BadgeDefinition storage
    BadgeAttributionCondition[] private _badgeAttributionConditions;  // BadgeAttributionCondition storage
    mapping(uint => uint[]) private _attributionConditionList;        // Links beetween BadgeDefinition and its BadgeAttributionCondition
    string badgeDefinitionSymbol = "BDE";                             // Symbol of the ERC721 tokens of the BadgeDefinition

    /**
    * @dev See {ERC721-constructor}.
    */
    constructor() BadgeFactory("BadgeDefinition", badgeDefinitionSymbol) {
    }

    /**
    * @dev Throws if called on an already published token.
    * @param _badgeDefinitionId The ID of the BadgeDefinition.
    */
    modifier onlyUnpublishedBadgeDefinition(uint _badgeDefinitionId) {
        require(!(_badgeDefinitions[_badgeDefinitionId].isPublished), string(abi.encodePacked(badgeDefinitionSymbol, ":  readonly token")));
        _;
    }

    /**
    * @dev Throws if called on an unpublished token.
    * @param _badgeDefinitionId The ID of the BadgeDefinition.
    */
    modifier onlyPublishedBadgeDefinition(uint _badgeDefinitionId) {
        require(_badgeDefinitions[_badgeDefinitionId].isPublished, string(abi.encodePacked(badgeDefinitionSymbol, ": unpublished token")));
        _;
    }

    /**
    * @notice Function to mint a BadgeDefinition as ERC721 tokens.
    * @dev Creates & store a BadgeDefinition.
    * @param _name The name of the token.
    * @param _description The descrition of the token.
    * @param _tags The list of the tags associated to the token.
    * @param _image_uri The URI of the image associated to the token.
    * @param _isTransferable The flag indicates if BadgeToken producted using it can be transfered.
    * @return _badgeDefinitionId The ID of the new BadgeDefinition.
    */
    function createBadgeDefinition(string memory _name, string memory _description, string[] memory _tags, string memory _image_uri, bool _isTransferable) public returns (uint _badgeDefinitionId) {
        // Storing the BadgeDefinition
        _badgeDefinitions.push(BadgeDefinition({ name: _name, description: _description, tags: _tags, image_uri: _image_uri, isTransferable: _isTransferable, isPublished: false}));
        
        // Getting the ID of the new BadgeDefinition
        uint badgeDefinitionId = _badgeDefinitions.length - 1;

        // Minting the BadgeDefinition
        _safeMint(_msgSender(), badgeDefinitionId);

        return badgeDefinitionId;
    }

    /**
    * @notice Function to add a BadgeAttributionCondition to a BadgeDefinition.
    * @dev Creates & store a BadgeAttributionCondition then link it with a BadgeDefinition.
    * @param _badgeDefinitionId The ID of the BadgeDefinition.
    * @param _description The descrition of the condition.
    * @param _indexer The service indexing the data (possible values: "thegraph").
    * @param _protocol The set/subgraph on the indexer to use (possible values: "uniswap", "compound").
    * @param _query The query to run.
    * @param _operator The operator allowing to compare the query return.
    * @param _condition The value to compare with the query result.
    */
    function addBadgeAttributionCondition(uint _badgeDefinitionId, string memory _description, string memory _indexer, string memory _protocol, string memory _query, string memory _operator, string memory _condition) public existingBadge(_badgeDefinitionId) onlyOwnerOf(_badgeDefinitionId) onlyUnpublishedBadgeDefinition(_badgeDefinitionId) {
        // Asserting the maximum of conditions for this token has not already been reached
        require(_attributionConditionList[_badgeDefinitionId].length <= maxNumberOfAttributionConditions, string(abi.encodePacked(badgeDefinitionSymbol, ": too many conditions")));

        // Storing the BadgeAttributionCondition
        _badgeAttributionConditions.push(BadgeAttributionCondition({ badgeDefinitionId:_badgeDefinitionId, description: _description, indexer: _indexer, protocol: _protocol, query: _query, operator: _operator, condition: _condition}));
        
        // Getting the ID of the new BadgeAttributionCondition
        uint badgeAttributionConditionId = _badgeAttributionConditions.length - 1;

        //Updating the relationship with its associated BadgeDefinition
        _attributionConditionList[_badgeDefinitionId].push(badgeAttributionConditionId);
    }

    /**
    * @notice Function to make a BadgeDefinition usable to produce badges.
    * @dev Allows the BadgeDefinition to become usable to produce badges & emit a NewBadgeDefinition event.
    * @param _badgeDefinitionId The ID of the BadgeDefinition.
    */
    function publishBadgeDefinition(uint _badgeDefinitionId) public existingBadge(_badgeDefinitionId) onlyOwnerOf(_badgeDefinitionId) onlyUnpublishedBadgeDefinition(_badgeDefinitionId) {
        // Set the BadgeDefinition as pusblished
        _badgeDefinitions[_badgeDefinitionId].isPublished = true;

        // Emit the appropriate event
        emit NewBadgeDefinition(_badgeDefinitionId, _badgeDefinitions[_badgeDefinitionId].name, _badgeDefinitions[_badgeDefinitionId].description, _badgeDefinitions[_badgeDefinitionId].tags, _badgeDefinitions[_badgeDefinitionId].image_uri);
    }

    /**
    * @notice Function to retrieve the informations associated to a BadgeDefinition.
    * @dev Get the informations associated to a BadgeDefinition (except the conditions).
    * @param _badgeDefinitionId The ID of the BadgeDefinition.
    * @return _name The name of the token.
    * @return _description The descrition of the token.
    * @return _tags The list of the tags associated to the token.
    * @return _image_uri The URI of the image associated to the token.
    * @return _isTransferable The flag indicates if BadgeToken producted using it can be transfered.
    */
    function getBadgeDefinition(uint _badgeDefinitionId) public view existingBadge(_badgeDefinitionId) onlyPublishedBadgeDefinition(_badgeDefinitionId) returns (string memory _name, string memory _description, string[] memory _tags, string memory _image_uri, bool _isTransferable) {
        // Return the informations
        return (_badgeDefinitions[_badgeDefinitionId].name, _badgeDefinitions[_badgeDefinitionId].description, _badgeDefinitions[_badgeDefinitionId].tags, _badgeDefinitions[_badgeDefinitionId].image_uri, _badgeDefinitions[_badgeDefinitionId].isTransferable);
    }

    /**
    * @notice Function to retrieve the list of conditions associated to a BadgeDefinition.
    * @dev Get the list of BadgeAttributionCondition associated to a BadgeDefinition.
    * @param _badgeDefinitionId The ID of the BadgeDefinition.
    * @return _numberOfAttributionCondition The number of associated conditions.
    * @return _badgeDefinitionAttributionConditions The list of BadgeAttributionCondition.
    */
    function getBadgeDefinitionAttributionCondition(uint _badgeDefinitionId) public view existingBadge(_badgeDefinitionId) onlyPublishedBadgeDefinition(_badgeDefinitionId) returns (uint _numberOfAttributionCondition, BadgeAttributionCondition[maxNumberOfAttributionConditions] memory _badgeDefinitionAttributionConditions) {
        // Get the number of conditions
        _numberOfAttributionCondition = _attributionConditionList[_badgeDefinitionId].length;
        
        // Retrieve all the associated conditions
        for(uint i=0; i < _numberOfAttributionCondition; i++){
            _badgeDefinitionAttributionConditions[i] = _badgeAttributionConditions[_attributionConditionList[_badgeDefinitionId][i]];
        }

        return (_numberOfAttributionCondition, _badgeDefinitionAttributionConditions);
    }

    /**
    * @notice Function to test if the badges produced using a BadgeDefinition can be transferred.
    * @dev Return the boolean set at the BadgeDefinition creation.
    * @param _badgeDefinitionId The ID of the BadgeDefinition.
    * @return _isTransferable The result of the test.
    */
    function isBadgeTransferable(uint _badgeDefinitionId) external view onlyPublishedBadgeDefinition(_badgeDefinitionId) returns (bool _isTransferable) {
        return _badgeDefinitions[_badgeDefinitionId].isTransferable;
    }

    /**
    * @notice Function to get the URI associated to a token.
    * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
    * @param tokenId The ID of the BadgeToken.
    * @return The result URI associated to the token.
    */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, _badgeDefinitions[tokenId].image_uri))
            : '';
    }
}
