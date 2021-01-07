<template>
  <base-card
    color="blueS"
    class="px-5 py-3"
    icon="mdi-hammer-wrench"
    title="Conformación de aulas"
  >
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
            <v-card flat>
              <v-card-title>
                Seleccione curso:
              </v-card-title>
              <v-card-text>
                <v-toolbar tile dark color="blueS darken-1" class="mb-1">
                  <v-select
                    class="max-width"
                    v-model="courseModel"
                    flat
                    item-value="id"
                    item-text="description"
                    solo-inverted
                    hide-details
                    color="blueS"
                    return-object
                    :items="courseItems"
                    prepend-inner-icon="mdi-magnify"
                    label="Curso"
                    @change="$v.courseModel.$touch()"
                    @blur="$v.courseModel.$touch()"
                  ></v-select>
                  <v-spacer></v-spacer>

                  <v-switch
                    v-if="$vuetify.breakpoint.mdAndUp"
                    class="mt-4"
                    color="white"
                    v-model="detail"
                    inset
                    label="Ver detalle"
                  ></v-switch>

                  <v-spacer></v-spacer>
                  <v-btn
                    depressed
                    large
                    color="blueS"
                    @click="getStudents"
                    :loading="loadingButton"
                  >
                    Generar
                    <v-icon class="ml-2" size="25">mdi-arrow-right-bold</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-row v-if="loaded" class="mt-10">
                  <v-col
                    v-if="!detail || $vuetify.breakpoint.mdAndDown"
                    cols="12"
                    sm="12"
                    md="12"
                    xl="12"
                  >
                    <v-hover v-slot:default="{ hover }">
                      <v-expand-transition>
                        <v-card
                          color="blueS"
                          class="d-flex flex-column text-center"
                        >
                          <v-card
                            class="first v-sheet--offset transition-fast-in-fast-out mx-auto"
                            color="white"
                            :class="{ 'v-card--reveal': hover }"
                            width="97%"
                          >
                            <bar-chart
                              v-if="loaded"
                              :chartData="chartDataBar"
                              :options="optionsBar"
                              class="max-height"
                            >
                            </bar-chart>
                          </v-card>
                          <v-row justify="center">
                            <v-btn
                              class="mb-3"
                              @click="downloadExcel"
                              dark
                              depressed
                              color="grayS"
                            >
                              <v-icon class="mr-3" size="25" color="success"
                                >mdi-file-excel</v-icon
                              >Descargar
                            </v-btn>
                          </v-row>
                        </v-card>
                      </v-expand-transition>
                    </v-hover>
                  </v-col>
                  <v-col
                    v-if="detail && $vuetify.breakpoint.lgAndUp"
                    cols="12"
                    sm="12"
                    md="12"
                    lg="4"
                    xl="4"
                  >
                    <v-hover v-slot:default="{ hover }">
                      <v-expand-transition>
                        <v-card
                          color="blueS"
                          class="d-flex flex-column text-center"
                        >
                          <v-card
                            class="first v-sheet--offset transition-fast-in-fast-out mx-auto"
                            color="white"
                            :class="{ 'v-card--reveal': hover }"
                            width="95%"
                          >
                            <horizontal-bar-chart
                              v-if="loaded"
                              :chartData="chartDataBar"
                              :options="optionsBar"
                              class="max-height-vertical"
                            >
                            </horizontal-bar-chart>
                          </v-card>
                          <v-row justify="center">
                            <v-btn
                              class="mb-3"
                              @click="downloadExcel"
                              dark
                              depressed
                              color="grayS"
                            >
                              <v-icon class="mr-3" size="25" color="success"
                                >mdi-file-excel</v-icon
                              >Descargar
                            </v-btn>
                          </v-row>
                        </v-card>
                      </v-expand-transition>
                    </v-hover>
                  </v-col>
                  <v-col v-if="detail" cols="12" sm="12" md="12" lg="8" xl="8">
                    <v-row justify="center">
                      <v-expansion-panels focusable hover>
                        <v-expansion-panel
                          v-for="(data, index) in listClassroomUsers"
                          :key="index"
                        >
                          <v-expansion-panel-header
                            color="white"
                            class="text-caption font-weigth-bold"
                            >{{ data.classroom }} ({{ data.numberOfUser }}
                            estudiantes)
                            <template v-slot:actions>
                              <v-icon color="blueS">$expand</v-icon>
                            </template>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-row justify="center">
                              <v-simple-table
                                dense
                                :fixed-header="true"
                                height="300"
                                :style="{ width: '100%' }"
                              >
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th
                                        :style="{
                                          width: '120px'
                                        }"
                                        class="text-left redS--text"
                                      >
                                        Rut
                                      </th>
                                      <th class="text-left redS--text">
                                        Nombre
                                      </th>
                                      <th class="text-left redS--text">
                                        Apellido paterno
                                      </th>
                                      <th class="text-left redS--text">
                                        Apellido materno
                                      </th>
                                      <th class="text-left redS--text">
                                        Región
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr
                                      v-for="(user, index) in data.users"
                                      :key="index"
                                    >
                                      <td>{{ user.registeredUser.rut }}</td>
                                      <td>{{ user.registeredUser.name }}</td>
                                      <td>
                                        {{ user.registeredUser.last_name }}
                                      </td>
                                      <td>
                                        {{
                                          user.registeredUser.mother_last_name
                                        }}
                                      </td>
                                      <td>{{ user.registeredUser.region }}</td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>
                            </v-row>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <base-button
                  v-if="this.listClassroomUsers.length !== 0"
                  @click="checkStepOne"
                  icon="mdi-arrow-right-bold-circle"
                  label="Continuar con aula"
                ></base-button>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-toolbar tile dark color="blueS darken-1" class="mb-1">
              <v-select
                v-if="regions"
                class="max-width"
                v-model="regionModel"
                flat
                item-value="id"
                item-text="description"
                solo-inverted
                hide-details
                color="blueS"
                return-object
                :items="regions"
                prepend-inner-icon="mdi-magnify"
                label="Región"
                @change="
                  $v.courseModel.$touch()
                  $vuetify.goTo(target, options)
                "
                @blur="$v.courseModel.$touch()"
              ></v-select>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="searchStudent"
                color="blueS"
                clearable
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="mdi-magnify"
                label="Buscar"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-row>
                <v-checkbox
                  v-for="profile in profiles"
                  :key="profile.id"
                  :label="profile.description"
                  v-model="selectedFilter"
                  :value="profile"
                  multiple
                  class="mt-4 ml-2"
                >
                </v-checkbox>
              </v-row>
              <v-spacer></v-spacer>
              <v-btn
                depressed
                large
                color="blueS"
                @click="clearFilter"
                :loading="loadingButton"
              >
                Limpiar
                <v-icon class="ml-2" size="25">mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

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
            <v-card flat>
              <v-card-title>
                Seleccionar aula:
              </v-card-title>
              <v-card-text>
                <v-toolbar tile dark color="blueS darken-1" class="mb-1">
                  <v-select
                    v-if="regions"
                    class="max-width"
                    v-model="classroomModel"
                    :items="classrooms"
                    flat
                    item-value="id"
                    item-text="description"
                    solo-inverted
                    hide-details
                    color="blueS"
                    return-object
                    prepend-inner-icon="mdi-magnify"
                    label="Aula"
                  ></v-select>
                  <v-spacer></v-spacer>
                  <v-btn
                    depressed
                    large
                    color="blueS"
                    @click="makeMassiveClassroom"
                  >
                    Conformar aula
                    <v-icon class="ml-2" size="25">mdi-check-circle</v-icon>
                  </v-btn>
                  <!-- <v-btn
                    depressed
                    large
                    color="blueS"
                    @click="makeMassiveClassroom"
                  >
                    Conformar aula test
                    <v-icon class="ml-2" size="25">mdi-check-circle</v-icon>
                  </v-btn> -->
                </v-toolbar>
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
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-form>
        <v-card :loading="loadingEdit">
          <template v-slot:progress>
            <v-progress-linear color="blueS" indeterminate></v-progress-linear>
          </template>
          <v-toolbar dark color="blueS darken-1">
            <v-toolbar-title>
              Modificar
            </v-toolbar-title>
          </v-toolbar>
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
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="close">
              CANCELAR
            </v-btn>
            <v-btn
              :loading="loadingEdit"
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
    <v-overlay :value="overlay" color="grayS" :opacity="opacity">
      <div class="text-center">
        <v-progress-circular indeterminate size="64"> </v-progress-circular>
      </div>

      <h3 class="headline text-center mt-5">
        Sincronizando {{ indexCurrentSyncUser }}
      </h3>
      <h3 class="headline text-center mt-3">{{ currentSyncUser }}</h3>
      <h3 class="text-body-2 text-center mt-16">
        Por favor espere. Esto puede tardar unos minutos
      </h3>
    </v-overlay>
    <snackbar-component v-model="snackbar" :type="type" :message="message">
    </snackbar-component>
  </base-card>
