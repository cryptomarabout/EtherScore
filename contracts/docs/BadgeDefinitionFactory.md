The BadgeDefinitionFactory contract provides basic structures, functions & modifiers that allow to manage BadgeDefinition as ERC721 token.

# Functions:
- [`constructor()`](#BadgeDefinitionFactory-constructor--)
- [`createBadgeDefinition(string _name, string _description, string[] _tags, string _image_uri, bool _isTransferable)`](#BadgeDefinitionFactory-createBadgeDefinition-string-string-string---string-bool-)
- [`addBadgeAttributionCondition(uint256 _badgeDefinitionId, string _description, string _indexer, string _protocol, string _query, string _operator, string _condition)`](#BadgeDefinitionFactory-addBadgeAttributionCondition-uint256-string-string-string-string-string-string-)
- [`publishBadgeDefinition(uint256 _badgeDefinitionId)`](#BadgeDefinitionFactory-publishBadgeDefinition-uint256-)
- [`getBadgeDefinition(uint256 _badgeDefinitionId)`](#BadgeDefinitionFactory-getBadgeDefinition-uint256-)
- [`getBadgeDefinitionAttributionCondition(uint256 _badgeDefinitionId)`](#BadgeDefinitionFactory-getBadgeDefinitionAttributionCondition-uint256-)
- [`isBadgeTransferable(uint256 _badgeDefinitionId)`](#BadgeDefinitionFactory-isBadgeTransferable-uint256-)
- [`tokenURI(uint256 tokenId)`](#BadgeDefinitionFactory-tokenURI-uint256-)

# Events:
- [`NewBadgeDefinition(uint256 _badgeDefinitionId, string _name, string _description, string[] _tags, string _image_uri)`](#BadgeDefinitionFactory-NewBadgeDefinition-uint256-string-string-string---string-)

# Function `constructor()` {#BadgeDefinitionFactory-constructor--}
See {ERC721-constructor}.
# Function `createBadgeDefinition(string _name, string _description, string[] _tags, string _image_uri, bool _isTransferable) → uint256 _badgeDefinitionId` {#BadgeDefinitionFactory-createBadgeDefinition-string-string-string---string-bool-}
Creates & store a BadgeDefinition.

## Parameters:
- `_name`: The name of the token.

- `_description`: The descrition of the token.

- `_tags`: The list of the tags associated to the token.

- `_image_uri`: The URI of the image associated to the token.

- `_isTransferable`: The flag indicates if BadgeToken producted using it can be transfered.

## Return Values:
- _badgeDefinitionId The ID of the new BadgeDefinition.
# Function `addBadgeAttributionCondition(uint256 _badgeDefinitionId, string _description, string _indexer, string _protocol, string _query, string _operator, string _condition)` {#BadgeDefinitionFactory-addBadgeAttributionCondition-uint256-string-string-string-string-string-string-}
Creates & store a BadgeAttributionCondition then link it with a BadgeDefinition.

## Parameters:
- `_badgeDefinitionId`: The ID of the BadgeDefinition.

- `_description`: The descrition of the condition.

- `_indexer`: The service indexing the data (possible values: "thegraph").

- `_protocol`: The set/subgraph on the indexer to use (possible values: "uniswap", "compound").

- `_query`: The query to run.

- `_operator`: The operator allowing to compare the query return.

- `_condition`: The value to compare with the query result.
# Function `publishBadgeDefinition(uint256 _badgeDefinitionId)` {#BadgeDefinitionFactory-publishBadgeDefinition-uint256-}
Allows the BadgeDefinition to become usable to produce badges & emit a NewBadgeDefinition event.

## Parameters:
- `_badgeDefinitionId`: The ID of the BadgeDefinition.
# Function `getBadgeDefinition(uint256 _badgeDefinitionId) → string _name, string _description, string[] _tags, string _image_uri, bool _isTransferable` {#BadgeDefinitionFactory-getBadgeDefinition-uint256-}
Get the informations associated to a BadgeDefinition (except the conditions).

## Parameters:
- `_badgeDefinitionId`: The ID of the BadgeDefinition.

## Return Values:
- _name The name of the token.

- _description The descrition of the token.

- _tags The list of the tags associated to the token.

- _image_uri The URI of the image associated to the token.

- _isTransferable The flag indicates if BadgeToken producted using it can be transfered.
# Function `getBadgeDefinitionAttributionCondition(uint256 _badgeDefinitionId) → uint256 _numberOfAttributionCondition, struct BadgeFactory.BadgeAttributionCondition[5] _badgeDefinitionAttributionConditions` {#BadgeDefinitionFactory-getBadgeDefinitionAttributionCondition-uint256-}
Get the list of BadgeAttributionCondition associated to a BadgeDefinition.

## Parameters:
- `_badgeDefinitionId`: The ID of the BadgeDefinition.

## Return Values:
- _numberOfAttributionCondition The number of associated conditions.

- _badgeDefinitionAttributionConditions The list of BadgeAttributionCondition.
# Function `isBadgeTransferable(uint256 _badgeDefinitionId) → bool _isTransferable` {#BadgeDefinitionFactory-isBadgeTransferable-uint256-}
Return the boolean set at the BadgeDefinition creation.

## Parameters:
- `_badgeDefinitionId`: The ID of the BadgeDefinition.

## Return Values:
- _isTransferable The result of the test.
# Function `tokenURI(uint256 tokenId) → string` {#BadgeDefinitionFactory-tokenURI-uint256-}
Returns the Uniform Resource Identifier (URI) for `tokenId` token.

## Parameters:
- `tokenId`: The ID of the BadgeToken.

## Return Values:
- The result URI associated to the token.

# Event `NewBadgeDefinition(uint256 _badgeDefinitionId, string _name, string _description, string[] _tags, string _image_uri)` {#BadgeDefinitionFactory-NewBadgeDefinition-uint256-string-string-string---string-}
Event emitted after a BadgeDefinition publishing.

## Parameters:
- `_badgeDefinitionId`: The ID of the BadgeDefinition.

- `_name`: The name of the token.

- `_description`: The descrition of the token.

- `_tags`: The list of the tags associated to the token.

- `_image_uri`: The URI of the image associated to the token.
