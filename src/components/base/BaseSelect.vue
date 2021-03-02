<template>
  <v-select
    :value="value"
    @input="$emit('input', $event)"
    :items="items"
    :label="label"
    item-value="id"
    item-text="description"
    :color="color"
    flat
    solo-inverted
    hide-details
    return-object
    :prepend-inner-icon="prependIcon"
  >
  </v-select>
</template>

<script>
export default {
  name: 'BaseSelectComponent',
  props: {
    value: Object,
    items: {
      type: Array,
      default: () => [{ id: 1, description: 'description1' }]
    },
    label: {
      type: String,
      default: () => 'Sin etiqueta'
    },
    color: {
      type: String,
      default: () => 'blueS'
    },
    prependIcon: {
      type: String,
      default: () => 'mdi-filter-outline'
    }
  }
}
</script>

<style lang="scss" scoped></style>
