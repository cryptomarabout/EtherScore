<template>
  <v-container>
    <v-row class="text-center">
      <!-- <v-card
          elevation="15"
          style="min-width:1200px; min-height:450px; border-radius: 20px;
           padding: 1.5rem;  border: 1px solid; color: white; background-color: secondary; font-weight: 500;
           opacity: 0.95;"
          class="pa-10 mt-15"
        > -->
      <v-col class="pt-10" cols="12">
        <v-spacer></v-spacer>
        <p class="text-h4 font-weight-thin white--text pt-5">
          Claim EtherScore badges & build your reputation
        </p>

        <v-spacer></v-spacer>
        <metamask-chip />
      </v-col>

      <v-spacer></v-spacer>
      <v-row justify="center">
        <template v-for="nft in this.todos" justify="center">
          <v-card
            :key="nft.id"
            class="mx-primary"
            elevation="5"
            style="
              margin: 50px;
              margin-top: 20px;
              max-width: 300px;
              border-radius: 20px;
              padding: 0.6rem;
              border: 1px solid;
              color: white;
              font-weight: 500;
              opacity: 0.95;
            "
            color="background"
          >
            <v-spacer />
            <v-chip class="text-h5 font-weight-light black mt-1 mb-4" outlined>
              {{ nft.name }}
            </v-chip>
            <v-spacer />
            <v-avatar width="110px" height="110px">
              <v-img :src="nft.image_url" width="110px" height="110px" />
            </v-avatar>

            <v-spacer />
            <v-spacer />
            <p
              align="center"
              justify="center"
              class="black--text mt-3 font-italic"
            >
              {{ nft.description }}
            </p>
            <v-spacer />
            <br />
            <v-icon color="black" v-bind="attrs" v-on="on" class="mb-1">
              mdi-pickaxe
            </v-icon>
            <span class="text-subtitle-1 black--text">
              Minting conditions:
            </span>

            <v-list-item
              v-for="condition in nft.conditions"
              :key="condition.description"
              class="ma-0 pa-0"
            >
              <v-list-item-avatar class="mr-2">
                <img :src="protocolsUrl[condition.protocol]" />
              </v-list-item-avatar>

              <v-list-item-content align="left">
                <v-list-item-title
                  v-text="condition.protocol"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-if="!address || getExperienceValue(condition) !== 100"
                  v-text="
                    condition.description +
                    ' ' +
                    condition.operator +
                    ' ' +
                    condition.target
                  "
                ></v-list-item-subtitle>
                <v-list-item-subtitle
                  class="green--text"
                  v-else
                  v-text="
                    condition.description +
                    ' ' +
                    condition.operator +
                    ' ' +
                    condition.target
                  "
                ></v-list-item-subtitle>
                <v-progress-linear
                  color="green"
                  :value="getExperienceValue(condition)"
                  v-if="display"
                  height="20"
                >
                  <span
                    v-if="
                      getExperienceValue(condition) < 100 &&
                      condition.target !== 0
                    "
                  >
                    {{
                      "You: " +
                      Math.round(condition.current) +
                      " / " +
                      condition.target
                    }}
                  </span>
                  <span
                    v-else-if="
                      getExperienceValue(condition) !== 100 &&
                      condition.target == 0
                    "
                  >
                    {{ "You: " + Math.round(condition.current) }}
                  </span>
                  <span v-else> Satisfied ✔ </span>
                </v-progress-linear>
              </v-list-item-content>

              <v-list-item-action>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="grey lighten-1" v-bind="attrs" v-on="on">
                      mdi-information
                    </v-icon>
                  </template>
                  <span>Datasource: </span>
                  <span>{{ condition.indexer }}</span>
                  <img
                    width="25px"
                    height="25px"
                    class="ml-1 mb-n2"
                    :src="protocolsUrl[condition.indexer]"
                  />
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-if="!address || getExperienceValue(condition) !== 100"
                      color="secondary"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-checkbox-blank-outline
                    </v-icon>
                    <v-icon v-else color="green" v-bind="attrs" v-on="on">
                      mdi-checkbox-marked-outline
                    </v-icon>
                  </template>
                  <span v-if="!address || getExperienceValue(condition) != 100"
                    >Condition not satisfied</span
                  >
                  <span v-else>Condition satisfied</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>

            <v-spacer></v-spacer>
            <v-card-actions class="my-auto">
              <badge-dialog-detail :nft="nft" class="rounded-xl" />
              <v-chip
                class="text-subtitle-1 font-weight-light black pa-2 mx-auto"
                outlined
                color="green"
                justify="start"
                v-if="nft.id == 0 && displayClaimed"
              >
                Owned
              </v-chip>
              <v-chip
                class="text-subtitle-1 font-weight-light black pa-2 mx-auto"
                outlined
                color="red"
                justify="start"
                v-else
              >
                Not owned
              </v-chip>
              <!-- <v-btn
                  color="secondary"
                  class="rounded-xl"
                  :disabled="!isClaimable(nft)"
                  v-on:click="fakeMetamaskPrompt"
                >
                  <span v-if="!isClaimable(nft) && displayClaimed && nft.name === 'Ze Trader'"> Claimed </span>
                  <span v-else-if="!isClaimable(nft)"> Not Claimable </span>
                  <span v-else> Claim </span>
                  </v-btn>
                  -->
              <v-btn
                color="secondary"
                class="rounded-xl"
                :disabled="!isClaimable(nft)"
                v-on:click="fakeMetamaskPrompt"
              >
                <span> Claim </span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-row>
      <!-- </v-card> -->
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import MetamaskChip from "../components/MetamaskChip.vue";
import BadgeDialogDetail from "../components/BadgeDialogDetail.vue";
import Web3 from "web3";
import json from "../BadgeTokenFactory.json";

