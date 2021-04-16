<template>
  <base-autocomplete
    :items="filterOperator"
    label="Operador"
    :value="value"
    item-value="id"
    item-text="name"
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
  name: 'SAutocompleteOperatorTicket',

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
      fetchItems: 'user/fetchUsers'
    })
  },
  computed: {
    ...mapGetters({
      items: 'user/users'
    }),
    filterOperator() {
      return this.items.filter(item => {
        return item.id !== 2
      })
    }
  }
}
</script>

<style scoped></style>
