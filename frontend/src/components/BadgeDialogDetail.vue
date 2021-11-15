<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-chip
          class="text-subtitle-1 font-weight-light"
          style="overflow-y: hidden;"
          v-bind="attrs"
          v-on="on"
        >
        Details
        </v-chip>
      </template>

      <v-card shaped>
        <v-card-title class="text-h5 secondary white--text" justify="center">
          {{ nft.name }}
        </v-card-title>

        <v-card-text>
          <v-img
            :src="nft.image_url"
            width=200px
            height=200px
            style="padding-top: 5px"
            class="mx-auto my-5"
          />

          <v-spacer />
          
          <v-chip
            class="text-subtitle-1 font-weight-light black"
            style="margin: 5px"
            outlined
          >
            Description
          </v-chip>
          {{ nft.description }}

          <v-spacer />

           
          <v-chip
            class="text-subtitle-1 font-weight-light black"
            style="margin: 5px"
            outlined
          >
            Tags
          </v-chip>
          {{ nft.tags }}
          <v-spacer />

          
          <v-chip
            class="text-subtitle-1 font-weight-light black"
            style="margin: 5px"
            outlined
            v-if="nft.conditions !== undefined"
          >
            Conditions
          </v-chip>
          <v-spacer />
          {{ nft.conditions }}
          <v-spacer />

          <v-progress-linear
            v-if="$store.state.address !== '' && nft.conditions[0].current !== undefined"
            :value="getExperienceValue(nft)"
            height="20"
            class = "mr-5 my-5"
            color = "green"
          > 
            <span v-if="getExperienceValue(nft) !== 100"> {{ nft.conditions[0].current + " / " + nft.conditions[0].target }} </span>
            <span v-else> 100% </span>
          </v-progress-linear>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
  export default {
    name: 'BadgeDialogDetail',
    props: {
      nft: Object
    },
    data () {
      return {
        dialog: false,
      }
    },
    methods: {
      getTodos () {
        if (this.$store.state.address !== '') {
          const path = process.env.VUE_APP_BASE_URL + 'badges'
          axios.post(path, { wallet_address: this.$store.state.address })
            .then((res) => {
              this.todos = res.data
            })
            .catch((error) => {
              // eslint-disable-next-line
              console.error(error);
            })
        }
      },
      getExperienceValue(nft){
        if (nft.conditions !== undefined) {
          return (100 * nft.conditions[0].current/nft.conditions[0].target)
        }
      },
      fakeMetamaskPrompt(){
        alert('This is a fake metamask prompt')
      }
  }
}
</script>