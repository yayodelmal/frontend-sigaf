<template>
  <v-textarea
    color="blueS"
    rows="1"
    dense
    outlined
    auto-grow
    counter
    clearable
    @input="$emit('input', $event)"
    :value="value"
    v-bind="$attrs"
    v-on="$listeners"
    :error-messages="errors"
  ></v-textarea>
</template>
<script>
export default {
  inheritAttrs: false,
  name: 'BaseTextarea',
  props: {
    value: String,
    errors: String
  }
}
</script>
