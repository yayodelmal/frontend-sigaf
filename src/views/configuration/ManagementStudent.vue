<template>
  <base-card
    color="blueS"
    class="px-5 py-3 mt-5"
    title="Gestión de estudiantes"
  >
    <div v-if="loadingCourse">
      <v-skeleton-loader
        :loading="loadingCourse"
        :transition="transition"
        class="mx-auto"
        type="card-heading"
      ></v-skeleton-loader>
      <v-skeleton-loader
        :loading="loadingCourse"
        :transition="transition"
        class="mx-auto"
        type="actions"
      ></v-skeleton-loader>
    </div>
    <v-card v-else-if="!isData" flat outlined>
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
            prepend-inner-icon="mdi-magnify"
          ></v-select>
          <v-spacer />
          <v-select
            class="mx-3"
            v-model="courseModel"
            :items="arrayCourseByCategory"
            label="Curso"
            item-value="id"
            item-text="description"
            return-object
            flat
            color="blueS"
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            @change="$v.courseModel.$touch()"
            @blur="$v.courseModel.$touch()"
            :error-messages="courseErrors"
          ></v-select>
          <v-spacer />
          <v-btn
            :disabled="courseModel === null"
            large
            dark
            depressed
            color="blueS"
            @click="getStudents"
            :loading="loadingButton"
          >
            <v-icon size="25" class="mr-3">mdi-magnify</v-icon> Buscar
          </v-btn>
        </v-toolbar>
      </v-card-text>
    </v-card>
    <v-card v-else flat outlined>
      <v-card-text>
        <h3 class="title font-weight-bold mb-2 text-center">
          {{ courseModel.description }}
        </h3>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn depressed @click="isData = false" color="blueS" dark>
          CAMBIAR CURSO
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
    <v-expand-transition mode="fade">
      <v-card flat outlined class="my-3" v-show="isData">
        <v-card-text>
          <v-data-table
            :headers="headers"
            :search="search"
            :items="usersByCourse"
            loading-text="Cargando... por favor espere"
            calculate-widths
            :loading="loadingTable"
            show-select
            v-model="selected"
          >
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
                <v-btn
                  depressed
                  large
                  color="blueS"
                  @click="syncUsers"
                  :loading="loadingSync"
                >
                  Usuarios
                  <v-icon class="ml-2" size="25">mdi-sync</v-icon>
                </v-btn>
                <v-btn
                  class="ml-2"
                  depressed
                  large
                  color="blueS"
                  @click="syncActivities"
                  :loading="loadingSynActivities"
                >
                  Actividades
                  <v-icon class="ml-2" size="25">mdi-sync</v-icon>
                </v-btn>
                <v-dialog v-model="dialog" max-width="1000px" persistent>
                  <v-form>
                    <v-card :loading="loadingSave">
                      <template v-slot:progress>
                        <v-progress-linear
                          color="blueS"
                          indeterminate
                        ></v-progress-linear>
                      </template>
                      <v-card-title>
                        <v-row>
                          <span class="headline">{{ formTitle }}</span>
                          <v-spacer />
                          <v-btn icon text color="grayS" @click="cancell">
                            <v-icon size="30">mdi-close</v-icon>
                          </v-btn>
                        </v-row>
                      </v-card-title>
                      <v-card-text>
                        <v-card class="mx-auto">
                          <v-card-title
                            class="title font-weight-regular justify-space-between"
                          >
                            <span>{{ currentTitle }}</span>
                            <v-avatar
                              color="blueS"
                              class="subheading white--text"
                              size="24"
                              v-text="step"
                            ></v-avatar>
                          </v-card-title>

                          <v-window v-model="step">
                            <v-window-item :value="1">
                              <v-card-text>
                                <v-row justify="space-between">
                                  <v-col cols="12" sm="6" md="3" lg="3">
                                    <base-textfield
                                      v-model="editedItem.registeredUser.rut"
                                      :readonly="editedIndex !== -1"
                                      label="RUT"
                                      color="blueS"
                                      :clearable="editedIndex === -1"
                                      hint="Formato 12.345.678-9"
                                      :loading="searchRutLoading"
                                      @keypress.enter="searchUserByRut"
                                      @blur="
                                        searchUserByRut()
                                        $v.rut.$touch()
                                      "
                                      @input="$v.rut.$touch()"
                                      :error-messages="rutErrors"
                                    >
                                    </base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="3" lg="3">
                                    <base-textfield
                                      label="Nombre"
                                      required
                                      clearable
                                      v-model="editedItem.registeredUser.name"
                                      @input="$v.name.$touch()"
                                      @blur="$v.name.$touch()"
                                      :error-messages="nameErrors"
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="3" lg="3">
                                    <base-textfield
                                      label="Apellido paterno"
                                      required
                                      clearable
                                      v-model="
                                        editedItem.registeredUser.last_name
                                      "
                                      @input="$v.lastName.$touch()"
                                      @blur="$v.lastName.$touch()"
                                      :error-messages="lastNameErrors"
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="3" lg="3">
                                    <base-textfield
                                      label="Apellido materno"
                                      required
                                      clearable
                                      v-model="
                                        editedItem.registeredUser
                                          .mother_last_name
                                      "
                                      @input="$v.motherLastName.$touch()"
                                      @blur="$v.motherLastName.$touch()"
                                      :error-messages="motherLastNameErrors"
                                    ></base-textfield>
                                  </v-col>
                                </v-row>
                                <v-row justify="space-between">
                                  <v-col cols="12" sm="12" md="6" lg="6">
                                    <base-textfield
                                      label="Correo electrónico"
                                      required
                                      clearable
                                      v-model="editedItem.registeredUser.email"
                                      @input="$v.email.$touch()"
                                      @blur="$v.email.$touch()"
                                      :error-messages="emailErrors"
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="3" lg="3">
                                    <base-textfield
                                      label="Teléfono fijo"
                                      required
                                      clearable
                                      v-model="editedItem.registeredUser.phone"
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="3" lg="3">
                                    <base-textfield
                                      label="Teléfono móvil"
                                      required
                                      clearable
                                      v-model="editedItem.registeredUser.mobile"
                                    ></base-textfield>
                                  </v-col>
                                </v-row>
                                <v-row justify="space-between">
                                  <v-col cols="12" sm="12" md="6" lg="6">
                                    <base-textfield
                                      label="Dirección"
                                      required
                                      clearable
                                      v-model="
                                        editedItem.registeredUser.address
                                      "
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="3" lg="3">
                                    <base-textfield
                                      label="Ciudad"
                                      required
                                      clearable
                                      v-model="editedItem.registeredUser.city"
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="3" lg="3">
                                    <v-autocomplete
                                      v-model="editedItem.registeredUser.region"
                                      outlined
                                      color="blueS"
                                      dense
                                      :items="regions"
                                      item-text="description"
                                      item-value="id"
                                      label="Región"
                                    ></v-autocomplete>
                                  </v-col>
                                </v-row>
                                <span class="caption grey--text text--darken-1">
                                  Complete la información del usuario referente
                                  a sus datos personales
                                </span>
                              </v-card-text>
                            </v-window-item>
                            <v-window-item :value="2">
                              <div class="pa-4">
                                <v-row justify="space-between">
                                  <v-col cols="12" sm="12" md="4" lg="4">
                                    <base-textfield
                                      label="RBD"
                                      required
                                      clearable
                                      v-model="
                                        editedItem.registeredUser.rbd_school
                                      "
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="8" lg="8">
                                    <base-textfield
                                      label="Nombre"
                                      required
                                      clearable
                                      v-model="
                                        editedItem.registeredUser.name_school
                                      "
                                    ></base-textfield>
                                  </v-col>
                                </v-row>
                                <v-row justify="space-between">
                                  <v-col cols="12" sm="12" md="4" lg="4">
                                    <base-textfield
                                      label="Teléfono"
                                      required
                                      clearable
                                      v-model="
                                        editedItem.registeredUser.phone_school
                                      "
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="4" lg="4">
                                    <base-textfield
                                      label="Ciudad"
                                      required
                                      clearable
                                      v-model="
                                        editedItem.registeredUser.city_school
                                      "
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="4" lg="4">
                                    <base-textfield
                                      label="Región"
                                      required
                                      clearable
                                      v-model="
                                        editedItem.registeredUser.region_school
                                      "
                                    ></base-textfield>
                                  </v-col>
                                </v-row>
                                <span class="caption grey--text text--darken-1">
                                  Por favor complete la información del usuario
                                  referente a su establecimiento
                                </span>
                                <!-- <v-img
                                  class="mb-4"
                                  contain
                                  height="128"
                                  src="https://cdn.vuetifyjs.com/images/logos/v.svg"
                                ></v-img>
                                <h3 class="title font-weight-light mb-2">
                                  Welcome to Vuetify
                                </h3>
                                <span class="caption grey--text"
                                  >Thanks for signing up!</span
                                > -->
                              </div>
                            </v-window-item>
                          </v-window>

                          <v-divider></v-divider>

                          <v-card-actions>
                            <v-btn
                              :dark="step === 1"
                              :disabled="step === 1"
                              text
                              @click="step--"
                            >
                              Volver
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                              v-if="step === 2"
                              :disabled="!finalSave"
                              color="blueS"
                              :dark="finalSave"
                              @click="save"
                            >
                              Guardar
                            </v-btn>
                            <v-btn
                              v-else
                              color="blueS"
                              :dark="step !== 2"
                              @click="checkStep"
                            >
                              Continuar
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-card-text>
                      <v-card-actions> </v-card-actions>
                    </v-card>
                  </v-form>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:header.data-table-select="{ props, on }">
              <v-simple-checkbox
                color="blueS"
                v-bind="props"
                v-on="on"
              ></v-simple-checkbox>
            </template>
            <template v-slot:item.data-table-select="{ isSelected, select }">
              <v-simple-checkbox
                color="blueS"
                :value="isSelected"
                @input="select($event)"
              ></v-simple-checkbox>
            </template>
            <template v-slot:item.status="{ item }">
              <v-tooltip color="blueS" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon :color="getColor(item.status)" v-on="on">{{
                    getStatus(item.status)
                  }}</v-icon>
                </template>
                <span>{{ item.status }}</span>
              </v-tooltip>
            </template>
            <template v-slot:item.actions="{ item, index }">
              <v-tooltip color="blueS" bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon text v-on="on">
                    <v-icon @click.prevent="syncUser(item)">
                      mdi-database-sync
                    </v-icon>
                  </v-btn>
                </template>
                <span>Sincronizar</span>
              </v-tooltip>
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
                    <v-icon @click.prevent="deleteItem(item, index)">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-expand-transition>
    <v-overlay :value="overlay" color="grayS" :opacity="opacity">
      <div class="text-center">
        <v-progress-circular indeterminate size="64"> </v-progress-circular>
      </div>
      <h3 class="headline text-center mt-5">
        Sincronizando {{ indexCurrentSyncUser }}
      </h3>
      <h3 class="headline text-center mt-3">{{ currentSyncUser }}</h3>
      <h3 class="text-subtitle-1 text-center mt-3">{{ currentActivity }}</h3>
      <v-spacer />
      <h3 class="text-body-2 text-center mt-16">
        Por favor espere, esto puede tardar unos minutos.
      </h3>
    </v-overlay>
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
  </base-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import CourseRegisteredUser from '../../models/CourseRegisteredUser'
