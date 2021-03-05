<template>
  <v-toolbar dark color="blueS darken-1" class="mb-1">
    <v-row>
      <v-col cols="4" sm="4" md="4">
        <slot name="left"></slot>
      </v-col>
      <v-col cols="4" sm="5" md="6">
        <slot name="center"></slot>
      </v-col>
      <v-col class="d-flex" cols="4" sm="3" md="2">
        <slot name="right"></slot>
      </v-col>
    </v-row>
  </v-toolbar>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped></style>
