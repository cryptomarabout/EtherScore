// contracts/BadgeViewer.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BadgeDefinitionFactory.sol";
import "./BadgeTokenFactory.sol";

/**
 * @title BadgeViewer
 * @author Geoffrey Garcia
 * @notice Contract to use to view BadgeDefinition & BadgeToken that are ERC721 tokens.
 * @dev The BadgeViewer contract provides functions that allow to visualize BadgeDefinition & BadgeToken related informations.
 */
contract BadgeViewer {

    // Reference to the BadgeDefinitionFactory contract allowing to visualize BadgeDefinition
    BadgeDefinitionFactory badgeDefinitionFactory;
    // Reference to the BadgeTokenFactory contract allowing to visualize BadgeToken
    BadgeTokenFactory badgeTokenFactory;

    /**
    * @param _badgeDefinitionFactoryAddress The Ethereum address of the BadgeDefinitionFactory contract allowing to visualize BadgeDefinition.
    * @param _badgeTokenFactoryAddress The Ethereum address of the badgeTokenFactory contract allowing to visualize BadgeToken.
    */
    constructor(address _badgeDefinitionFactoryAddress, address _badgeTokenFactoryAddress) {
        // Linking this contract with the already deployed one BadgeDefinitionFactory
        badgeDefinitionFactory = BadgeDefinitionFactory(_badgeDefinitionFactoryAddress);
        // Linking this contract with the already deployed one BadgeTokenFactory
        badgeTokenFactory = BadgeTokenFactory(_badgeTokenFactoryAddress);
    }

    // /**
    // * @notice Function to retreive all badges (and associated IDs of BadgeDefinition) the user currently owns.
    // * @dev Return two lists of IDs correlated by their index.
    // * @param _owner The Ethereum address of the user.
    // * @return _totalNumberOfBadges The size of the returned lists.
    // * @return _badgeDefinitionIds The ID of BadgeDefinition associated to the BadgeToken the user owns.
    // * @return _badgeTokenIds The ID of BadgeToken the user owns.
    // */
    // function getAllOwnedBadges(address _owner) external view returns (uint _totalNumberOfBadges, uint[] memory _badgeDefinitionIds, uint[] memory _badgeTokenIds) {
    //     BadgeOwnership storage ownedBadges = badgeTokenFactory._ownedBadges[_owner];

    //     // Looking for a BadgeToken owned by this user
    //     if(ownedBadges.isPopulated == false){
    //         _totalNumberOfBadges = 0;
    //         for(uint i=1; i <= ownedBadges.maxIndex; i++){
    //             uint ownedToken = ownedBadges.indexToToken[i];
    //             // Only concidering still owned tokens
    //             if(ownedToken != 0){
    //                 _badgeTokenIds[_totalNumberOfBadges] = ownedToken;
    //                 BadgeToken storage token = badgeTokenFactory._badgeTokens(ownedToken);
    //                 _badgeDefinitionIds[_totalNumberOfBadges] = token.badgeDefinitionId;
    //                 ++_totalNumberOfBadges;
    //             }
    //         } 
    //     } 

    //     return (_totalNumberOfBadges, _badgeDefinitionIds, _badgeTokenIds);
    // }

    // /**
    // * @notice Function to test if the badge produced using a BadgeDefinition can be mint.
    // * @dev Check if the conditions to mint the badge are met.
    // * @param _owner The Ethereum address of the user.
    // * @param _badgeDefinitionId The ID of BadgeDefinition.
    // * @return _evaluationResult The result of the test.
    // */
    // function doesOwnBadgeFromGivenDefinition(address _owner, uint _badgeDefinitionId) external view returns (bool _evaluationResult) {
    //     _evaluationResult = true;

    //     // Check for a BadgeToken potentially owned by this user associated to the BadgeDefinition
    //     // if(_ownedBadges[_owner][_badgeDefinitionId] == 0){
    //     uint tokenIndex = badgeTokenFactory._ownedBadges[_owner].definitionToIndex[_badgeDefinitionId];
    //     if(tokenIndex == 0){
    //         _evaluationResult = false;
    //     } 

    //     return _evaluationResult;
    // }
}