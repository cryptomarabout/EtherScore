<template>
  <v-chip
    v-if="this.$store.state.address === ''"
    color="red"
    class="text-subtitle-1 font-weight-light mb-1 pa-5"
  >
    Metamask not connected
  </v-chip>
  <v-chip
    v-else
    color="green"
    class="text-subtitle-1 font-weight-light mb-1 pa-5"
  >
    Metamask connected
  </v-chip>
</template>

<script>
export default {
  name: "MetmamaskChip",
};
</script>