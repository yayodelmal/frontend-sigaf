<template>
  <base-autocomplete
    :items="items"
    label="Origen"
    :value="value"
    item-value="id"
    item-text="description"
    return-object
    v-bind="$attrs"
    v-on="$listeners"
    @change="$emit('input', $event)"
    :error-messages="errors"
  ></base-autocomplete>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  inheritAttrs: false,
  name: 'SAutocompleteSourceTicket',
  props: {
    value: Object,
    errors: String
  },
  created() {
    if (this.items.length === 0) {
      this.fetchItems()
    }
  },
  methods: {
    ...mapActions({
      fetchItems: 'sourceTicket/fetchSourceTickets'
    })
  },
  computed: {
    ...mapGetters({
      items: 'sourceTicket/sourceTickets'
    })
  }
}
</script>

<style scoped></style>
