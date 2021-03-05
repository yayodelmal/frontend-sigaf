<template>
  <base-autocomplete
    :items="items"
    :value="value"
    label="Motivo"
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
  name: 'SAutocompleteMotiveTicket',
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
      fetchItems: 'motiveTicket/fetchMotiveTickets'
    })
  },
  computed: {
    ...mapGetters({
      items: 'motiveTicket/motiveTickets'
    })
  }
}
</script>

<style scoped></style>
