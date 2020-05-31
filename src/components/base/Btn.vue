<template>
  <v-btn color="blueS" text v-bind="$attrs" v-on="$listeners" class="mr-2">
    <v-icon size="30" left>{{ icon }}</v-icon>
    {{ label }}
  </v-btn>
</template>
<script>
export default {
  inheritAttrs: false,
  name: 'BaseButton',
  props: {
    icon: {
      type: String,
      default: 'mdi-alert-circle'
    },
    label: {
      type: String,
      default: 'Error'
    }
  }
}
</script>
<style lang="sass" scoped></style>