</template>

<script>
import axios from '../../services/axios'
import CourseRegisteredUser from '../../models/CourseRegisteredUser'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'

import SnackbarComponent from '../../components/component/Snackbar'
import { Snackbar, groupBy } from '../../utils/constants'

import * as easings from 'vuetify/es5/services/goto/easing-patterns'

import BarChart from '../../components/chart/BarChart'
import HorizontalBarChart from '../../components/chart/HorizontalBar'

Array.prototype.forEachAsyncCustom = function(fn) {
  return this.reduce(
    (promise, n, index) => promise.then(() => fn(n, index)),
    Promise.resolve()
  )
}

export default {
  mixins: [validationMixin],
  components: {
    SnackbarComponent,
    HorizontalBarChart,
    BarChart
  },
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
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'RUT',
        value: 'registeredUser.rut',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold'],
        width: 150
      },
      {
        text: 'Nombre',
        value: 'registeredUser.name',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'Apellido Paterno',
        value: 'registeredUser.last_name',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'Apellido materno',
        value: 'registeredUser.mother_last_name',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'Región',
        value: 'registeredUser.region',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'Ciudad',
        value: 'registeredUser.city_school',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold']
      },
      {
        text: 'Acciones',
        value: 'actions',
        class: ['redS--text', 'text-subtitle-2', 'font-weight-bold'],
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
    selectedFilter: [{ id: 1, description: 'Estudiante' }],
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
    selectionHasError: false,
    overlay: false,
    opacity: 0.8,
    currentSyncUser: '',
    indexCurrentSyncUser: '',
    type: '',
    transition: 'scale-transition',
    listClassroomUsers: [],
    chartDataBar: {
      labels: [],
      datasets: []
    },
    optionsBar: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: 'index',
        intersect: false
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ],
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    },
    loaded: false,
    showDetail: false,
    detail: false,
    loadingEdit: false
  }),
  created() {
    this.fetchCourseItems()
    this.fetchProfiles()
  },
  watch: {
    courseModel() {
      this.listClassroomUsers = []
      this.loaded = false
      this.detail = false
    }
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
      fetchUsersByCourse: 'course/getUsersByCourse',
      editMassiveClassroom: 'courseRegisteredUser/putArrayCourseRegisteredUsers'
    }),
    checkStepOne() {
      if (this.listClassroomUsers.length !== 0) {
        this.e1 = 2
      } else {
        const message = 'Debe seleccionar un curso'
        this.makeSnakResponse(message, Snackbar.WARNING.type)
      }
    },
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
    setEditClassroom() {
      this.editedItem.classroom = this.editClassroomModel
      this.editedItem.classroom_id = this.editClassroomModel.id
      this.$v.editClassroom.$touch()
    },
    fillChartUsersByCourse() {
      this.loaded = false
      const property = 'classroomId'
      const userByClassroom = groupBy(this.usersByCourse, property)

      const labels = []
      const data = []
      this.listClassroomUsers = []
      this.classrooms.forEach((classroom, index) => {
        if (userByClassroom[classroom.id]) {
          const arrayData = userByClassroom[classroom.id].length

          //   const maxLength = Math.ceil(userByClassroom[classroom.id].length / 3)

          this.listClassroomUsers.push({
            classroom: classroom.description,
            numberOfUser: userByClassroom[classroom.id].length,
            users: userByClassroom[classroom.id]

            // userByClassroom[classroom.id].slice(0, maxLength),
            // userByClassroom[classroom.id].slice(maxLength, maxLength * 2),
            // userByClassroom[classroom.id].slice(
            //   maxLength * 2,
            //   userByClassroom[classroom.id].length
            // )
          })

          data.push(arrayData)

          labels[index] = classroom.description
        }
      })

      const dataset = {
        backgroundColor: '#fb8c00', //fb8c00 006C8D
        label: '# de estudiantes por Aula',
        data: data
      }

      this.chartDataBar.labels = labels
      this.chartDataBar.datasets = [dataset]
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
          this.loadingEdit = true
          this.editedItem.profile = Object.assign({}, this.profileModel)
          this.editedItem.profile_id = this.profileModel.id
          this.editedItem.classroom_id = this.editClassroomModel.id
          this.editedItem.classroom = Object.assign({}, this.editClassroomModel)
        }
        const { success } = await this.editCourseRegisteredUser(this.editedItem)

        if (success) {
          this.fetchCourseRegisteredUser()
          this.close()
          this.message = `Registro modificado exitosamente`
          this.makeSnakResponse(this.message, Snackbar.SUCCESS.type)
          this.loadingEdit = false
        } else {
          this.responseErrorMessage()
          this.loadingEdit = false
        }
      }
    },
    getStudents() {
      this.loadingButton = true
      setTimeout(async () => {
        if (this.$v.courseModel.$invalid) {
          const message = 'Debe seleccionar un curso'
          this.makeSnakResponse(message, Snackbar.WARNING.type)
        } else {
          if (this.listClassroomUsers.length === 0) {
            await this.fetchClassrooms()
            const { success } = await this.fetchUsersByCourse(
              this.courseModel.id
            )
            if (success) {
              this.fillChartUsersByCourse()

              this.completeStepOne = true
              this.rulesValueStepOne = true
              this.loaded = true
            }
          } else {
            this.completeStepOne = true
            this.rulesValueStepOne = true
            this.loaded = true
          }
        }
        this.loadingButton = false
      }, 1000)
    },
    async makeClassroom() {
      if (this.selected.length !== 0 && this.classroomModel !== null) {
        this.overlay = true
        await this.selected.forEachAsyncCustom(this.sendRequest)
      } else {
        this.message = `Debe seleccionar un aula`
        this.makeSnakResponse(this.message, Snackbar.WARNING.type)
      }
    },

    async makeMassiveClassroom() {
      if (this.selected.length !== 0 && this.classroomModel !== null) {
        this.overlay = true

        const payload = {
          courseRegisteredUsers: this.selected,
          classroom_id: this.classroomModel.id,
          classroom: this.classroomModel
        }
        const { success } = await this.editMassiveClassroom(payload)

        if (success) {
          this.message = `Se ha conformado el ${this.classroomModel.description} con ${this.selected.length} estudiantes`
          this.makeSnakResponse(this.message, Snackbar.SUCCESS.type)
          this.fillChartUsersByCourse()
          // this.getStudents()

          this.clear()
          this.e1 = 2
          //this.loaded = true
          this.detail = true
        }
      } else {
        this.message = `Debe seleccionar un aula`
        this.makeSnakResponse(this.message, Snackbar.WARNING.type)
      }
    },
    async sendRequest(courseUser, index) {
      await new Promise(resolve => setTimeout(() => resolve(), 100))
      let dataSend = Object.assign(courseUser, {
        ...{
          classroom_id: this.classroomModel.id,
          classroom: this.classroomModel
        }
      })
      const { success } = await this.editCourseRegisteredUser(dataSend)

      if (success) {
        this.currentSyncUser = `Agregando a ${courseUser.registeredUser.name} ${courseUser.registeredUser.last_name} al ${courseUser.classroom.description}`

        this.indexCurrentSyncUser = `${index + 1} de ${this.selected.length}`
      }

      if (index === this.selected.length - 1) {
        this.message = `Se ha conformado el ${this.classroomModel.description} con ${this.selected.length} estudiantes`
        this.makeSnakResponse(this.message, Snackbar.SUCCESS.type)
        this.loaded = false
        this.fillChartUsersByCourse()

        this.clear()
        this.e1 = 2
        this.loaded = true
        this.detail = true
      }
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
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    clear() {
      this.$v.$reset()
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      this.editClassroomModel = null
      this.classroomModel = null
      this.regionModel = null
      this.selected = []
      this.rulesValueStepThree = true
      this.completeStepThree = false
      this.completeStepTwo = false
      this.indexCurrentSyncUser = ''
      this.currentSyncUser = ''
      this.overlay = false
    },
    clearFilter() {
      this.regionModel = null
      this.searchStudent = ''
    },
    checkStepTwo() {
      this.rulesValueStepTwo = true

      if (this.selected.length === 0) {
        this.selectionHasError = true
        this.rulesValueStepTwo = false

        this.message = `Debe seleccionar al menos un usuario`

        this.makeSnakResponse(this.message, Snackbar.WARNING.type)
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
      this.loaded = true
    }
  }
}
</script>

<style scoped>
.v-sheet--offset {
  top: -10px;
  position: relative;
  z-index: 1;
}
.v-card--reveal {
  top: -20px;
  position: relative;
  z-index: 1;
}

.first {
  padding: 16px 0;
  position: relative;
}

.margin-custom {
  top: -7px;
  position: relative;
}

.v-button-position {
  top: 20px;
  position: relative;
  z-index: 0;
}

.max-height-vertical {
  height: 600px;
}

.max-height {
  height: 300px;
}

.max-width {
  max-width: 60%;
}

canvas {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
