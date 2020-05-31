<template>
  <div>
    <base-card color="blueS" class="px-5 py-3" title="Actividades">
      <v-data-table
        :headers="headers"
        :items="filterActivitiesByCourse"
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
            <base-autocomplete
              v-model="course.id"
              :items="coursesItems"
              label="Cursos"
              item-value="id"
              item-text="description"
            >
            </base-autocomplete>
            <v-dialog v-model="dialog" max-width="500px" persistent>
              <!-- <template v-slot:activator="{ on }">
                <base-button
                  icon="mdi-plus-circle"
                  v-on="on"
                  label="Crear actividades"
                ></base-button>
              </template> -->
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
                            v-model="sectionModel"
                            :items="sectionItems"
                            label="Sección"
                            item-value="id"
                            item-text="description"
                            return-object
                            @change="$v.sectionModel.$touch()"
                            @blur="$v.sectionModel.$touch()"
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
          <!-- <v-tooltip color="blueS" bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon text v-on="on">
                <v-icon @click.prevent="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>Eliminar</span>
          </v-tooltip> -->
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
import Activity from '../../models/Activity'
import { validationMixin } from 'vuelidate'
import { required, numeric, minValue, maxValue } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'

export default {
  mixins: [validationMixin],
  validations: {
    description: {
      required
    },
    weighing: {
      required,
      numeric,
      minValue: minValue(0),
      maxValue: maxValue(100)
    },
    sectionModel: {
      required
    }
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
    courses: [],
    course: {
      id: 0
    },
    sectionModel: null
  }),
  computed: {
    ...mapGetters({
      activitiesItems: 'activity/activities',
      coursesItems: 'course/courses',
      sectionItems: 'section/sections'
    }),
    filterActivitiesByCourse() {
      return this.activitiesItems.filter(activity => {
        return activity.course.id === this.course.id
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

      if (!this.$v.sectionModel.$dirty) return errors
      !this.$v.sectionModel.required && errors.push('Es obligatorio.')

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
    }
  },
  created() {
    this.fetchDataActivities()
    this.fetchDataCourses()
    this.fetchDataSections()
  },
  methods: {
    ...mapActions({
      fetchActivityItems: 'activity/fetchActivities',
      fetchCourseItems: 'course/fetchCourses',
      fetchSectionItems: 'section/fetchSections',
      putItem: 'activity/putActivity'
    }),
    editItem(item) {
      this.editedIndex = this.filterActivitiesByCourse.indexOf(item)

      this.editedItem = Object.assign({}, item)
      this.dialog = true
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
        this.editedItem.section = { ...this.sectionModel }
        const { success, message } = await this.putItem(this.editedItem)
        if (success) {
          this.snackbar = true
          this.message = this.successMessage
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
