<template>
  <div>
    <base-card color="blueS" class="px-5 py-3" title="Categoría de curso">
      <v-data-table
        :headers="headers"
        :items="categoriesItems"
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
                  label="Crear categoría"
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
                      <v-row>
                        <v-col cols="8">
                          <base-autocomplete
                            v-model="platformModel"
                            :items="platformsItems"
                            label="Plataforma"
                            item-value="id"
                            item-text="description"
                            return-object
                            @change="setPlatform($event)"
                            @blur="$v.platformModel.$touch()"
                            :error-messages="platformErrors"
                          >
                          </base-autocomplete>
                        </v-col>
                        <v-col cols="4">
                          <base-textfield
                            v-model="editedItem.idMoodle"
                            label="Id Moodle"
                            required
                            clearable
                            @input="$v.idMoodle.$touch()"
                            @blur="$v.idMoodle.$touch()"
                            :error-messages="idMoodleErrors"
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
import Category from '../../models/Category'
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  maxLength,
  numeric,
  minValue,
  maxValue
} from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'

export default {
  mixins: [validationMixin],
  validations: {
    description: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(150)
    },
    platformModel: {
      required
    },
    idMoodle: {
      numeric,
      minValue: minValue(100),
      maxValue: maxValue(999999)
    }
  },
  data: () => ({
    dialog: false,
    dialogConfirm: false,
    headers: [
      { text: '#', value: 'id', class: 'redS--text' },
      { text: 'Nombre', value: 'description', class: 'redS--text' },
      {
        text: 'Plataforma',
        value: 'platform.description',
        class: 'redS--text'
      },
      {
        text: 'Acciones',
        value: 'actions',
        class: 'redS--text',
        sortable: false
      }
    ],
    editedIndex: -1,
    editedItem: new Category(),
    defaultItem: new Category(),
    message: '',
    successMessage: 'Operación realizada con éxito.',
    errorMEssage: 'Ha ocurrido un error.',
    snackbar: false,
    timeout: 3000,
    loading: false,
    platformModel: null
  }),
  computed: {
    ...mapGetters({
      categoriesItems: 'category/categories',
      platformsItems: 'platform/platforms'
    }),
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
    platformErrors() {
      const errors = []

      if (!this.$v.platformModel.$dirty) return errors
      !this.$v.platformModel.required && errors.push('Es obligatorio.')

      return errors
    },
    idMoodleErrors() {
      const errors = []

      if (!this.$v.idMoodle.$dirty) return errors
      !this.$v.idMoodle.numeric && errors.push('Debe ser un número válido.')
      !this.$v.idMoodle.minValue &&
        errors.push('Debe contener al menos 3 cifras.')
      !this.$v.idMoodle.maxValue &&
        errors.push('Debe contener máximo 6 cifras.')
      return errors
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Crear categoría' : 'Editar categoría'
    },
    description() {
      return this.editedItem.description
    },
    idMoodle() {
      return this.editedItem.idMoodle
    }
  },
  created() {
    this.fetchDataCategories(), this.fetchDataPlatforms()
  },
  methods: {
    ...mapActions({
      fetchCategoryItems: 'category/fetchCategories',
      postItem: 'category/postCategory',
      putItem: 'category/putCategory',
      removeItem: 'category/deleteCategory',
      fetchPlatformItems: 'platform/fetchPlatforms'
    }),
    setPlatform(value) {
      console.log(value)
      this.editedItem.platform = value
      this.$v.platformModel.$touch()
    },
    editItem(item) {
      //this.platform = item.platform

      this.editedIndex = this.categoriesItems.indexOf(item)

      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async fetchDataCategories() {
      this.loading = true
      const { success, message } = await this.fetchCategoryItems()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
      this.loading = false
    },
    async fetchDataPlatforms() {
      this.loading = true
      const { success, message } = await this.fetchPlatformItems()
      console.log()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
      this.loading = false
    },
    deleteItem(item) {
      this.editedIndex = this.categoriesItems.indexOf(item)
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
        let dataStore = Object.assign(this.editedItem, {
          platform_id: this.editedItem.platform.id,
          status: 1
        })
        if (this.editedIndex > -1) {
          const { success, message } = await this.putItem(dataStore)
          if (success) {
            this.snackbar = true
            this.message = this.successMessage
          } else {
            this.snackbar = true
            this.message = message
          }
        } else {
          const { success, message } = await this.postItem(dataStore)
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
      this.platformModel = null
      this.editedIndex = -1
    }
  }
}
</script>

<style scoped></style>
