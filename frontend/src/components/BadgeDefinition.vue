<template>
    <v-row class="text-center" justify="center">
  <v-card
    elevation="15"
    style="max-width:700px; max-height: 1000px;
    padding: 1.5rem; color: white; font-weight: 500;
    opacity: 0.95;"
    class="pa-10 mt-15"
    shaped
  >

    <v-row>
      <span class="text-h4 font-weight-light black--text">
        Badge Factory 
      </span>
    </v-row>
      <br/>
      <p class="text-subtitle-1 font-weight-thin black--text" align="left">
        No-code NFT badge issuing
      </p>
      <br/>
      <img height="42px" width="42px" :src="protocolsUrl['Ethereum']" />
      <p class="text-h6 font-weight-regular black--text">
        ERC-721 Standard
      </p>
        <template>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >

            <v-row>
              <v-col cols="4">
                <v-subheader class="text-subtitle-1">Badge Name</v-subheader>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  label="Badge Name"
                  required
                  outlined
                  shaped
                  class="mb-n6"
                  :hint="hintName"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4">
                <v-subheader class="text-subtitle-1">Description</v-subheader>
              </v-col>
              <v-col cols="8">
                  <v-textarea
                    label="Description"
                    auto-grow
                    outlined
                    rows="3"
                    row-height="25"
                    shaped
                    class="mb-n12"
                    :hint="hintDescription"
                  ></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4">
                <v-subheader class="text-subtitle-1">IPFS URI</v-subheader>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="ipfsURI"
                  label="Ipfs URI"
                  required
                  outlined
                  shaped
                  class="mb-n6"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-icon
              color="black"
              v-bind="attrs"
              v-on="on"
              class="mt-3"
              large
            >
              mdi-pickaxe
            </v-icon>
            <p class="text-h6 font-weight-regular black--text"> 
              Minting Conditions 
            </p>
            <v-row>
                <v-select
                  v-model="protocol"
                  :items="protocols"
                  :rules="[v => !!v || 'Protocol is required']"
                  label="Protocol"
                  required
                  outlined
                  shaped
                  class="mt-5"
                  dense
                  style="max-width:300px;"
                  :hint="hintProtocol"
                >
                  <template slot="selection" slot-scope="data">
                    <v-flex xs2>
                      <v-avatar size="25px">
                        <img class="mx-2" height="30px" width="30px" :src="protocolsUrl[data.item]" />
                      </v-avatar>
                    </v-flex>
                    <v-flex class='ml-1'>
                      {{ data.item }}
                    </v-flex>
                  </template>
                <template slot="item" slot-scope="data">
                  <v-list-tile-avatar>
                    <img class="mr-5" height="30px" width="30px" :src="protocolsUrl[data.item]" />
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item"></v-list-tile-title>
                  </v-list-tile-content>
                </template>
                </v-select>
                <v-spacer/>
                <v-select
                  v-model="indexer"
                  :items="indexers"
                  :rules="[v => !!v || 'Protocol is required']"
                  label="Indexer"
                  required
                  outlined
                  shaped
                  class="mt-5"
                  dense
                  style="max-width:300px;"
                  :hint="hintIndexer"
                >
                  <template slot="selection" slot-scope="data">
                    <v-flex xs2>
                      <v-avatar size="25px">
                        <img class="mx-2" height="30px" width="30px" :src="protocolsUrl[data.item]" />
                      </v-avatar>
                    </v-flex>
                    <v-flex class='ml-1'>
                      {{ data.item }}
                    </v-flex>
                  </template>
                 <template slot="item" slot-scope="data">
                  <v-list-tile-avatar>
                    <img class="mr-2" height="30px" width="30px" :src="protocolsUrl[data.item]" />
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="data.item"></v-list-tile-title>
                  </v-list-tile-content>
                </template>
                </v-select>
            </v-row>

            <v-row>
              <v-select
                v-model="metric"
                :items="metrics"
                :rules="[v => !!v || 'Metric is required']"
                label="Metric"
                required
                outlined
                shaped
                dense
                style="max-width:200px;"
                :hint="hintMetric"
              ></v-select>
                <v-spacer/>
              <v-select
                v-model="operator"
                :items="operators"
                :rules="[v => !!v || 'Operator is required']"
                label="Operator"
                required
                outlined
                shaped
                dense
                style="max-width:150px;"
                :hint="hintOperator"
              > 
              </v-select>
              <v-spacer/>
              <v-text-field
                v-model="value"
                label="Value"
                :rules="[v => !!v || 'Value is required']"
                required
                outlined
                shaped
                dense
                style="max-width:100px;"
                :hint="hintValue"
              ></v-text-field>
              <v-spacer/>
              <v-btn
                class="ma-3"
                dark
                color="indigo"
                @click="updateConditions"
              >
              <v-icon dark>
                mdi-plus
              </v-icon>
              Add condition
            </v-btn>            
            </v-row>
            <div class="green--text ma-1" v-if="showConditions" align="left">
              The badge will be claimable to users of : <br/>
              <p v-for="condition in conditions" :key="condition.protocol">
               {{ condition[0] }} having {{ condition[1] }} {{ condition[2] }} {{ condition[3] }}
              </p>
            </div>

            <v-switch
              v-model="checkbox2"
              label="NFT transfer authorized"
              required
              color="indigo"
            ></v-switch>

            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="validate"
            >
              Deploy Badge Model
            </v-btn>
          </v-form>
        </template>
    <v-spacer></v-spacer>
  </v-card>
    </v-row>
