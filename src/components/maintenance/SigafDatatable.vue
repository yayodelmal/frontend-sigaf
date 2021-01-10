<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="items"
    :items-per-page="itemsPerPage"
    :loading="loading"
    class="elevation-1"
    loading-text="Cargando... por favor espere"
  >
    <template v-slot:progress>
      <v-progress-linear
        color="blueS"
        :height="3"
        indeterminate
      ></v-progress-linear>
    </template>
    <template v-slot:top>
      <v-toolbar tile dark color="blueS darken-1" class="mb-1">
        <v-text-field
          v-model="search"
          color="blueS"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Buscar"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn depressed large color="blueS" @click="createItem">
          <v-icon class="mr-2" size="25">mdi-plus</v-icon>
          {{ buttonName }}
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-tooltip color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon text v-on="on">
            <v-icon @click.prevent="editItem(item)">
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <span>Editar</span>
      </v-tooltip>
      <v-tooltip color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon text v-on="on">
            <v-icon @click.prevent="deleteItem(item)">
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <span>Eliminar</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    items: Array,
    headers: Array,
    itemsPerPage: Number,
    loading: Boolean,
    buttonName: String
  },
  data: () => ({
    search: ''
  }),
  methods: {
    createItem() {
      this.$emit('createItem')
    },
    editItem(item) {
      this.$emit('editItem', item)
    },
    deleteItem(item) {
      this.$emit('deleteItem', item)
    }
  }
}
</script>

<style scoped></style>
