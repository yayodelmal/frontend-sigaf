<template>
  <v-autocomplete
    color="blueS"
    dense
    outlined
    v-bind="$attrs"
    v-on="$listeners"
  ></v-autocomplete>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BaseAutocomplete'
}
</script>