</template>

<script>

  export default {
    name: 'BadgeFactory',
    data: () => ({
      valid: true,
      name: '',
      descritption: '',
      value: '',
      protocol: '',
      metric: '',
      indexer: '',
      operator: '',
      ipfsURI: '',
      conditions: [],
      nameRules: [
        v => !!v || 'Badge Name is required',
        v => (v && v.length <= 10) || 'Badge Name must be less than 10 characters',
      ],
      select: null,
      protocols: [
        'Uniswap',
        'Compound',
        'Aave',
        'Ethereum'
      ],
      metrics: [
        'Number of swap',
        'Gas consumed',
        'ETH value borrowed',
        'Number of liquidations',
        'Tx before',
        'Number of tokens',
        'Number of flash loans',
        'Has liquidate somebody'
      ],
      indexers: [
        'The Graph Protocol',
        'Covalent',
      ],
      operators: [
        '==',
        '=>',
        '<=',
        '>',
        '<',
      ],
      checkbox2: true,
      hintName: "The name of your badge (example: \"Uniswapper boy\")",
      hintDescription: "The description of your badge (example: \"The best badge ever\")",
      hintProtocol: "Users that interact with",
      hintIndexer: "The data source used as Oracle",
      hintMetric: "The metric concerned by the condition",
      hintOperator: "The operator such as equal, greater/less than",
      hintValue: "The number ....",
      showConditions: false,
      protocolsUrl: { 
        "Compound" : "https://cryptologos.cc/logos/compound-comp-logo.png?v=012",
        "Uniswap" : "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=012",
        "Aave": "https://cryptologos.cc/logos/aave-aave-logo.png?v=012",
        "Maker": "https://cryptologos.cc/logos/maker-mkr-logo.png?v=012",
        "Ethereum": "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=010",
        "Covalent": "https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/e95/9bd/80-/e959bd80-e08c-4083-a467-a3c18af86913-1618465679-a07840bd3fb5bd1bfd842bf425f7a6a9f83dbab0.png",
        "The Graph Protocol":"https://cryptologos.cc/logos/the-graph-grt-logo.png?v=010"
        }
    }),

    methods: {
      validate () {
        this.$refs.form.validate()
      },
      updateConditions () {
        if (this.$refs.form.validate()) {
          this.showConditions = true
          this.conditions.push([this.protocol, this.metric, this.operator,this.value])
        }
      }
    },
  }
</script>