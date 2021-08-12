The BadgeTokenFactory contract provides basic structures, functions & modifiers that allow to manage BadgeToken as ERC721 token.

# Functions:
- [`constructor(address _badgeDefinitionFactoryAddress)`](#BadgeTokenFactory-constructor-address-)
- [`requestBadgeTokenMinting(uint256 _badgeDefinitionId)`](#BadgeTokenFactory-requestBadgeTokenMinting-uint256-)
- [`requestBadgeTokenDroping(uint256 _badgeDefinitionId, address _to)`](#BadgeTokenFactory-requestBadgeTokenDroping-uint256-address-)
- [`updateBadgeTokenMinting(bytes32 _requestID, string _queryResult)`](#BadgeTokenFactory-updateBadgeTokenMinting-bytes32-string-)
- [`mintBadgeToken(uint256 _badgeDefinitionId)`](#BadgeTokenFactory-mintBadgeToken-uint256-)
- [`dropBadgeToken(uint256 _badgeDefinitionId, address _to)`](#BadgeTokenFactory-dropBadgeToken-uint256-address-)
- [`getAllOwnedBadges(address _owner)`](#BadgeTokenFactory-getAllOwnedBadges-address-)
- [`doesOwnBadgeFromGivenDefinition(address _owner, uint256 _badgeDefinitionId)`](#BadgeTokenFactory-doesOwnBadgeFromGivenDefinition-address-uint256-)
- [`tokenURI(uint256 tokenId)`](#BadgeTokenFactory-tokenURI-uint256-)

# Events:
- [`QueryRequest(bytes32 _requestID, address _caller, string _indexer, string _protocol, string _query)`](#BadgeTokenFactory-QueryRequest-bytes32-address-string-string-string-)
- [`QueryResultReceived(bytes32 _requestID, string _queryResult)`](#BadgeTokenFactory-QueryResultReceived-bytes32-string-)
- [`BadgeTokenReady(address _caller, uint256 _badgeDefinitionId)`](#BadgeTokenFactory-BadgeTokenReady-address-uint256-)
- [`NewBadgeToken(uint256 _badgeTokenId, address _originalOwner)`](#BadgeTokenFactory-NewBadgeToken-uint256-address-)

# Function `constructor(address _badgeDefinitionFactoryAddress)` {#BadgeTokenFactory-constructor-address-}
See {ERC721-constructor}.

## Parameters:
- `_badgeDefinitionFactoryAddress`: The Ethereum address of the BadgeDefinitionFactory contract allowing to manage BadgeDefinition.
# Function `requestBadgeTokenMinting(uint256 _badgeDefinitionId)` {#BadgeTokenFactory-requestBadgeTokenMinting-uint256-}
Creates & store a BadgeToken.

## Parameters:
- `_badgeDefinitionId`: The ID of BadgeDefinition associated to this BadgeToken.
# Function `requestBadgeTokenDroping(uint256 _badgeDefinitionId, address _to)` {#BadgeTokenFactory-requestBadgeTokenDroping-uint256-address-}
Creates & store a BadgeToken.

## Parameters:
- `_badgeDefinitionId`: The ID of BadgeDefinition associated to this BadgeToken.

- `_to`: The Ethereum address of the user that could receive the token.
# Function `updateBadgeTokenMinting(bytes32 _requestID, string _queryResult)` {#BadgeTokenFactory-updateBadgeTokenMinting-bytes32-string-}
Store the result of the query then ask for the Oracle to write it into the blockchain.

## Parameters:
- `_requestID`: The ID of the query.

- `_queryResult`: The result of the query.
# Function `mintBadgeToken(uint256 _badgeDefinitionId) → uint256 _badgeTokenId` {#BadgeTokenFactory-mintBadgeToken-uint256-}
Creates & store a BadgeToken.

## Parameters:
- `_badgeDefinitionId`: The ID of BadgeDefinition associated to this BadgeToken.

## Return Values:
- _badgeTokenId The ID of the new BadgeToken.
# Function `dropBadgeToken(uint256 _badgeDefinitionId, address _to) → uint256 _badgeTokenId` {#BadgeTokenFactory-dropBadgeToken-uint256-address-}
Creates & store a BadgeToken.

## Parameters:
- `_badgeDefinitionId`: The ID of BadgeDefinition associated to this BadgeToken.

- `_to`: The Ethereum address of the user that could receive the token.

## Return Values:
- _badgeTokenId The ID of the new BadgeToken.
# Function `getAllOwnedBadges(address _owner) → uint256 _totalNumberOfBadges, uint256[] _badgeDefinitionIds, uint256[] _badgeTokenIds` {#BadgeTokenFactory-getAllOwnedBadges-address-}
Return two lists of IDs correlated by their index.

## Parameters:
- `_owner`: The Ethereum address of the user.

## Return Values:
- _totalNumberOfBadges The size of the returned lists.

- _badgeDefinitionIds The ID of BadgeDefinition associated to the BadgeToken the user owns.

- _badgeTokenIds The ID of BadgeToken the user owns.
# Function `doesOwnBadgeFromGivenDefinition(address _owner, uint256 _badgeDefinitionId) → bool _evaluationResult` {#BadgeTokenFactory-doesOwnBadgeFromGivenDefinition-address-uint256-}
Check if the conditions to mint the badge are met.

## Parameters:
- `_owner`: The Ethereum address of the user.

- `_badgeDefinitionId`: The ID of BadgeDefinition.

## Return Values:
- _evaluationResult The result of the test.
# Function `tokenURI(uint256 tokenId) → string` {#BadgeTokenFactory-tokenURI-uint256-}
Returns the Uniform Resource Identifier (URI) for `tokenId` token.

## Parameters:
- `tokenId`: The ID of the BadgeToken.

## Return Values:
- The result URI associated to the token.

# Event `QueryRequest(bytes32 _requestID, address _caller, string _indexer, string _protocol, string _query)` {#BadgeTokenFactory-QueryRequest-bytes32-address-string-string-string-}
Event emitted to request for a query to be run for BadgeToken minting.

## Parameters:
- `_requestID`: The ID of the query.

- `_caller`: The Ethereum address which has requested for the right to mint the token.

- `_indexer`: The service indexing the data (possible values: "thegraph, "covalent").

- `_protocol`: The set/subgraph on the indexer to use (possible values: "uniswap", "compound" ,"aave" ,"ethereum").

- `_query`: The query to run.
# Event `QueryResultReceived(bytes32 _requestID, string _queryResult)` {#BadgeTokenFactory-QueryResultReceived-bytes32-string-}
Event emitted fter the query and its result have been record into the blockchain for BadgeToken minting.

## Parameters:
- `_requestID`: The ID of the query.

- `_queryResult`: The result of the query.
# Event `BadgeTokenReady(address _caller, uint256 _badgeDefinitionId)` {#BadgeTokenFactory-BadgeTokenReady-address-uint256-}
Event emitted when a BadgeToken is ready to be minted.

## Parameters:
- `_caller`: The Ethereum address which has requested for the right to mint the token.

- `_badgeDefinitionId`: The ID of BadgeDefinition associated to this BadgeToken.
# Event `NewBadgeToken(uint256 _badgeTokenId, address _originalOwner)` {#BadgeTokenFactory-NewBadgeToken-uint256-address-}
Event emitted after a BadgeToken minting.

## Parameters:
- `_badgeTokenId`: The ID of the BadgeToken.

- `_originalOwner`: The Ethereum address of the user that has minted the token.
