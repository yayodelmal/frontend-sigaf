<template>
  <v-toolbar dark color="blueS darken-1" class="mb-1">
    <slot name="left"></slot>
    <v-spacer />
    <slot name="center"></slot>
    <v-spacer />
    <slot name="right"></slot>
  </v-toolbar>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped></style>
