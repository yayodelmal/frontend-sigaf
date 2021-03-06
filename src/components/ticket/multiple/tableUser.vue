<template>
  <v-data-table
    :value="value"
    @input="$emit('input', $event)"
    :headers="headersTicket"
    :items="items"
    item-key="id"
    show-select
    class="elevation-0"
    :search="search"
    disable-pagination
    hide-default-footer
    fixed-header
    height="350px"
  >
    <template v-slot:header.data-table-select="{ props, on }">
      <v-simple-checkbox
        color="blueS"
        v-bind="props"
        v-on="on"
      ></v-simple-checkbox>
    </template>
    <template v-slot:item.data-table-select="{ isSelected, select }">
      <v-simple-checkbox
        color="blueS"
        :value="isSelected"
        @input="select($event)"
      ></v-simple-checkbox>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    items: Array,
    search: String,
    value: Array
  },
  data: () => ({
    headersTicket: [
      {
        text: 'RUT',
        value: 'registered_user.rut',
        class: 'redS--text'
      },
      {
        text: 'Nombre',
        value: 'registered_user.name',
        class: 'redS--text'
      },
      {
        text: 'Apellido paterno',
        value: 'registered_user.last_name',
        class: 'redS--text'
      },
      {
        text: 'Apellido materno',
        value: 'registered_user.mother_last_name',
        class: 'redS--text'
      },
      {
        text: 'Aula',
        value: 'classroom.description',
        class: 'redS--text'
      },
      {
        text: 'Última conexión',
        value: 'last_access_registered_moodle',
        class: 'redS--text'
      }
    ]
  })
}
</script>
