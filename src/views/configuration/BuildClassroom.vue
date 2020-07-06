<template>
  <base-card color="blueS" class="px-5 py-3 mt-5" title="Conformación de aulas">
    <v-row>
      <v-spacer />
      <base-button
        class="mb-5"
        icon="mdi-file-excel"
        label="Descargar"
        @click="downloadExcel"
      ></base-button>
    </v-row>

    <template>
      <v-stepper alt-labels non-linear v-model="e1">
        <v-stepper-header>
          <v-stepper-step
            :color="!completeStepOne ? 'redS' : 'green'"
            dark
            :complete="completeStepOne"
            :rules="[() => rulesValueStepOne]"
            step="1"
          >
            Curso</v-stepper-step
          >
          <v-divider></v-divider>
          <v-stepper-step
            :color="!completeStepTwo ? 'redS' : 'green'"
            dark
            :complete="completeStepTwo"
            :rules="[() => rulesValueStepTwo]"
            step="2"
          >
            Selección
            <small v-if="selectionHasError"
              >Seleccione un usuario</small
            ></v-stepper-step
          >
          <v-divider></v-divider>
          <v-stepper-step
            :color="!completeStepThree ? 'redS' : 'green'"
            dark
            :complete="completeStepThree"
            :rules="[() => rulesValueStepThree]"
            step="3"
            >Aula</v-stepper-step
          >
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card flat outlined>
              <v-card-title>
                Seleccione un curso:
              </v-card-title>
              <v-card-text>
                <base-autocomplete
                  v-model="courseModel"
                  :items="courseItems"
                  label="Curso"
                  item-value="id"
                  item-text="description"
                  return-object
                  @change="$v.courseModel.$touch()"
                  @blur="$v.courseModel.$touch()"
                  :error-messages="courseErrors"
                >
                </base-autocomplete>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <base-button
                  :disabled="courseModel === null"
                  icon="mdi-package-down"
                  label="Continuar con seleccion"
                  @click="getStudents"
                  :loading="loadingButton"
                ></base-button>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-card flat outlined>
              <v-card-title>
                Filtros:
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="11" md="6" sm="11" lg="6" class="mx-3">
                    <v-row>
                      <v-col cols="8" md="8" sm="12">
                        <base-autocomplete
                          v-if="regions"
                          v-model="regionModel"
                          :items="regions"
                          label="Región"
                          item-value="id"
                          item-text="description"
                          return-object
                          @change="$vuetify.goTo(target, options)"
                        >
                        </base-autocomplete>
                      </v-col>
                      <v-col cols="4" md="4" sm="12">
                        <base-textfield
                          label="Buscar"
                          required
                          clearable
                          v-model="searchStudent"
                        ></base-textfield>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="5" sm="12" lg="5">
                    <v-row justify="space-around">
                      <v-row>
                        <v-checkbox
                          v-for="profile in profiles"
                          :key="profile.id"
                          :label="profile.description"
                          v-model="selectedFilter"
                          color="redS"
                          :value="profile"
                          multiple
                          class="ml-10"
                        >
                        </v-checkbox>
                      </v-row>
                      <v-row>
                        <v-btn
                          dark
                          color="blueS"
                          class="mt-3"
                          @click="clearFilter"
                          ><v-icon class="mr-3">mdi-close</v-icon> Limpiar
                        </v-btn>
                      </v-row>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card flat outlined class="my-3">
              <v-card-title>
                Seleccione usuarios:
                <v-spacer />
                <span class="ml-10 blueS--text"
                  >{{ selected.length }} seleccionados</span
                >
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="filteredUserByCourse"
                  v-model="selected"
                  :loading="loading"
                  loading-text="Cargando... por favor espere"
                  show-select
                  hide-default-footer
                  calculate-widths
                  :search="searchStudent"
                >
                  <template v-slot:progress>
                    <v-progress-linear
                      color="blueS"
                      :height="3"
                      indeterminate
                    ></v-progress-linear>
                  </template>
                  <template v-slot:top="{ pagination, options, updateOptions }">
                    <v-data-footer
                      :items-per-page-options="[10, 15, 20, 25, 30, -1]"
                      :pagination="pagination"
                      :options="options"
                      @update:options="updateOptions"
                      items-per-page-text="$vuetify.dataTable.itemsPerPageText"
                    />
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
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text color="grayS" @click="backToCourse">
                  <v-icon size="30" left>mdi-arrow-left-bold-circle</v-icon>
                  VOLVER A CURSO</v-btn
                >
                <base-button
                  @click="checkStepTwo"
                  icon="mdi-arrow-right-bold-circle"
                  label="Continuar con aula"
                ></base-button>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card flat outlined>
              <v-card-title>
                Seleccionar aula:
              </v-card-title>
              <v-card-text>
                <v-row class="mx-3">
                  <base-autocomplete
                    v-if="regions"
                    v-model="classroomModel"
                    :items="classrooms"
                    label="Aula"
                    item-value="id"
                    item-text="description"
                    return-object
                  >
                  </base-autocomplete>
                  <v-spacer />
                  <base-button
                    icon="mdi-check-circle"
                    label="Conformar aula"
                    @click="makeClassroom"
                  ></base-button>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text color="grayS" @click="e1 = 2">
                  <v-icon size="30" left>mdi-arrow-left-bold-circle</v-icon>
                  VOLVER A SELECCION</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <v-snackbar :color="colorSnackbar" v-model="snackbar" :timeout="timeout">
      {{ message }}
      <v-btn dark text @click="snackbar = false">
        Cerrar
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-form>
        <v-card>
          <v-card-title>
            <span class="headline">Modificar</span>
          </v-card-title>
          <v-card-text>
            <base-autocomplete
              v-if="regions"
              v-model="editClassroomModel"
              :items="classrooms"
              label="Aula"
              item-value="id"
              item-text="description"
              return-object
              @change="setEditClassroom"
              @blur="$v.editClassroom.$touch()"
              :error-messages="editClassroomErrors"
            >
            </base-autocomplete>

            <base-autocomplete
              v-if="regions"
              v-model="profileModel"
              :items="profiles"
              label="Tipo usuario moodle"
              item-value="id"
              item-text="description"
              return-object
            >
            </base-autocomplete>
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
  </base-card>
