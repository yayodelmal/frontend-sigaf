<template>
  <v-btn color="blueS" text v-bind="$attrs" v-on="$listeners" class="mr-2">
    <v-icon size="30" left>{{ icon }}</v-icon>
    {{ label }}
  </v-btn>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    icon: {
      type: String,
      default: undefined
    },
    label: {
      type: String,
      default: undefined
    }
  }
}
</script>
<style lang="sass" scoped></style>
