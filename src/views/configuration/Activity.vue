<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-hammer-wrench"
      title="Actividades"
    >
      <v-card flat>
        <v-card-title>
          Seleccione:
        </v-card-title>
        <v-card-text>
          <v-toolbar dark color="blueS darken-1" class="mb-1">
            <v-select
              v-model="category"
              :items="categoryItems"
              label="Categoría"
              item-value="id"
              item-text="description"
              return-object
              flat
              color="blueS"
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-filter-outline"
              :loading="loadingActivities"
            ></v-select>

            <template v-if="$vuetify.breakpoint.mdAndUp">
              <v-spacer></v-spacer>
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
            </template>
            <template v-if="category !== null">
              <v-spacer />
              <v-btn large dark depressed color="blueS" @click="syncActivities">
                <v-icon size="25" class="mr-3">mdi-sync</v-icon> Actividades
              </v-btn>
            </template>
          </v-toolbar>
        </v-card-text>
      </v-card>
      <v-data-table
        :headers="headers"
        :items="activitiesFiltered"
        class="elevation-1 grayS--text mt-3"
        :loading="loading"
        loading-text="Cargando... por favor espere"
        :search="search"
      >
        <template v-slot:progress>
          <v-progress-linear
            color="blueS"
            :height="3"
            indeterminate
          ></v-progress-linear>
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
            <v-container>
              <v-row>
                <v-col cols="12">
                  <base-textfield
                    v-model="editedItem.description"
                    label="Nombre"
                    required
                    readonly
                    @input="$v.description.$touch()"
                    @blur="$v.description.$touch()"
                    :error-messages="descriptionErrors"
                  ></base-textfield>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <base-textfield
                    v-model="editedItem.weighing"
                    label="Ponderación (%)"
                    required
                    clearable
                    @input="$v.weighing.$touch()"
                    @blur="$v.weighing.$touch()"
                    :error-messages="weighingErrors"
                  ></base-textfield>
                </v-col>
                <v-col cols="8">
                  <base-autocomplete
                    v-model="editedItem.section"
                    :items="sectionItems"
                    label="Sección"
                    item-value="id"
                    item-text="description"
                    return-object
                    @change="$v.section.$touch()"
                    @blur="$v.section.$touch()"
                    :error-messages="sectionErrors"
                  >
                  </base-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="close">
              CANCELAR
            </v-btn>
            <v-btn
              :loading="loading"
              color="blueS"
              dark
              depressed
              @click="save"
            >
              ACEPTAR
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <snackbar-component v-model="snackbar" :type="type" :message="message">
    </snackbar-component>
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
    <v-overlay :value="overlay" color="grayS" :opacity="opacity">
      <div class="text-center">
        <v-progress-circular indeterminate size="64"> </v-progress-circular>
      </div>
      <h3 class="headline text-center mt-5">
        Sincronizando...
      </h3>
    </v-overlay>
  </div>
</template>

<script>
import Activity from '../../models/Activity'
import { validationMixin } from 'vuelidate'
import { required, numeric, minValue, maxValue } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import axios from '../../services/axios'

import SnackbarComponent from '../../components/component/Snackbar'

import { Snackbar } from '../../utils/constants'

