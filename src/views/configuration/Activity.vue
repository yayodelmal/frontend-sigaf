<template>
  <div>
    <base-card color="blueS" class="px-5 py-3" title="Actividades">
      <v-card flat outlined>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-btn
                dark
                depressed
                color="blueS"
                @click="syncActivities"
                class="py-5"
                icon
              >
                <v-icon size="30">mdi-sync</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="8" lg="8">
              <base-autocomplete
                v-model="category"
                :items="categoryItems"
                label="Categoría"
                item-value="id"
                item-text="description"
                return-object
              >
              </base-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-data-table
        :headers="headers"
        :items="activitiesFiltered"
        class="elevation-1 grayS--text mt-3"
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
import Activity from '../../models/Activity'
import { validationMixin } from 'vuelidate'
import { required, numeric, minValue, maxValue } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import axios from '../../services/axios'

export default {
  mixins: [validationMixin],
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
      { text: '#', value: 'id', class: 'redS--text' },
      { text: 'Nombre', value: 'description', class: 'redS--text' },
      { text: 'Ponderación', value: 'weighing', class: 'redS--text' },
      { text: 'Sección', value: 'section.description', class: 'redS--text' },
      {
        text: 'Acciones',
        value: 'actions',
        class: 'redS--text',
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
    sectionModel: null
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
    syncActivities() {
      if (this.category !== null) {
        this.coursesByCategory.forEach(async course => {
          if (course.properties.idCourseMoodle) {
            await axios.get(
              `api/v2/sync/course/${course.properties.idCourseMoodle}/activities`
            )
          }
        })

        this.filterActivitiesByCategories()
      }
    },
    editItem(item) {
      this.editedIndex = this.activitiesFiltered.indexOf(item)

      this.editedItem = Object.assign({}, item)

      this.dialog = true
    },
    async filterActivitiesByCategories() {
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
      this.loading = true
      const { success, message } = await this.fetchCategoryItems()
      console.log()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
      this.loading = false
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
        const { success, message } = await this.putItem(this.editedItem)
        if (success) {
          this.snackbar = true
          this.message = this.successMessage
          this.filterActivitiesByCategories()
        } else {
          this.snackbar = true
          this.message = message
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
