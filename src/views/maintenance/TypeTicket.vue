<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="typeTicketDataTable"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Lista de tipos de ticket</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px" persistent>
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on"
                >Crear registro</v-btn
              >
            </template>
            <v-form>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.description"
                          label="Nombre"
                          :rules="[rules.required, rules.counter]"
                          required
                          counter
                          maxlength="7"
                          autofocus
                          clearable
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close"
                    >Cancelar</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="save"
                    >Guardar</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click.prevent="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click.prevent="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ message }}
      <v-btn color="blue" text @click="snackbar = false">
        Cerrar
      </v-btn>
    </v-snackbar>

    <v-row justify="center">
      <v-dialog v-model="dialogConfirm" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">¿Está seguro?</v-card-title>
          <v-card-text>Eliminará un registro de forma permanente</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogConfirm = false"
              >Cancelar</v-btn
            >
            <v-btn color="blue darken-1" text @click.prevent="confirmDelete"
              >Aceptar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'veux'
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    dialog: false,
    dialogConfirm: false,
    headers: [
      { text: '#', value: 'id' },
      { text: 'Nombre', value: 'description' },
      { text: 'Acciones', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      id: '',
      description: ''
    },
    defaultItem: {
      id: '',
      description: ''
    },
    message: '',
    successMessage: 'Operación realizada con éxito.',
    errorMEssage: 'Ha ocurrido un error.',
    snackbar: false,
    timeout: 3000,
    rules: {
      required: value => !!value || 'Requerido.',
      counter: value =>
        value !== null ? value.length > 6 || 'Mínimo 7 caracteres.' : '',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      }
    }
  }),
  computed: {
    ...mapGetters('typeTicketDataTable')
  },
  created() {},
  methods: {
    ...mapActions([
      'fetchTypeTickets',
      'postTypeTicket',
      'putTypeTicket',
      'deleteTypeTicket'
    ]),
    editItem(item) {
      this.editedIndex = this.typeTicketDataTable.indexOf(item)

      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async fetchData() {
      const { success, error } = await this.fetchTypeTickets()
      if (!success) {
        this.snackbar = true
        this.message = error
      }
    },
    deleteItem(item) {
      this.editedIndex = this.typeTicketDataTable.indexOf(item)
      this.editedItem = Object.assign({}, item)

      this.dialogConfirm = true
    },
    async confirmDelete() {
      const { success, error } = await this.deleteTypeTicket(this.editedItem)
      if (success) {
        this.snackbar = true
        this.message = this.successMessage
      } else {
        this.snackbar = true
        this.message = error
      }
      this.closeConfirmDelete()
    },
    closeConfirmDelete() {
      this.dialogConfirm = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    async save() {
      if (this.validate()) {
        if (this.editedIndex > -1) {
          const { success, error } = await this.putTypeTicket(this.editedItem)
          if (success) {
            this.snackbar = true
            this.message = this.successMessage
          } else {
            this.snackbar = true
            this.message = error
            console.log(error)
          }
        } else {
          const { success, error } = await this.postTypeTicket(this.editedItem)
          if (success) {
            this.snackbar = true
            this.message = this.successMessage
          } else {
            console.log(error)
            this.snackbar = true
            this.message = error
          }
        }
        this.close()
      }
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    validate() {
      if (this.editedItem.description !== null) {
        return this.editedItem.description.length > 6
      }
    }
  }
}
</script>

<style scoped></style>