export default {
  name: "Badges",
  components: {
    MetamaskChip,
    BadgeDialogDetail,
  },
  computed: mapState(["address"]),
  data() {
    return {
      info: null,
      todos: [],
      display: false,
      displayClaimed: false,
      myJson: json,
      oracleReturn: [],
      protocolsUrl: {
        Compound: "https://cryptologos.cc/logos/compound-comp-logo.png?v=012",
        Uniswap: "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=012",
        Aave: "https://cryptologos.cc/logos/aave-aave-logo.png?v=012",
        Maker: "https://cryptologos.cc/logos/maker-mkr-logo.png?v=012",
        Ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=010",
        Covalent:
          "https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/e95/9bd/80-/e959bd80-e08c-4083-a467-a3c18af86913-1618465679-a07840bd3fb5bd1bfd842bf425f7a6a9f83dbab0.png",
        "The Graph":
          "https://cryptologos.cc/logos/the-graph-grt-logo.png?v=010",
      },
    };
  },
  created() {
    this.getTodos();
  },
  watch: {
    async address() {
      await this.getTodos();
      this.display = true;
    },
  },
  methods: {
    getTodos() {
      const path = process.env.VUE_APP_BASE_URL + "badges";
      axios
        .post(path, { wallet_address: String(this.address) })
        .then((res) => {
          this.todos = res.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    getExperienceValue(condition) {
      if (condition !== undefined) {
        if (condition.operator == ">") {
          if (condition.target == 0 && condition.current > 0) {
            return 100;
          }
          if (condition.target == 0 && condition.current == 0) {
            return 0;
          }
          if (condition.current > condition.target) {
            return 100;
          }
          return (100 * condition.current) / condition.target;
        }
        if (condition.operator == "==") {
          if (condition.target == condition.current) {
            return 100;
          }
          if (condition.current == null && condition.target == 0) {
            return 100;
          }
        }
        return 0;
      }
    },
    async fakeMetamaskPrompt() {
      const web3 = new Web3(window.ethereum, null, {
        transactionConfirmationBlocks: 1,
      });
      var contract = new web3.eth.Contract(
        this.myJson.abi,
        "0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B"
      );
      console.log(contract);
      var query = await contract.methods.requestBadgeTokenMinting("2");
      var res = await query.send({ from: this.$store.state.address });
      console.log(res);
      var eventsList = await contract
        .getPastEvents("QueryRequest", {
          fromBlock: "latest",
          toBlock: "latest",
        })
        .then(function (events) {
          console.log(events);
          return events;
        });
      for (var queryRequest in eventsList) {
        console.log(queryRequest);
        await this.callOracle("2");
        var oracle = await contract.methods.updateBadgeTokenMinting(
          eventsList[queryRequest]["returnValues"]["_requestID"],
          String(this.oracleReturn[0])
        );
        console.log(oracle);
        var res2 = await oracle.send({ from: this.$store.state.address });
        console.log(res2);
      }

      await contract
        .getPastEvents("BadgeTokenReady", {
          fromBlock: "latest",
          toBlock: "latest",
        })
        .then(function (events) {
          return events[0]["returnValues"]["0"];
        });
      var mintQuery = await contract.methods.mintBadgeToken("2");
      var res3 = await mintQuery.send({ from: this.$store.state.address });
      this.displayClaimed = true;
      console.log(res3);

      // for (var condition in res.events){
      //   console.log(condition[0]["returnValues"]["_requestID"])
      // }
      // await window.ethereum.request({
      //   method: 'eth_sendTransaction',
      //   params: [{
      //     from: this.address,
      //     to: '0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E', // Initially only supports ERC20, but eventually more!
      //   }],
      // });
    },
    isClaimable(nft) {
      for (var condition in nft.conditions) {
        if (this.getExperienceValue(nft.conditions[condition]) !== 100) {
          return false;
        }
        if (nft.id == 0 && this.displayClaimed) {
          return false;
        }
      }
      return true;
    },
    async callOracle(badgeId) {
      const path = process.env.VUE_APP_BASE_URL + "oracle";
      await axios
        .post(path, {
          wallet_address: String(this.address),
          badge_id: String(badgeId),
        })
        .then((res) => {
          this.oracleReturn = res.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    async testAddToken() {
      const tokenAddress = "0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B";
      const tokenSymbol = "ETHS";
      const tokenDecimals = 0;
      const tokenImage =
        "http://localhost/img/etherscore_black_transparent.1dbd9f05.png";

      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            },
          },
        });

        if (wasAdded) {
          console.log("Thanks for your interest!");
        } else {
          console.log("Your loss!");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
