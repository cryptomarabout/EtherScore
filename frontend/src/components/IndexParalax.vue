<template>
  <v-container>
     <section>
        <v-parallax src="@/assets/paralax2.jpg" height="500" width="100%">
          <v-layout
            column
            align-center
            justify-center
            class="white--text"
          >
            <img
              src="@/assets/logo.png"
              class="my-3"
              height="150"
            />
            <h1 class="white--text mb-2 text-h4 text-center">EtherScore</h1>
            <div class="white--text text-h5 mb-4 text-center">A Decentralized Reputation System</div>
            <v-btn
              class="mt-12 rounded-xl pa-9"
              dark
              large
              href="/badges"
            >
        <v-icon color="white">mdi-arrow-right-circle-outline</v-icon>
              Claim your Badges
        <v-icon>mdi-hexagon-slice-6</v-icon>
            </v-btn>
            
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <v-layout
          column
          wrap
          class="my-12"
          align-center
        >
          <v-flex xs12 sm4 class="my-4">
            <div class="text-center">
              <h2 class="headline">What is EtherScore ?</h2>
              <span class="subheading">
                A protocol enabling Dapps to better identify and reward their users
              </span>
            </div>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout row wrap align-center>
                <v-flex xs12 md4>
                  <v-card flat class="transparent">
                    <v-card-text class="text-center">
                      <v-icon x-large color="black" class="text-h2">
                        mdi-hexagon-slice-6
                      </v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">NFTs Badges</div>
                    </v-card-title>
                    <v-card-text>
                      Protocols can issue EtherScore badges to distribute to their users. <br/>
                      On-Chain verification of badge's conditions through Oracles. <br/>
                      Based on Covalent and The Graph Protocol indexed data.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card flat class="transparent">
                    <v-card-text class="text-center">
                      <v-icon x-large color="black" class="text-h2">mdi-account-multiple-check</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-center">Community curation</div>
                    </v-card-title>
                    <v-card-text>
                      Reliable protocol's users are identified. <br/>
                      Protocols know their community. <br/>
                      More trust
                      A fair airdrop distribution model for protocols <br/>
                      An open Ethereum user profile standard<br/>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card flat class="transparent">
                    <v-card-text class="text-center">
                      <v-icon x-large color="black" class="text-h2">mdi-gift-outline</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-center">Benefits</div>
                    </v-card-title>
                    <v-card-text>
                      <ul>Protocols can offer to reliable users: <br/>
                        <li>More profitable DeFi pools</li>
                        <li>Less collateralized DeFi pools</li>
                        <li>Premium access to alpha/beta services</li>
                        <li>More DAO voting power</li>
                        <li>IDO whitelist</li>
                      </ul> <br/>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </section>

      <section>
        <v-parallax src="@/assets/paralax2.jpg" height="380">
          <v-layout column align-center justify-center>
            <div class="headline black--text mb-4 text-center">Participate to challenges and events</div>
            <em class="black--text"> Get partners offers if you are a reliable user</em>
            <v-btn
              class="mt-12 rounded-xl pa-9"
              dark
              large
              href="/community"
            >
        <v-icon color="white">mdi-arrow-right-circle-outline</v-icon>
              Go To Community
        <v-icon>mdi-account-group</v-icon>
            </v-btn>
          </v-layout>
        </v-parallax>
      </section>
    <section>
        <v-container grid-list-xl>
          <v-layout row wrap justify-center class="my-12">
            <v-flex xs12 sm4>
              <v-card flat class="transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Company info</div>
                </v-card-title>
                <v-card-text>
                  EtherScore is a protocol based on Ethereum enabling Dapps to better identify their reliable
                   users by distributing them NFTs. These NFTs can then be used as conditions to access
                   specific smart contracts, airdrops, or even more DAO voting power and many other incentives.
                   EtherScore uses Covalent and The Graph Protocol to execute all process on-chain.
                   
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm5 offset-sm1>
              <v-card flat class="transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Contact us</div>
                </v-card-title>
                <v-card-text>
                  Feel free to contact us : 
                </v-card-text>
                <v-list class="transparent">
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>etherscore@protonmail.com</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </section>
  </v-container>
</template>

<script>
  export default {
    name: 'IndexParalax',
  }
</script>