export default {
  mixins: [validationMixin],
  components: {
    SnackbarComponent
  },
  validations: {
    description: { required },
    weighing: {
      required,
      numeric,
      minValue: minValue(0),
      maxValue: maxValue(100)
    },
    section: { required }
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
        text: 'Ponderación',
        value: 'weighing',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'Sección',
        value: 'section.description',
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
    editedItem: new Activity(),
    defaultItem: new Activity(),
    message: '',
    successMessage: 'Operación realizada con éxito.',
    errorMEssage: 'Ha ocurrido un error.',
    snackbar: false,
    timeout: 3000,
    loading: false,
    activitiesFiltered: [],
    category: null,
    sectionModel: null,
    search: '',
    loadingActivities: false,
    overlay: false,
    opacity: 0.8,
    type: '',
    loadingSave: false
  }),
  watch: {
    category() {
      if (this.category !== null) {
        this.filterActivitiesByCategories()
      }
    }
  },
  computed: {
    ...mapGetters({
      activitiesItems: 'activity/activities',
      coursesItems: 'course/courses',
      coursesByCategory: 'course/coursesByCategory',
      sectionItems: 'section/sections',
      categoryItems: 'category/categories'
    }),
    activitiesByCategory() {
      if (this.category === null) return []

      return this.activitiesItems.filter(activity => {
        activity.course.id === this.courses[0].id
      })
    },
    descriptionErrors() {
      const errors = []

      if (!this.$v.description.$dirty) return errors
      !this.$v.description.required && errors.push('El nombre es obligatorio.')
      return errors
    },
    weighingErrors() {
      const errors = []

      if (!this.$v.weighing.$dirty) return errors
      !this.$v.weighing.required && errors.push('Es obligatorio.')
      !this.$v.weighing.numeric && errors.push('Debe ser un número válido.')
      !this.$v.weighing.minValue && errors.push('Debe ser mayor que 0%.')
      !this.$v.weighing.maxValue && errors.push('Debe ser menor que 100%.')
      return errors
    },
    sectionErrors() {
      const errors = []

      if (!this.$v.section.$dirty) return errors
      !this.$v.section.required && errors.push('Es obligatorio.')

      return errors
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Crear actividad' : 'Editar actividad'
    },
    description() {
      return this.editedItem.description
    },
    weighing() {
      return this.editedItem.weighing
    },
    section() {
      return this.editedItem.section
    }
  },
  created() {
    this.fetchDataActivities()
    this.fetchDataCourses()
    this.fetchDataSections()
    this.fetchDataCategories()
  },
  methods: {
    ...mapActions({
      fetchActivityItems: 'activity/fetchActivities',
      fetchCourseItems: 'course/fetchCourses',
      fetchCourseByCategory: 'course/getCoursesByCategory',
      fetchSectionItems: 'section/fetchSections',
      fetchCategoryItems: 'category/fetchCategories',
      putItem: 'activity/putActivity'
    }),
    makeSnakResponse(message, type) {
      this.snackbar = true
      this.type = type
      this.message = message
      this.loadingSave = false
      this.loadingButton = false
    },
    responseSuccessMessage() {
      this.makeSnakResponse(Snackbar.SUCCESS.message, Snackbar.SUCCESS.type)
    },
    responseErrorMessage() {
      this.makeSnakResponse(Snackbar.ERROR.message, Snackbar.ERROR.type)
    },

    syncActivities() {
      if (this.category !== null) {
        this.overlay = true
        this.coursesByCategory.forEach(async course => {
          if (course.properties.idCourseMoodle) {
            await axios.get(
              `api/v2/sync/course/${course.properties.idCourseMoodle}/activities`
            )
            this.overlay = false
          }
        })
      } else {
        const message = 'Seleccione un curso.'
        this.makeSnakResponse(message, Snackbar.WARNING.type)
      }
    },
    editItem(item) {
      this.editedIndex = this.activitiesFiltered.indexOf(item)

      this.editedItem = Object.assign({}, item)

      this.dialog = true
    },
    async filterActivitiesByCategories() {
      this.loadingActivities = true
      this.activitiesFiltered = []
      if (this.category !== null) {
        await this.fetchCourseByCategory(this.category.courses.href)

        this.coursesByCategory.forEach(course => {
          this.activitiesItems.forEach(activity => {
            if (activity.course.id === course.properties.id) {
              this.activitiesFiltered.push(activity)
            }
          })
        })

        this.loadingActivities = false
      }
    },
    async fetchDataActivities() {
      this.loading = true
      const { success, message } = await this.fetchActivityItems()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
      this.loading = false
    },
    async fetchDataCourses() {
      this.loading = true
      const { success, message } = await this.fetchCourseItems()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
      this.loading = false
    },
    async fetchDataCategories() {
      const { success, message } = await this.fetchCategoryItems()

      if (!success) {
        this.snackbar = true
        this.message = message
      }
    },
    async fetchDataSections() {
      this.loading = true
      const { success, message } = await this.fetchSectionItems()
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
    async save() {
      this.$v.$touch()
      if (!this.$v.$error) {
        const { success } = await this.putItem(this.editedItem)
        if (success) {
          Object.assign(
            this.activitiesFiltered[this.editedIndex],
            this.editedItem
          )

          this.responseSuccessMessage()
          // this.filterActivitiesByCategories()
        } else {
          this.responseErrorMessage()
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
      console.log(this.defaultItem)
      this.$v.$reset()
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      this.sectionModel = null
    }
  }
}
</script>

<style scoped></style>
