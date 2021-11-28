<template>
  <v-row class="text-center" justify="center">
    <v-card
      elevation="15"
      style="max-width:500px; max-height: 1000px;
      padding: 1.5rem; color: white; font-weight: 500;
      opacity: 0.95;"
      class="pa-10 mt-15"
      shaped
    >

    <v-row>
      <span class="text-h6 font-weight-light black--text">
        How to create a badge:
      </span>
    </v-row>
      <br/>
      <p class="text-subtitle-1 font-weight-thin black--text" align="left">
        1- Publish Badge avatar on IPFS/Filecoin:
      <v-icon
      large
        color="green"
        v-if="isImgUploaded"
      >
        mdi-check
      </v-icon>
      </p>
      <br/>
        <template>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >

            <v-row>
              <v-file-input
                v-model="files"
                accept="image/*"
                label="Badge Avatar"
                @change="updateAvatar()"
                prepend-icon="mdi-camera"
                truncate-length="10"
              > </v-file-input>
              <v-spacer/>
              <v-avatar
                width=125px
                height=125px
                class="mr-2">
              <v-img
                :src="imageUploaded"
                width=130px
                height=130px
              />
              </v-avatar>
            </v-row>
              <v-btn
                color="secondary"
                @click="getTodos()"
                style="font-size: 10px"
                class="pa-3 mb-2"
                :loading="this.loading"
              >
                Publish Avatar
              </v-btn>
              
              <v-spacer/>
            <v-row>
              <v-col cols="12">
              <v-avatar v-if="isImgUploaded" size="25px" class="ml-2">
                <img class="mx-2" height="25px" width="25px" :src="protocolsUrl['IPFS']" />
              </v-avatar>
              <v-avatar v-if="isImgUploaded" size="25px" class="ma-2">
                <img class="mx-2" height="25px" width="25px" :src="protocolsUrl['Filecoin']" />
              </v-avatar>
            <v-chip outlined class="pa-3" v-if="isImgUploaded">
              Avatar CID : {{ this.ipfsCid.substring(0, 12) +'...' }}
              <v-tooltip
                v-if="this.ipfsCid !== ''"
                bottom
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="grey"
                    v-bind="attrs"
                    v-on="on"
                    v-on:click="copyCid"
                    class="ml-3"
                  >
                    mdi-content-copy
                  </v-icon>
                </template>
                <span>{{ hintCopyCid }}</span>
                </v-tooltip>
               <v-tooltip
                v-if="this.ipfsCid !== ''"
                bottom
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="grey"
                    v-bind="attrs"
                    v-on="on"
                    v-on:click="newTabFunction"
                    class="ml-10"
                  >
                    mdi-open-in-new
                  </v-icon>
                </template>
                <span> Check Image on dweb</span>
                </v-tooltip>
            </v-chip>
              </v-col>
            </v-row>

            <p class="text-subtitle-1 font-weight-thin black--text mt-2" align="left">
              2- Publish NFT metadata on IPFS/Filecoin:
            </p>            

            <v-row>
              <v-col cols="12">
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
              <v-col cols="12">
                  <v-textarea
                    label="Description"
                    auto-grow
                    outlined
                    rows="3"
                    row-height="25"
                    shaped
                    :hint="hintDescription"
                  ></v-textarea>
                  <v-spacer/>

                  <!-- <v-btn
                    color="secondary"
                    @click="getTodosNFT"
                    style="font-size: 10px"
                    class="pa-3 mb-2"
                    :loading="this.loading"
                  >
                    Publish Metadata
                  </v-btn> -->
                  <v-spacer/>
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
                  class="mt-5 mx-auto"
                  dense
                  style="max-width:200px;"
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
                <v-select
                  v-model="indexer"
                  :items="indexers"
                  :rules="[v => !!v || 'Protocol is required']"
                  label="Indexer"
                  required
                  outlined
                  shaped
                  class="mt-5 mx-auto"
                  dense
                  style="max-width:200px;"
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
                class="ml-2"
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
                class="ml-2"
                style="max-width:200px;"
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
                class="mx-auto"
                :hint="hintValue"
              ></v-text-field>  
              <v-spacer/>   
              <v-btn
                dark
                color="indigo"
                @click="updateConditions"
                style="font-size: 10px"
                class="pa-3 mr-3"
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
              color="secondary"
              @click="getTodosNFT"
              style="font-size: 10px"
              class="pa-3 mb-5"
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

 import axios from 'axios'

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
      files: [],
      imageUploaded: null,
      ipfsCid: '',
      isImgUploaded: false,
      loading: false,
      nameRules: [
        v => !!v || 'Badge Name is required',
        v => (v && v.length <= 15) || 'Badge Name must be less than 10 characters',
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
      hintName: "The name of your badge (example: \"My Badge\")",
      hintDescription: "The description of your badge (example: \"The best badge ever\")",
      hintProtocol: "Users that interact with",
      hintIndexer: "The data source used as Oracle",
      hintMetric: "The metric concerned by the condition",
      hintOperator: "The operator such as equal, greater/less than",
      hintValue: "The number ....",
      hintCopyCid: 'Copy CID',
      showConditions: false,
      protocolsUrl: { 
        "Compound" : "https://cryptologos.cc/logos/compound-comp-logo.png?v=012",
        "Uniswap" : "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=012",
        "Aave": "https://cryptologos.cc/logos/aave-aave-logo.png?v=012",
        "Maker": "https://cryptologos.cc/logos/maker-mkr-logo.png?v=012",
        "Ethereum": "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=010",
        "Covalent": "https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/e95/9bd/80-/e959bd80-e08c-4083-a467-a3c18af86913-1618465679-a07840bd3fb5bd1bfd842bf425f7a6a9f83dbab0.png",
        "The Graph Protocol":"https://cryptologos.cc/logos/the-graph-grt-logo.svg?v=010",
        "IPFS": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Ipfs-logo-1024-ice-text.png/600px-Ipfs-logo-1024-ice-text.png",
        "Filecoin": "https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=014"
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
      },
      getTodosNFT () {
        const path = 'https://api.nft.storage/upload'
        const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM1RDM5YWQ4YTczNWE2OTIwNzMwZkRiNzRDNDNmMDc3NkUyZjBiQzQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNzc3OTU5MzM1NiwibmFtZSI6Ik5GVCBIYWNrIEVuY29kZUNsdWIifQ.YLqi4uqEccmvzME52hI1ImYdp-Fhj-iajEg4O0ltcp8'
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.post(path, 
          {
            "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.", 
            "external_url": "https://openseacreatures.io/3", 
            "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png", 
            "name": "Dave Starbelly",
            "attributes": [], 
          })
          .then((res) => {
            console.log(res.data)
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.error(error);
          })
      },
      getTodos () {
        this.loading=true  
        const path = 'https://api.nft.storage/upload'
        const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM1RDM5YWQ4YTczNWE2OTIwNzMwZkRiNzRDNDNmMDc3NkUyZjBiQzQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNzc3OTU5MzM1NiwibmFtZSI6Ik5GVCBIYWNrIEVuY29kZUNsdWIifQ.YLqi4uqEccmvzME52hI1ImYdp-Fhj-iajEg4O0ltcp8'
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.post(path, this.files)
          .then((res) => {
            this.ipfsCid=res.data.value.cid
            this.isImgUploaded=true
            this.loading=false 
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.error(error);
          })
      },
      async copyCid () {
          await navigator.clipboard.writeText(this.ipfsCid)
          this.hintCopyCid = 'Copied'
        },
      updateAvatar () {
        this.imageUploaded= URL.createObjectURL(this.files)
      },
    newTabFunction () { 
                  window.open( 
              "https://bafkreidlpgmnckav76ruiikwedz7tkuyqz6g6kwoxipy55p3ab4xxs4miq.ipfs.dweb.link/", "_blank")
    }
    },
  }
</script>