import axios from '../../services/axios'

import * as easings from 'vuetify/es5/services/goto/easing-patterns'

import SigafSnackbar from '../../components/component/Snackbar'
import { Snackbar } from '../../utils/constants'
import ConfirmDialog from '../../components/component/ConfirmCard'

Array.prototype.forEachAsyncCustom = function(fn) {
  return this.reduce(
    (promise, n, index) => promise.then(() => fn(n, index)),
    Promise.resolve()
  )
}

const rutFormated = value => {
  if (value.length !== 0) {
    const dashSplit = value.split('-')

    if (dashSplit.length === 2) {
      const dotSplit = value.split('.')

      if (dotSplit.length === 3) {
        return true
      }
    }
  }
  return false
}

export default {
  mixins: [validationMixin],
  validations: {
    courseModel: { required },
    name: { required },
    lastName: { required },
    motherLastName: { required },
    email: { required, email },
    rut: { required, rutFormated }
  },
  components: {
    SigafSnackbar,
    ConfirmDialog
  },
  data: () => ({
    headers: [
      {
        text: 'Estado',
        value: 'status',
        class: 'redS--text',
        width: 50
      },
      {
        text: 'Aula',
        value: 'classroom.description',
        class: 'redS--text',
        width: 80
      },
      {
        text: 'RUT',
        value: 'registeredUser.rut',
        class: ['redS--text'],
        width: 120
      },
      {
        text: 'Nombre',
        value: 'registeredUser.name',
        class: ['redS--text'],
        width: 150
      },
      {
        text: 'Apellido Paterno',
        value: 'registeredUser.last_name',
        class: 'redS--text',
        width: 150
      },
      {
        text: 'Apellido materno',
        value: 'registeredUser.mother_last_name',
        class: 'redS--text',
        width: 180
      },
      {
        text: 'Rol',
        value: 'profile.description',
        class: 'redS--text',
        width: 80
      },
      {
        text: 'Ultima conexión',
        value: 'lastAccessRegisteredMoodle',
        class: 'redS--text',
        width: 150
      },
      // {
      //   text: 'Región',
      //   value: 'registeredUser.region',
      //   class: 'redS--text',
      //   width: 180
      // },
      // {
      //   text: 'Ciudad',
      //   value: 'registeredUser.city',
      //   class: 'redS--text'
      // },
      {
        text: 'Opciones',
        value: 'actions',
        class: 'redS--text',
        sortable: false,
        width: 150
      }
    ],
    target: 'table',
    loadingCourse: false,
    duration: 1000,
    offset: 0,
    easing: 'easeInOutCubic',
    easings: Object.keys(easings),
    loadingButton: false,
    loadingTable: false,
    courseModel: null,
    category: null,
    isData: false,
    dialog: false,
    editedIndex: -1,
    editedItem: new CourseRegisteredUser(),
    defaultItem: new CourseRegisteredUser(),
    message: '',
    successMessage: 'Operación realizada con éxito.',
    errorMEssage: 'Ha ocurrido un error.',
    snackbar: false,
    timeout: 3000,
    loading: false,
    step: 1,
    isRutCorrect: false,
    searchRutLoading: false,
    progressiveColor: 'blueS',
    progressiveValue: 0,
    rulesValueStepOne: true,
    completeStepOne: false,
    finalSave: false,
    loadingSync: false,
    transition: 'scale-transition',
    search: '',
    selected: [],
    loadingSynActivities: false,
    overlay: false,
    opacity: 0.8,
    currentSyncUser: '',
    currentActivity: '',
    indexCurrentSyncUser: '',
    type: '',
    dialogConfirm: false,
    deleteIndex: '',
    loadingSave: false
  }),
  created() {
    this.loadingCourse = true
    this.fetchCourses().then(({ success }) => {
      if (success) {
        this.loadingCourse = false
      }
    })
    this.fetchActivities()
    this.fetchDataCategoryItems()
  },
  watch: {
    courseModel() {
      this.isData = false
    },
    async category() {
      await this.fetchCourseByCategory(this.category.courses.href)
    }
  },
  computed: {
    ...mapGetters({
      courseItems: 'course/courses',
      usersByCourse: 'course/usersByCourse',
      coursesByCategory: 'course/coursesByCategory',
      classrooms: 'classroom/classrooms',
      activities: 'activity/activities',
      regions: 'registeredUser/regions',
      categoryItems: 'category/categories'
    }),
    options() {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing
      }
    },
    arrayCourseByCategory() {
      if (this.category !== null) {
        return this.coursesByCategory.map(({ properties }) => {
          return {
            id: properties.id,
            description: properties.description,
            idCourseMoodle: properties.idCourseMoodle
          }
        })
      } else {
        return []
      }
    },

    currentTitle() {
      switch (this.step) {
        case 1:
          return 'Información personal'
        case 2:
          return 'Información colegio'
        default:
          return 'Información moodle'
      }
    },
    courseErrors() {
      const errors = []

      if (!this.$v.courseModel.$dirty) return errors
      !this.$v.courseModel.required && errors.push('Es obligatorio.')

      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('La nombre es requerido.')
      return errors
    },
    lastNameErrors() {
      const errors = []
      if (!this.$v.lastName.$dirty) return errors
      !this.$v.lastName.required && errors.push('El apellido es requerido.')
      return errors
    },
    motherLastNameErrors() {
      const errors = []
      if (!this.$v.motherLastName.$dirty) return errors
      !this.$v.motherLastName.required &&
        errors.push('El apellido materno es requerido.')
      return errors
    },
    rutErrors() {
      const errors = []
      if (!this.$v.rut.$dirty) return errors
      !this.$v.rut.required && errors.push('El RUT es requerido.')
      !this.$v.rut.rutFormated && errors.push('RUT en formato incorrecto')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Ingrese un E-mail válido.')
      !this.$v.email.required && errors.push('El E-mail es requerido.')
      return errors
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Crear sección' : 'Editar sección'
    },
    name() {
      return this.editedItem.registeredUser.name
    },
    motherLastName() {
      return this.editedItem.registeredUser.mother_last_name
    },
    lastName() {
      return this.editedItem.registeredUser.last_name
    },
    email() {
      return this.editedItem.registeredUser.email
    },
    mobile() {
      return this.editedItem.registeredUser.mobile
    },
    rut() {
      return this.editedItem.registeredUser.rut
    }
  },
  methods: {
    ...mapActions({
      fetchCourses: 'course/fetchCourses',
      fetchUsersByCourse: 'course/getUsersByCourse',
      postRegisteredUser: 'registeredUser/postRegisteredUser',
      postCourseUser: 'courseRegisteredUser/postCourseRegisteredUser',
      fetchClassroom: 'classroom/fetchClassrooms',
      fethActivitiesByUser:
        'courseRegisteredUser/getCourseRegisteredUserByUser',
      fetchActivities: 'activity/fetchActivities',
      syncUserActivities: 'activity/getContributoryActivities',
      deleteCourseUser: 'courseRegisteredUser/deleteCourseRegisteredUser',
      fetchCategoryItems: 'category/fetchCategories',
      fetchCourseByCategory: 'course/getCoursesByCategory'
    }),
    async fetchDataCategoryItems() {
      this.loading = true
      const { success, message } = await this.fetchCategoryItems()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
      this.loading = false
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
    getStatus(status) {
      if (status) return 'mdi-check'
      else return 'mdi-close'
    },
    getColor(status) {
      if (status) return 'blueS'
      else return 'redS'
    },
    async syncUser(item) {
      this.overlay = true
      if (item.course.id_course_moodle) {
        const URL = `/api/v2/sync/course-users/${item.course.id_course_moodle}/users/${item.registeredUser.rut}`
        const { status } = await axios.get(URL)

        if (status === 204) {
          this.message = 'El usuario no se encuentra registrado en moodle'

          this.makeSnakResponse(this.message, Snackbar.WARNING.type)
          this.overlay = false
        } else if (status === 201) {
          setTimeout(async () => {
            try {
              const { success } = await this.fethActivitiesByUser(item)
              if (success) {
                this.message = `Sincronización exitosa ${item.registeredUser.name} ${item.registeredUser.last_name}`

                this.makeSnakResponse(this.message, Snackbar.SUCCESS.type)
                this.overlay = false
              }
            } catch (error) {
              console.log(error)
            }
          }, 500)
        } else if (status === 416) {
          this.snackbar = true
          this.message = 'RUT no válido'

          this.makeSnakResponse(this.message, Snackbar.WARNING.type)
        }
      }
    },

    async syncAllUsers(classroom, index) {
      await new Promise(resolve => setTimeout(() => resolve(), 100))
      const { data } = await axios.get(
        `api/v2/sync/courses/${this.courseModel.idCourseMoodle}/classrooms/${classroom.id}/activities`
      )

      if (data.success) {
        this.snackbar = true
        this.message = `Sincronización exitosa ${classroom.description}`
      }

      if (index === this.classrooms.length - 1) {
        this.overlay = false
      }
    },

    async syncSelectedUsers(userCourse, index) {
      await new Promise(resolve => setTimeout(() => resolve(), 100))
      const { success } = await this.fethActivitiesByUser(userCourse)
      if (success) {
        this.message = `Sincronización exitosa ${userCourse.registeredUser.name} ${userCourse.registeredUser.last_name}`

        this.makeSnakResponse(this.message, Snackbar.SUCCESS.type)
      }
      if (index === this.selected.length - 1) {
        this.overlay = false
      }
    },

    async showSyncActivities(activity) {
      await new Promise(resolve => setTimeout(() => resolve(), 70))
      this.currentActivity = activity.description
    },
    async syncContributeActivities(userCourse, index) {
      await new Promise(resolve => setTimeout(() => resolve(), 100))

      const filterSection = 'Formativa'

      const filterActivity = this.activities.filter(activity => {
        return (
          activity.section.description !== filterSection &&
          this.courseModel.id === activity.course.id
        )
      })

      let arrayActivities = new Array()

      filterActivity.forEach(activity => {
        arrayActivities.push(activity.idActivityMoodle)
      })

      const data = {
        users: userCourse,
        array: JSON.stringify(arrayActivities)
      }

      const { success } = await this.syncUserActivities(data)

      if (success) {
        this.currentSyncUser = `Actualizando actividades de ${userCourse.registeredUser.name} ${userCourse.registeredUser.last_name} del ${userCourse.classroom.description}`

        if (this.selected.length === 0) {
          this.indexCurrentSyncUser = `${index + 1} de ${
            this.usersByCourse.length
          }`
        } else {
          this.indexCurrentSyncUser = `${index + 1} de ${this.selected.length}`
        }

        filterActivity.forEachAsyncCustom(this.showSyncActivities)
      }

      if (this.selected.length === 0) {
        if (index === this.usersByCourse.length - 1) {
          this.overlay = false
        }
      } else {
        if (index === this.selected.length - 1) {
          this.overlay = false
          this.selected = []
        }
      }
    },
    async syncActivities() {
      this.overlay = true
      if (this.selected.length === 0) {
        this.usersByCourse.forEachAsyncCustom(this.syncContributeActivities)
      } else {
        this.selected.forEachAsyncCustom(this.syncContributeActivities)
      }
    },
    async syncUsers() {
      if (this.courseModel.idCourseMoodle) {
        this.overlay = true
        const URL = `/api/v2/sync/course-users/${this.courseModel.idCourseMoodle}/users`
        const { status } = await axios.get(URL)

        if (status === 204) {
          this.message = 'El usuario no se encuentra registrado en moodle'

          this.makeSnakResponse(this.message, Snackbar.WARNING.type)
          this.overlay = false
        } else if (status === 201) {
          this.fetchUsersByCourse(this.courseModel.id).then(() => {
            this.message = 'Sincronización exitosa'
            this.overlay = false

            this.makeSnakResponse(this.message, Snackbar.SUCCESS.type)
          })
        }
      } else {
        console.log('none')
      }
    },

    searchUserByRut() {
      this.$v.rut.$touch()
      if (this.$v.rut.required) {
        if (this.editedIndex === -1) {
          this.searchRutLoading = true
          setTimeout(async () => {
            const { data } = await axios.get(
              `/api/v2/registered-user/${this.editedItem.registeredUser.rut}`
            )

            const { _data: registeredUser, success, message } = data

            if (success) {
              const response = await axios.get(
                `/api/v2/course-users/${registeredUser.id}/courses`
              )
              response.data._data.forEach(data => {
                if (data.properties.course.id === this.courseModel.id) {
                  this.editedItem = Object.assign({}, data.properties)
                }
              })
              this.findActivities(this.editedItem.id)
            } else {
              this.editedItem = new CourseRegisteredUser()

              this.message = message

              this.makeSnakResponse(this.message, Snackbar.WARNING.type)
            }

            this.searchRutLoading = false
          }, 1000)
        }
      }
    },
    async findActivities(id) {
      const { data } = await axios.get(
        `/api/v2/activity-course-registered-user/${id}`
      )

      this.editedItem.activities = data.activityCourseRegisteredUser

      this.editedItem.activities.forEach(activity => {
        if (
          activity.activity.description === 'Formulario de Renuncia' &&
          activity.status_moodle === 'Finalizado'
        ) {
          this.editedItem.isActive = false
        } else {
          this.editedItem.isActive = true
        }
      })
    },
    getStudents() {
      this.loadingTable = true
      this.loadingButton = true
      this.fetchUsersByCourse(this.courseModel.id).then(() => {
        this.isData = true
        this.loadingTable = false
        this.loadingButton = false
        this.$vuetify.goTo(this.target, this.options)
      })
    },
    editItem(item, index) {
      this.dialog = true

      this.editedIndex = this.usersByCourse.findIndex(
        find => find.id === item.id
      )

      this.editedItem = Object.assign({}, item)

      console.log('index', index)
    },
    deleteItem(item) {
      if (item.registeredUser.id_registered_moodle) {
        console.log('no puede eliminar')
      } else {
        this.editedIndex = this.usersByCourse.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogConfirm = true
      }
    },
    async confirmDelete() {
      const { success } = await this.deleteCourseUser(this.editedItem)

      if (success) {
        const index = this.usersByCourse.findIndex(
          courseUser => courseUser.id === this.editedItem.id
        )
        console.log(index)
        this.usersByCourse.splice(index, 1)
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
    close() {
      this.dialog = false
      this.dialogConfirm = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    async save() {
      if (this.editedIndex > -1) {
        this.loadingSave = true
        const dataSend = {
          id: this.editedItem.registeredUser.id,
          rut: this.editedItem.registeredUser.rut,
          name: this.editedItem.registeredUser.name,
          last_name: this.editedItem.registeredUser.last_name,
          mother_last_name: this.editedItem.registeredUser.mother_last_name,
          email: this.editedItem.registeredUser.email,
          phone: this.editedItem.registeredUser.phone,
          mobile: this.editedItem.registeredUser.mobile,
          address: this.editedItem.registeredUser.address,
          city: this.editedItem.registeredUser.city,
          region: this.editedItem.registeredUser.region,
          rbd_school: this.editedItem.registeredUser.rbd_school,
          name_school: this.editedItem.registeredUser.name_school,
          city_school: this.editedItem.registeredUser.city_school,
          region_school: this.editedItem.registeredUser.region_school,
          phone_school: this.editedItem.registeredUser.phone_school
        }

        const { success } = await this.postRegisteredUser(dataSend)

        if (success) {
          this.responseSuccessMessage()
        } else {
          this.responseErrorMessage()
        }

        this.loadingSave = false
      }

      this.close()
    },
    cancell() {
      this.$v.$reset()
      this.editedItem = new CourseRegisteredUser()
      this.dialog = false
    },
    isNumber(item) {
      return !isNaN(item)
    },
    checkStep() {
      this.completeStepOne = true
      if (this.step === 1) {
        if (!this.$v.rut.required) {
          this.$v.rut.$touch()
          this.completeStepOne = this.$v.rut.required
        }

        if (!this.$v.name.required) {
          this.$v.name.$touch()
          this.completeStepOne = this.$v.name.required
        }

        if (!this.$v.lastName.required) {
          this.$v.lastName.$touch()
          this.completeStepOne = this.$v.lastName.required
        }

        if (!this.$v.motherLastName.required) {
          this.$v.motherLastName.$touch()
          this.completeStepOne = this.$v.motherLastName.required
        }

        if (!this.$v.email.required) {
          this.$v.email.$touch()
          this.completeStepOne = this.$v.email.required
        }
      }

      if (this.completeStepOne) {
        this.step++
        this.finalSave = true
      }
    },
    clear() {
      this.$v.$reset()
      this.step = 1
      // this.courseModel = null
      this.editedItem = new CourseRegisteredUser()
      this.finalSave = false
    }
  }
}
</script>

<style></style>
