<template>
  <v-footer 
    color="background"
    style="background: linear-gradient(90deg, rgba(168,144,254,1) 0%, rgba(198,143,202,1) 35%, rgba(234,141,141,1) 100%);"
    flat
    padless
    class="mt-10"
  >
    <v-col class="text-center" cols="12">
      <span> Copyright  &copy; {{ new Date().getFullYear() }} — </span>
      <img width="35px" class="px-1 mb-n1" src="../assets/etherscore_black_transparent.png">
      <strong>EtherScore</strong>
      <div class="pb-2 text-right">
        Powered By 
        <img width="30px" height="30px" class="mr-1" src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=010">
        <img width="30px" height="30px" class="mr-1" src="https://cryptologos.cc/logos/the-graph-grt-logo.png?v=010">
        <img width="30px" height="30px" class="mr-1" src="https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/e95/9bd/80-/e959bd80-e08c-4083-a467-a3c18af86913-1618465679-a07840bd3fb5bd1bfd842bf425f7a6a9f83dbab0.png">
      </div>
    </v-col>
  </v-footer>
</template>

<script>
  export default {
    name: 'AppFooter',
  }
</script>