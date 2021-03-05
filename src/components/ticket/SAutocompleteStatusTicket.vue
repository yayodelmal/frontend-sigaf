<template>
  <base-autocomplete
    :items="items"
    label="Estado"
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
  name: 'SAutocompleteStatusTicket',

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
      fetchItems: 'statusTicket/fetchStatusTickets'
    })
  },
  computed: {
    ...mapGetters({
      items: 'statusTicket/statusTickets'
    })
  }
}
</script>

<style scoped></style>
