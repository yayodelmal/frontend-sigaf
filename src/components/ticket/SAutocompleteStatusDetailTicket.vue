<template>
  <base-autocomplete
    :items="items"
    label="Intento de contacto"
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
  name: 'SAutocompleteStatusDetailTicket',
  props: {
    value: Object,
    errors: String
  },
  created() {
    this.fetchItems()
  },
  methods: {
    ...mapActions({
      fetchItems: 'statusDetailTicket/fetchStatusDetailTickets'
    })
  },
  computed: {
    ...mapGetters({
      items: 'statusDetailTicket/statusDetailTickets'
    })
  }
}
</script>

<style scoped></style>