</template>

<script>
import axios from '../../services/axios'
import CourseRegisteredUser from '../../models/CourseRegisteredUser'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'

import * as easings from 'vuetify/es5/services/goto/easing-patterns'

export default {
  mixins: [validationMixin],
  validations: {
    description: {
      required
    },
    courseModel: {
      required
    },
    editClassroom: {
      required
    }
  },
  data: () => ({
    headers: [
      {
        text: 'Aula',
        value: 'classroom.description',
        class: 'redS--text'
      },
      { text: 'RUT', value: 'registeredUser.rut', class: 'redS--text' },
      {
        text: 'Nombre',
        value: 'registeredUser.name',
        class: 'redS--text',
        width: 150
      },
      {
        text: 'Apellido Paterno',
        value: 'registeredUser.last_name',
        class: 'redS--text'
      },
      {
        text: 'Apellido materno',
        value: 'registeredUser.mother_last_name',
        class: 'redS--text'
      },
      {
        text: 'Región',
        value: 'registeredUser.region',
        class: 'redS--text'
      },
      {
        text: 'Ciudad',
        value: 'registeredUser.city_school',
        class: 'redS--text'
      },
      {
        text: 'Acciones',
        value: 'actions',
        class: 'redS--text',
        sortable: false
      }
    ],
    target: 'table',
    duration: 1000,
    offset: 0,
    easing: 'easeInOutCubic',
    easings: Object.keys(easings),
    file: null,
    data: [],
    dataMoodle: [],
    courseModel: null,
    isData: false,
    loading: false,
    region: [],
    regionModel: null,
    filterNumber: [15, 20, 25],
    selected: [],
    classroomModel: null,
    editedItem: new CourseRegisteredUser(),
    defaultItem: new CourseRegisteredUser(),
    editIndex: -1,
    message: '',
    successMessage: 'Operación realizada con éxito.',
    errorMEssage: 'Ha ocurrido un error.',
    snackbar: false,
    timeout: 3000,
    dialog: false,
    editClassroomModel: null,
    profileModel: null,
    searchStudent: '',
    selectedFilter: [{ id: 1, description: 'Alumno' }],
    completeStepOne: false,
    completeStepTwo: false,
    completeStepThree: false,
    rulesValueStepOne: true,
    rulesValueStepTwo: true,
    rulesValueStepThree: true,
    e1: 1,
    loadingButton: false,
    colorSnackbarError: 'redS',
    colorSnackbarSuccess: 'blueS',
    colorSnackbar: 'blueS',
    selectionHasError: false
  }),
  created() {
    this.fetchCourseItems()
    this.fetchProfiles()
  },
  computed: {
    ...mapGetters({
      courseItems: 'course/courses',
      registeredUsers: 'registeredUser/registeredUsers',
      courseRegisteredUser: 'courseRegisteredUser/courseRegisteredUsers',
      classrooms: 'classroom/classrooms',
      profiles: 'profile/profiles',
      usersByCourse: 'course/usersByCourse'
    }),
    options() {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing
      }
    },
    filteredUserByCourse() {
      let userCourses = []

      this.usersByCourse.forEach(courseRegistered => {
        this.region.push(courseRegistered.registeredUser.region)

        if (this.selectedFilter.length !== 0) {
          this.selectedFilter.forEach(selected => {
            if (
              this.regionModel === null &&
              courseRegistered.profile.id === selected.id
            ) {
              userCourses.push(courseRegistered)
            } else {
              if (
                this.regionModel === courseRegistered.registeredUser.region &&
                courseRegistered.profile.id === selected.id
              ) {
                userCourses.push(courseRegistered)
              }
            }
          })
        } else {
          if (this.regionModel === null) {
            userCourses.push(courseRegistered)
          } else {
            if (this.regionModel === courseRegistered.registeredUser.region) {
              userCourses.push(courseRegistered)
            }
          }
        }
      })
      return userCourses
    },
    regions() {
      return Array.from(new Set(this.region))
      //[...new Set([...this.region])]
    },
    courseErrors() {
      const errors = []

      if (!this.$v.courseModel.$dirty) return errors
      !this.$v.courseModel.required && errors.push('Es obligatorio.')

      return errors
    },
    editClassroomErrors() {
      const errors = []

      if (!this.$v.editClassroom.$dirty) return errors
      !this.$v.editClassroom.required && errors.push('Es obligatorio.')

      return errors
    },
    editClassroom() {
      return this.editedItem.classroom
    }
  },
  methods: {
    ...mapActions({
      fetchCourseItems: 'course/fetchCourses',
      fetchRegisteredUsers: 'registeredUsers/fetchRegisteredUsers',
      fetchCourseRegisteredUser:
        'courseRegisteredUser/fetchCourseRegisteredUsers',
      fetchClassrooms: 'classroom/fetchClassrooms',
      editCourseRegisteredUser: 'courseRegisteredUser/putCourseRegisteredUser',
      fetchProfiles: 'profile/fetchProfiles',
      fetchUsersByCourse: 'course/getUsersByCourse'
    }),
    setEditClassroom() {
      this.editedItem.classroom = this.editClassroomModel
      this.editedItem.classroom_id = this.editClassroomModel.id
      this.$v.editClassroom.$touch()
    },
    editItem(item) {
      this.editedIndex = this.filteredUserByCourse.indexOf(item)

      this.editedItem = Object.assign({}, item)

      this.editClassroomModel = this.editedItem.classroom
      this.profileModel = this.editedItem.profile

      this.dialog = true
    },
    async save() {
      this.$v.editClassroom.$touch()
      if (!this.$v.$error) {
        if (this.profileModel !== null) {
          this.editedItem.profile = Object.assign({}, this.profileModel)
          this.editedItem.profile_id = this.profileModel.id
          this.editedItem.classroom_id = this.editClassroomModel.id
          this.editedItem.classroom = Object.assign({}, this.editClassroomModel)
        }
        const { success } = await this.editCourseRegisteredUser(this.editedItem)

        if (success) {
          this.fetchCourseRegisteredUser()
          this.close()
          this.colorSnackbar = this.colorSnackbarSuccess
          this.snackbar = true
          this.message = `Aula modificada exitosamente`
        } else {
          this.colorSnackbar = this.colorSnackbarError
          this.snackbar = true
          this.message = `Ha ocurrido un error`
        }
      }
    },
    async getStudents() {
      this.loadingButton = true
      setTimeout(() => {
        this.fetchUsersByCourse(this.courseModel.id)
        this.fetchClassrooms()
        this.e1 = 2
        this.completeStepOne = true
        this.rulesValueStepOne = true
        this.loadingButton = false
        // this.isData = true
        // this.$vuetify.goTo(300, this.options)
      }, 2000)
    },
    async makeClassroom() {
      if (this.selected.length !== 0 && this.courseModel !== null)
        this.selected.forEach(async (courseUser, index) => {
          let dataSend = Object.assign(courseUser, {
            ...{
              classroom_id: this.classroomModel.id,
              classroom: this.classroomModel
            }
          })

          const { success } = await this.editCourseRegisteredUser(dataSend)

          if (success && index === this.selected.length - 1) {
            setTimeout(() => {
              this.colorSnackbar = this.colorSnackbarSuccess
              this.snackbar = true
              this.message = `Se ha conformado el ${this.classroomModel.description} con ${this.selected.length} alumnos`

              this.classroomModel = null
              this.regionModel = null
              this.selected = []
              this.rulesValueStepThree = true
              this.completeStepThree = false
              this.completeStepTwo = false

              this.e1 = 2
            }, 1000)
            this.completeStepThree = true
          }
        })
    },
    async downloadExcel() {
      const config = {
        responseType: 'blob' // o blob o arraybuffer
      }

      const response = await axios.get(
        `/api/v2/download-file/excel/${this.courseModel.id}/${this.courseModel.description}`,
        config
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'file.xlsx')
      document.body.appendChild(link)
      link.click()

      console.log(response)
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    clear() {
      console.log(this.defaultItem)
      this.$v.$reset()
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      this.editClassroomModel = null
    },
    clearFilter() {
      this.regionModel = null
      this.searchStudent = ''
    },
    checkStepTwo() {
      this.rulesValueStepTwo = true

      if (this.selected.length === 0) {
        this.colorSnackbar = this.colorSnackbarError
        this.selectionHasError = true
        this.rulesValueStepTwo = false
        this.snackbar = true
        this.message = `Debe seleccionar al menos un usuario`
      }

      if (this.rulesValueStepTwo) {
        this.selectionHasError = false
        this.completeStepTwo = true
        this.e1 = 3
      }
    },
    backToCourse() {
      this.selectionHasError = false
      this.rulesValueStepTwo = true
      this.e1 = 1
    }
  }
}
</script>

<style></style>
