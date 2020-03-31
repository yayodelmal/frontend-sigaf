<template>
  <div>
    <h1>Mantenedor Classroom</h1>
    <v-data-table
      :headers="headers"
      :items="classroomsDataTable"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on"
                >New Item</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.description"
                        label="Nombre"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ successMessage }}
      <v-btn color="blue" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  data: () => ({
    dialog: false,
    headers: [
      { text: '#', value: 'id' },
      { text: 'Nombre', value: 'description' },
      { text: 'Actions', value: 'actions', sortable: false }
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
    successMessage: 'Operación realizada con éxito.',
    errorMEssage: 'Ha ocurrido un error.',
    snackbar: false,
    timeout: 3000
  }),

  computed: {
    ...mapState(['classrooms', 'success', 'error']),
    ...mapGetters(['classroomsDataTable']),
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  created() {
    this.fetchClassrooms()
  },

  methods: {
    ...mapActions(['fetchClassrooms', 'postClassroom']),
    editItem(item) {
      this.editedIndex = this.classrooms.findIndex(
        found => found.id === item.id
      )
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.classrooms.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        this.classrooms.splice(index, 1)
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        this.$store.dispatch('putClassroom', this.editedItem)

        if (this.success) {
          this.snackbar = true
          this.$store.dispatch('resetCheckout', null)
        } else {
          console.log(this.error)
        }
      } else {
        this.postClassroom(this.editedItem).then(({ ({data, success, error}), error }) => {
          console.log(data)
          console.log(error)
          if (data !== undefined) {
            console.log(data)
            this.snackbar = true

            this.$store.dispatch('resetCheckout', null)
          } else {
            console.log(error.message)
          }
        })
      }

      this.close()
    }
  }
}
</script>

<style scoped></style>
