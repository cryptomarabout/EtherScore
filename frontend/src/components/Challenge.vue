<template>
  <v-card
    elevation="15"
    style="max-height:640px; max-width:350px;border-radius: 20px;
    padding: 2.1rem;  border: 1px solid; color: white; font-weight: 500;
    opacity: 0.95;"
  >
    <v-cols>
      <v-img
        alt="EtherScore Logo"
        contain
        src="https://i.pinimg.com/originals/76/d2/13/76d213a9537ce6d60f70303d44a3caf4.png"
        class="mt-n3"
        height="50" 
      />
      <v-spacer/>
      <span class="text-h4 font-weight-light black--text" >
        EtherScore <br/>
        Challenges
      </span>
      </v-cols>
      <p class="text-subtitle-1 font-weight-thin black--text" align="left">
        Events based on user's on-chain data
      </p>

    <v-spacer></v-spacer>

    <v-row
      align="center"
      justify="center"
    >
        <v-card
          class="mx-primary"
          elevation="5"
          style="margin-top:20px; min-width:320px; border-radius: 20px;
          border: 1px solid; color: white; font-weight: 500;
          opacity: 0.95;"
          color="background"
        >
        <v-tabs
          v-model="tabSupply"
          background-color="secondary"
          fixed-tabs
          centered
          icons-and-text
        >
          <v-tabs-slider  class="v-tabs-slider-wrapper" style="height: 5px;"></v-tabs-slider>

          <v-tab href="#tab-1" style="color:grey">
            Weekly
            <v-icon>mdi-calendar-week</v-icon>
          </v-tab>

          <v-tab href="#tab-2" style="color:grey">
            Monthly
            <v-icon>mdi-calendar-month</v-icon>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tabSupply" class="ma-1">
          <v-tab-item
            v-for="i in 3"
            :key="i"
            :value="'tab-' + i"
          >
          </v-tab-item>
        </v-tabs-items>
        <v-list-item
          v-for="badge in badges"
          :key="badge.title"
          class="ma-0 pa-0"
        >
          <v-list-item-avatar width="80px" height="80px" class="ml-2">
            <v-img 
              height="125"
              :src="badge.logo"
        transition="scale-transition"/>
          </v-list-item-avatar>

          <v-list-item-content align="left">
            <v-list-item-subtitle v-text="badge.date" class="font-italic"></v-list-item-subtitle>
            <v-list-item-title v-text="badge.title"></v-list-item-title>
            <v-list-item-subtitle v-text="badge.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
          

          <!-- TODO: The next v-if should request user's balance -->
          <v-list-item-action>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="grey lighten-1"
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2 mt-4"
                  >
                    mdi-information
                  </v-icon>
                </template>
                <span>More informations</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="secondary"
                    v-bind="attrs"
                    v-on="on"
                    class="mr-2"
                  >
                    mdi-poll
                  </v-icon>
                </template>
                <span v-if="badge.title === 'Ze Trader' && address">You have this NFT</span>
                <span v-else>You do not have this NFT</span>
              </v-tooltip>

          </v-list-item-action>
        </v-list-item>
        </v-card>
      </v-row>
  </v-card>
</template>

<script>
  export default {
    name: 'Challenge',
    props: {
      vaultTitle: String
    },
    data () {
      return {
        valueSubmitted: 0,
        tabSupply: null,
        tabBorrow: null,
        tickStep: 0.05,
        badges: [
        {
          subtitle: 'top 10 gas consumer',
          title: 'Ze Consumers',
          date: 'December 1st to 10th',
          logo: 'https://freepikpsd.com/file/2019/10/mystery-box-png-Transparent-Images.png', 
        },
        {
          subtitle: 'top 5 USDC minter',
          title: 'Ze Minters',
          date: 'December 10th to 20th',
          logo: 'https://freepikpsd.com/file/2019/10/mystery-box-png-Transparent-Images.png', 
        },
        {
          subtitle: 'top 3 UNIV2-USDC-WETH',
          title: 'Ze Providers',
          date: 'December 20th to 30th',
          logo: 'https://freepikpsd.com/file/2019/10/mystery-box-png-Transparent-Images.png', 
        }],
      }
    },

    methods: {
      decrement () {
        this.valueSubmitted = this.valueSubmitted - this.tickStep
      },
      increment () {
        this.valueSubmitted = this.valueSubmitted + this.tickStep
      },
      fakeMetamaskPrompt(){
        alert('This is a fake metamask prompt')
      }
    },
  }
</script>

<style lang="scss">
  .v-slider__track-container{
    height: 10px !important;
  }
</style>