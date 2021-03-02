<template>
  <base-autocomplete
    :items="items"
    label="Prioridad"
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
  name: 'SAutocompletePriorityTicket',

  props: {
    value: Object,
    errors: String
  },
  created() {
    this.fetchItems()
  },
  methods: {
    ...mapActions({
      fetchItems: 'priorityTicket/fetchPriorityTickets'
    })
  },
  computed: {
    ...mapGetters({
      items: 'priorityTicket/priorityTickets'
    })
  }
}
</script>

<style scoped></style>
