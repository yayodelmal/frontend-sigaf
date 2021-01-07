<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-hammer-wrench"
      title="Curso"
    >
      <sigaf-skeleton-loader
        v-if="loading"
        :transition="transition"
        :loading="loading"
      ></sigaf-skeleton-loader>
      <v-data-table
        :search="search"
        v-else
        :headers="headers"
        :items="coursesItems"
        :items-per-page="5"
        class="elevation-1"
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
            <v-btn depressed large color="blueS" @click="createCourse">
              <v-icon class="mr-2" size="25">mdi-plus</v-icon>
              Crear Curso
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
    </base-card>
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-form>
        <v-card :loading="loadingSave">
          <template v-slot:progress>
            <v-progress-linear color="blueS" indeterminate></v-progress-linear>
          </template>
          <v-toolbar dark color="blueS darken-1">
            <v-toolbar-title>
              {{ formTitle }}
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <base-textfield
                  v-model="editedItem.description"
                  label="Nombre"
                  @input="$v.description.$touch()"
                  @blur="$v.description.$touch()"
                  :error-messages="descriptionErrors"
                ></base-textfield>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <base-autocomplete
                  v-model="editedItem.category"
                  :items="categoriesItems"
                  label="Categoría"
                  item-value="id"
                  item-text="description"
                  return-object
                  @change="$v.category.$touch()"
                  @blur="$v.category.$touch()"
                  :error-messages="categoryErrors"
                ></base-autocomplete>
              </v-col>
              <v-col cols="4">
                <base-textfield
                  v-model="editedItem.idCourseMoodle"
                  label="Id Moodle"
                  required
                  clearable
                  @input="$v.idMoodle.$touch()"
                  @blur="$v.idMoodle.$touch()"
                  :error-messages="idMoodleErrors"
                ></base-textfield>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="close()">
              CANCELAR
            </v-btn>
            <v-btn
              :loading="loading"
              color="blueS"
              dark
              depressed
              @click="save()"
            >
              ACEPTAR
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <sigaf-snackbar v-model="snackbar" :type="type" :message="message">
    </sigaf-snackbar>
    <confirm-dialog
      icon="mdi-alert-circle"
      color-icon="warning"
      :dialog="dialogConfirm"
      :cancel="close"
      :accept="confirmDelete"
    >
      <template v-slot:content>
        <h3 class="text-body-1">Eliminará un registro de forma permanente</h3>
      </template>
    </confirm-dialog>
  </div>
</template>

<script>
import Course from '../../models/Course'
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
import SigafSnackbar from '../../components/component/Snackbar'
import { Snackbar } from '../../utils/constants'
import ConfirmDialog from '../../components/component/ConfirmCard'
import SigafSkeletonLoader from '../../components/maintenance/SigafSkeletonLoader.vue'

export default {
  inject: ['theme'],
  mixins: [validationMixin],
  components: {
    SigafSnackbar,
    ConfirmDialog,
    SigafSkeletonLoader
  },
  validations: {
    description: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(150)
    },
    category: {
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
      {
        text: 'Nombre',
        value: 'description',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'ID moodle',
        value: 'idCourseMoodle',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'Categoría',
        value: 'category.properties.description',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'Acciones',
        value: 'actions',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold'],
        sortable: false
      }
    ],
    editedIndex: -1,
    editedItem: new Course(),
    defaultItem: new Course(),
    message: '',
    snackbar: false,
    type: '',
    loading: false,
    transition: 'scale-transition',
    loadingSave: false,
    snakResponse: null,
    search: ''
  }),
  computed: {
    ...mapGetters({
      coursesItems: 'course/courses',
      categoriesItems: 'category/categories'
    }),
    descriptionErrors() {
      const errors = []

      if (!this.$v.description.$dirty) return errors
      !this.$v.description.required && errors.push('Es obligatorio.')
      !this.$v.description.minLength &&
        errors.push('Debe contener al menos 10 caracteres.')
      !this.$v.description.maxLength &&
        errors.push('Debe contener máximo 100 caracteres.')
      return errors
    },
    categoryErrors() {
      const errors = []

      if (!this.$v.category.$dirty) return errors
      !this.$v.category.required && errors.push('Es obligatorio.')

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
      return this.editedIndex === -1 ? 'Crear curso' : 'Editar curso'
    },
    description() {
      return this.editedItem.description
    },
    category() {
      return this.editedItem.category
    },
    idMoodle() {
      return this.editedItem.idCourseMoodle
    }
  },
  async created() {
    this.loading = true
    if (this.coursesItems.length === 0) {
      const { success } = await this.fetchCourseItems()
      this.loading = !success
    } else {
      this.loading = false
    }
  },
  methods: {
    ...mapActions({
      fetchCourseItems: 'course/fetchCourses',
      postItem: 'course/postCourse',
      putItem: 'course/putCourse',
      removeItem: 'course/deleteCourse',
      fetchCategoryItems: 'category/fetchCategories'
    }),
    createCourse() {
      this.getCategories()
      this.dialog = true
    },
    getCategories() {
      if (this.categoriesItems.length === 0) {
        this.fetchCategoryItems()
      }
    },
    makeSnakResponse(message, type) {
      this.snackbar = true
      this.type = type
      this.message = message
      this.loadingSave = false
    },
    responseSuccessMessage() {
      this.makeSnakResponse(Snackbar.SUCCESS.message, Snackbar.SUCCESS.type)
    },
    responseErrorMessage() {
      this.makeSnakResponse(Snackbar.ERROR.message, Snackbar.ERROR.type)
    },
    editItem(item) {
      this.getCategories()
      this.editedIndex = this.coursesItems.indexOf(item)

      this.editedItem = Object.assign({}, item)

      this.editedItem.category = Object.assign({}, item.category.properties)

      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.coursesItems.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogConfirm = true
    },
    async confirmDelete() {
      const { success } = await this.removeItem(this.editedItem)

      if (success) {
        this.responseSuccessMessage()
      } else {
        this.responseErrorMessage()
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
        this.loadingSave = true
        let dataStore = Object.assign(this.editedItem, {
          category_id: this.editedItem.category.id,
          id_course_moodle: this.editedItem.idCourseMoodle,
          status: 1
        })
        if (this.editedIndex > -1) {
          const { success } = await this.putItem(dataStore)
          if (success) {
            this.responseSuccessMessage()
          } else {
            this.responseErrorMessage()
          }
        } else {
          const { success } = await this.postItem(dataStore)
          if (success) {
            this.responseSuccessMessage()
          } else {
            this.responseErrorMessage()
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
