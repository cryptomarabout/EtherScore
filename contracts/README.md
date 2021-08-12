# Managing the development environment for Smart Contracts

## Setup of the project
```bash
$ cd <repo root>/contracts
$ npm install --save-dev truffle                    # Installing development framework
$ npm install --save-dev truffle-contract-size      # Adding a tools to assist code size optimization 
$ npx truffle init                                  # Creating the project
$ npm install --save-dev @openzeppelin/contracts    # Adding libraries
$ npm install --save-dev ganache-cli                # Installing deployment tools
$ npm install --save-dev chai                       # Installing tools for automated tests
$ npm install --save-dev @openzeppelin/test-helpers # Adding extra libraries for automated tests
```
Additionnaly you can install a library to generate the documentation & use it:
```bash
$ cd <repo root>/contracts
$ npm install solidity-docgen
$ npm install -D solc-0.8@npm:solc@^0.8.0
$ npx solidity-docgen --solc-module solc-0.8 -i ./contracts -o ./docs -t ./docs
```
... the documentation can be found in the [following directory](./docs)

## Compile the smart contracts
```bash
$ cd <repo root>/contracts
$ npx truffle compile
```

## Cheking for the size of the smart contracts (each one has to stay below 24576 bytes)
```bash
$ cd <repo root>/contracts
$ npx truffle run contract-size --checkMaxSize
```

## Deploy locally the smart contracts (will compile the code)
First launch a blank local blockchain with prebuild accounts:
```bash
$ cd <repo root>/contracts
$ npx ganache-cli --deterministic                   # Creating local accounts for testing purpose (it will lock the terminal)
```
The network is running here: `http://localhost:8545`

... then you can build and deploy the contracts:
```bash
$ cd <repo root>/contracts
$ npx truffle migrate --network development         # Build & deploy the contract 
```

## Interact locally with the smart contracts
You can interact manually:
```bash
$ cd <repo root>/contracts
$ npx truffle console --network development
truffle(development)> await ... .deployed()
truffle(development)> await ... .store(...)                # sending transaction
truffle(development)> await ()... .retrieve()).toString()  # querying state
```

... or using the available scripts:
```bash
$ cd <repo root>/contracts
$ ./testme.sh
```

## Run automated tests
```bash
$ cd <repo root>/contracts
$ npx truffle test
```

## Deploy the smart contracts on a test network
```bash

```

## References from OpenZeppelin
See [ERC721 standard](https://ethereum.org/en/developers/docs/standards/tokens/erc-721).

See [ERC721 documentation](https://docs.openzeppelin.com/contracts/3.x/erc721).

See [ERC721 interfaces](https://docs.openzeppelin.com/contracts/3.x/api/token/erc721).

See [Source code of ERC721 interfaces](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC721).

See [Developing smart contracts](https://docs.openzeppelin.com/learn/developing-smart-contracts?pref=truffle).

See [Deploying and interacting with smart contracts](https://docs.openzeppelin.com/learn/deploying-and-interacting).

See [Writing automated smart contract tests](https://docs.openzeppelin.com/learn/writing-automated-tests).

See [Solidity documentation](https://docs.soliditylang.org/en/develop/index.html).

See [Truffle homepage](https://www.trufflesuite.com/truffle).

See [How to document Solidity smart contracts with no sweat](https://medium.com/coinmonks/how-to-document-solidity-smart-contracts-with-no-sweat-e78936ede833).

See [Downsizing contracts to fight the contract size limit](https://soliditydeveloper.com/max-contract-size).