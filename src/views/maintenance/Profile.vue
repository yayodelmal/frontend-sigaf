<template>
  <div>
    <base-card color="blueS" class="px-5 py-3" title="Perfil de plataforma">
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1 grayS--text"
        :loading="loading"
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
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px" persistent>
              <template v-slot:activator="{ on }">
                <base-button
                  icon="mdi-plus-circle"
                  v-on="on"
                  label="Crear perfil plataforma"
                ></base-button>
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
                          <base-textfield
                            v-model="editedItem.description"
                            label="Nombre"
                            required
                            clearable
                            @input="$v.description.$touch()"
                            @blur="$v.description.$touch()"
                            :error-messages="descriptionErrors"
                          ></base-textfield>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <base-button
                      icon="mdi-check-circle"
                      label="Guardar"
                      @click="save"
                    ></base-button>
                    <v-btn text color="grayS" @click="close">
                      <v-icon size="30" left>mdi-close-circle</v-icon>
                      Cancelar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
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
    </base-card>
    <v-snackbar color="blueS" v-model="snackbar" :timeout="timeout">
      {{ message }}
      <v-btn dark text @click="snackbar = false">
        Cerrar
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="dialogConfirm" persistent max-width="350">
      <base-card
        class="pt-12"
        color="redS"
        icon="mdi-hand-left"
        title="¡Atención!"
      >
        <v-divider></v-divider>
        <v-card-text>Eliminará un registro de forma permanente</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <base-button
            icon="mdi-check-circle"
            label="Aceptar"
            @click.prevent="confirmDelete"
          ></base-button>
          <v-btn text color="grayS" @click="close">
            <v-icon size="30" left>mdi-close-circle</v-icon>
            Cancelar</v-btn
          >
        </v-card-actions>
      </base-card>
    </v-dialog>
  </div>
</template>

<script>
import Profile from '../../models/Profile'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'

export default {
  mixins: [validationMixin],
  validations: {
    description: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(25)
    }
  },
  data: () => ({
    dialog: false,
    dialogConfirm: false,
    headers: [
      { text: '#', value: 'id', class: 'redS--text' },
      { text: 'Nombre', value: 'description', class: 'redS--text' },
      {
        text: 'Acciones',
        value: 'actions',
        class: 'redS--text',
        sortable: false
      }
    ],
    editedIndex: -1,
    editedItem: new Profile(),
    defaultItem: new Profile(),
    message: '',
    successMessage: 'Operación realizada con éxito.',
    errorMEssage: 'Ha ocurrido un error.',
    snackbar: false,
    timeout: 3000,
    loading: false
  }),
  computed: {
    ...mapGetters({ items: 'profile/profiles' }),
    descriptionErrors() {
      const errors = []

      if (!this.$v.description.$dirty) return errors
      !this.$v.description.required && errors.push('El nombre es obligatorio.')
      !this.$v.description.minLength &&
        errors.push('El nombre debe contener al menos 5 carácteres')
      !this.$v.description.maxLength &&
        errors.push('El nombre debe contener máximo 25 carácteres')
      return errors
    },
    formTitle() {
      return this.editedIndex === -1
        ? 'Crear perfil plataforma'
        : 'Editar perfil plataforma'
    },
    description() {
      return this.editedItem.description
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    ...mapActions({
      fetchItems: 'profile/fetchprofiles',
      postItem: 'profile/postprofile',
      putItem: 'profile/putprofile',
      removeItem: 'profile/deleteprofile'
    }),
    editItem(item) {
      this.editedIndex = this.items.indexOf(item)

      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async fetchData() {
      this.loading = true
      const { success, message } = await this.fetchItems()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
      this.loading = false
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogConfirm = true
    },
    async confirmDelete() {
      const { success, message } = await this.removeItem(this.editedItem)

      if (success) {
        this.snackbar = true
        this.message = this.successMessage
      } else {
        this.snackbar = true
        this.message = message
      }
      this.closeConfirmDelete()
    },
    closeConfirmDelete() {
      this.dialogConfirm = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    async save() {
      this.$v.$touch()
      if (!this.$v.$error) {
        if (this.editedIndex > -1) {
          const { success, message } = await this.putItem(this.editedItem)
          if (success) {
            this.snackbar = true
            this.message = this.successMessage
          } else {
            this.snackbar = true
            this.message = message
          }
        } else {
          const { success, message } = await this.postItem(this.editedItem)
          if (success) {
            this.snackbar = true
            this.message = this.successMessage
          } else {
            this.snackbar = true
            this.message = message
          }
        }
        this.close()
      }
    },
    close() {
      this.dialog = false
      this.dialogConfirm = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    clear() {
      this.$v.$reset()
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    }
  }
}
</script>

<style scoped></style>
