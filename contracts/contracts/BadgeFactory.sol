// contracts/BadgeFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BadgeFactory
 * @author Geoffrey Garcia
 * @notice Implementation of ERC721 standard using OpenZeppelin library
 * @dev The BadgeFactory abstract contract provides basic structures & modifiers that simplify the implementation of BadgeDefinitionFactory & BadgeTokenFactory.
 */
abstract contract BadgeFactory is ERC721Enumerable, Ownable {

    // Badge attribution condition structure
    struct BadgeAttributionCondition {
        uint badgeDefinitionId; // the ID of BadgeDefinition associated to this condition
        string description;     // the descrition of the condition
        string indexer;         // the service indexing the data (possible values: "thegraph")
        string protocol;        // the set/subgraph on the indexer to use (possible values: "uniswap", "compound")
        string query;           // the query to run
        string operator;        // the operator allowing to compare the query return
        string condition;       // the value to compare with the query result
    }

    // Badge base URI
    string private _badgeBaseURI;

    // Maximum number of conditions that can be associated to a single badge
    uint8 constant maxNumberOfAttributionConditions = 5;

    /**
    * @dev See {ERC721-constructor}.
    * @param _badgeName The badge name.
    * @param _badgeSymbol The badge symbol.
    */
    constructor(string memory _badgeName, string memory _badgeSymbol) ERC721(_badgeName, _badgeSymbol) {
        _setBaseURI("ipfs://");
    }

    /**
    * @dev Throws if called by any account other than the owner.
    * @param _badgeId The ID of the Badge.
    */
    modifier onlyOwnerOf(uint _badgeId) {
        require(_isApprovedOrOwner(_msgSender(), _badgeId), "ERC721: not owner");
        _;
    }

    /**
    * @dev Throws if called for a non-existing badge.
    * @param _badgeId The ID of the Badge.
    */
    modifier existingBadge(uint _badgeId) {
        require(_exists(_badgeId), "ERC721: nonexistent token");
        _;
    }

    /**
     * @dev Base URI for computing {tokenURI}. Empty by default, can be overriden
     * in child contracts.
     */
    function _baseURI() internal view override returns (string memory) {
        return _badgeBaseURI;
    }

    /**
     * @dev Base URI for computing {tokenURI}. Empty by default, can be overriden
     * in child contracts.
     */
    function _setBaseURI(string memory baseURI_) private {
        _badgeBaseURI = baseURI_;
    }

    /**
    * @notice Function to evaluate a condition.
    * @dev Check if a condition to mint a badge is met.
    * @param _queryResult The result of the query.
    * @param _operator The operator allowing to compare the query return.
    * @param _condition The value to compare with the query result.
    * @param _specialValue The special value to be stored (optional).
    * @return _evaluationResult The result of the test.
    */
    function _evaluateCondition(string memory _queryResult, string memory _operator, string memory _condition, string memory _specialValue) internal pure returns (bool _evaluationResult) {
        _evaluationResult = false;

        bytes32 operatorHash = keccak256(bytes(_operator));

        // Evaluate the query return
        if(operatorHash == keccak256(bytes("<"))){
            _evaluationResult = _stringToUint(_queryResult) < _stringToUint(_condition);
        } else{
            if(operatorHash == keccak256(bytes("<="))){
                _evaluationResult = _stringToUint(_queryResult) <= _stringToUint(_condition);
            } else{
                if(operatorHash == keccak256(bytes(">"))){
                    _evaluationResult = _stringToUint(_queryResult) > _stringToUint(_condition);
                } else{
                    if(operatorHash == keccak256(bytes(">="))){
                        _evaluationResult = _stringToUint(_queryResult) >= _stringToUint(_condition);
                    } else{
                        if(operatorHash == keccak256(bytes("=="))){
                            _evaluationResult = _stringToUint(_queryResult) == _stringToUint(_condition);
                        } else{
                            if(operatorHash == keccak256(bytes("!="))){
                                _evaluationResult = _stringToUint(_queryResult) != _stringToUint(_condition);
                            } else{
                                if(operatorHash == keccak256(bytes("special"))){
                                    _evaluationResult = true;
                                    _specialValue = _queryResult;
                                } else{

                                } 
                            } 
                        } 
                    } 
                } 
            } 
        } 

        return _evaluationResult;
    }

    function _stringToUint(string memory s) internal pure returns (uint result) {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
        for (i = 0; i < b.length; i++) {
            uint c = uint(uint8(b[i]));
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }

    // function _bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
    //     uint8 i = 0;
    //     while(i < 32 && _bytes32[i] != 0) {
    //         i++;
    //     }
    //     bytes memory bytesArray = new bytes(i);
    //     for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
    //         bytesArray[i] = _bytes32[i];
    //     }
    //     return string(bytesArray);
    // }
}