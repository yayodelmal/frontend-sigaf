<template>
  <v-alert
    :value="true"
    @input="$emit('input', $event)"
    dismissible
    color="cyan"
    border="left"
    elevation="2"
    colored-border
    icon="mdi-twitter"
    transition="scale-transition"
  >
    You've got <strong>5</strong> new updates on your timeline!.
  </v-alert>
</template>

<script>
export default {
  name: 'BaseAlert',
  props: {
    value: Boolean
  }
}
</script>

<style lang="scss" scoped></style>
