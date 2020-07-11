<template>
  <div>
    <base-card color="blueS" class="px-5 py-3" title="Usuario"> </base-card>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :items-per-page="5"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped></style>
