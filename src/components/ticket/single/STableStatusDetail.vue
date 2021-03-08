<template>
  <v-simple-table fixed-header height="180">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">
            Intento
          </th>
          <th style="width: 300px;" class="text-left">
            Observación
          </th>
          <th class="text-left" style="min-width:120px;">
            Fecha
          </th>
          <th class="text-left">
            Operador responsable
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in ticketDetails" :key="item.properties.id">
          <td>{{ index + 1 }}</td>
          <td :class="styleDescription(item.properties)">
            {{ item.properties.statusDetailTicket.description }}
          </td>
          <td>
            {{ item.properties.comment }}
          </td>
          <td>
            {{ item.properties.createdAt }}
          </td>
          <td>
            {{ item.properties.userCreated.name }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: 'STableStatusDetail',
  props: {
    ticketDetails: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    styleDescription(item) {
      if (item.statusDetailTicket.description === 'Fallido') return 'redS--text'
      return 'success--text'
    }
  }
}
</script>

<style lang="scss" scoped></style>
