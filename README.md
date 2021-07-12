
# EtherScore
<p align="center">
  <img src="https://github.com/cryptomarabout/EtherScore/blob/main/frontend/src/assets/etherscore_black_transparent.png">
</p>

*Ethereum community curation protocol using NFTs based on transaction history*

EtherScore is a protocol based on Ethereum enabling Dapps to better identify their reliable users by distributing them NFTs based on their previous actions. These NFTs can then be used as conditions to access specific smart contracts, airdrops, or even more DAO voting power and many other incentives. EtherScore uses data indexers The Graph Protocol and Covalent to execute all processes on-chain. As use cases we have already defined several badges based on Aave, Compound and Uniswap protocol history as it can be found directly into the blockchain. Those badges are a first step in order to facilitate those platforms to curate their valuable and notable users.

Video presentation: https://www.youtube.com/watch?v=RqNBkbVOFa0

## Main features
EtherScore comes with a badge factory allowing to:

 - Define meta-badges by settings some attributs and conditions that will be stored as NFTs (ERC-721); 
 - Claim badges (also stored NFTs) related to those meta-badges (just like they where instances of the meta-badges) by checking if the user trying to claim the badges is currently fulfilling his attribution conditions.

 To accomplish the minting of the badges the queries are sent using an oracle (requesting The Graph Protocol and Covalent ultimately) that stored the query and its result as well into the blockchain. This storage of the condition fulfillment attempt can be used for further badge certifications. 

As previously mentioned the main goal of the badges is to be real proofs of experience/activity/achievement to grant to their valuable holders exclusive access or reward according to the platform policies towards them.

## Architecture

- Front-end: VueJS (vuetify) for UI and web3 interaction
- Back-end : Python 3 (FastAPI) + The Graph & Covalent used as data sources
- Smart contracts : Solidity using Truffle & Ganache.

Each service is run as a docker container to be easily deployed and maintained.

## Run project

1. Clone repository
```bash
$ git clone https://github.com/cryptomarabout/EtherScore
$ cd EtherScore
```

2. Trigger the deployment
```bash
$ docker-compose up --build
```
3. Useful links: 
* Web front : `http://localhost`
* API endpoint : `http://localhost/api/`
* API doc : `http://localhost/api/docs`
