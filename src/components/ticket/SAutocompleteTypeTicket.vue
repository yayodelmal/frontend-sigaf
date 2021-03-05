<template>
  <base-autocomplete
    :items="items"
    label="Tipo"
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
  name: 'SAutocompleteTypeTicket',
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
      fetchItems: 'typeTicket/fetchTypeTickets'
    })
  },
  computed: {
    ...mapGetters({
      items: 'typeTicket/typeTickets'
    })
  }
}
</script>

<style scoped></style>
