<template>
  <base-card
    color="blueS"
    class="px-5 py-3 mt-5"
    title="Gestión de estudiantes"
  >
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
          label="Obtener alumnos"
          @click="getStudents"
          :loading="loadingButton"
        ></base-button>
      </v-card-actions>
    </v-card>
    <v-card flat outlined class="my-3" v-if="isData">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="usersByCourse"
          loading-text="Cargando... por favor espere"
          calculate-widths
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-row>
                <base-textfield
                  label="Buscar"
                  required
                  clearable
                ></base-textfield>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="1000px" persistent>
                  <template v-slot:activator="{ on }">
                    <base-button
                      icon="mdi-plus-circle"
                      v-on="on"
                      label="Crear usuario"
                    ></base-button>
                  </template>
                  <v-form>
                    <v-card>
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
                                      v-model="rut"
                                      label="RUT"
                                      color="blueS"
                                      clearable
                                      hint="Formato 12.345.678-9"
                                      :loading="searchRutLoading"
                                      @keypress.enter="searchUserByRut"
                                      @blur="searchUserByRut"
                                    >
                                    </base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="3" lg="3">
                                    <base-textfield
                                      label="Nombre"
                                      required
                                      clearable
                                      v-model="editedItem.registeredUser.name"
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
                                      label="Teléfono movil"
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
                                    <base-textfield
                                      label="Región"
                                      required
                                      clearable
                                      v-model="editedItem.registeredUser.region"
                                    ></base-textfield>
                                  </v-col>
                                </v-row>
                                <span class="caption grey--text text--darken-1">
                                  Por favor complete la información del usuario
                                  referente a sus datos personales
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

                            <v-window-item :value="3">
                              <div class="pa-4">
                                <v-row justify="space-between">
                                  <v-col cols="12" sm="12" md="4" lg="4">
                                    <base-textfield
                                      label="RUT"
                                      readonly
                                      v-model="
                                        editedItem.registeredUser
                                          .rut_registered_moodle
                                      "
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="2" lg="2">
                                    <base-textfield
                                      label="ID Moodle"
                                      readonly
                                      v-model="
                                        editedItem.registeredUser
                                          .id_registered_moodle
                                      "
                                    ></base-textfield>
                                  </v-col>

                                  <v-col cols="12" sm="12" md="6" lg="6">
                                    <base-textfield
                                      label="Nombre"
                                      readonly
                                      v-model="
                                        editedItem.registeredUser
                                          .name_registered_moodle
                                      "
                                    ></base-textfield>
                                  </v-col>
                                </v-row>
                                <v-row justify="space-between">
                                  <v-col cols="12" sm="12" md="6" lg="6">
                                    <base-textfield
                                      label="Correo electrónico"
                                      readonly
                                      v-model="
                                        editedItem.registeredUser
                                          .email_registered_moodle
                                      "
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="3" lg="3">
                                    <base-textfield
                                      label="Ciudad"
                                      readonly
                                      v-model="
                                        editedItem.registeredUser
                                          .name_registered_moodle
                                      "
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="3" lg="3">
                                    <base-textfield
                                      label="Región"
                                      readonly
                                      v-model="
                                        editedItem.registeredUser.region_school
                                      "
                                    ></base-textfield>
                                  </v-col>
                                </v-row>
                                <span class="caption grey--text text--darken-1">
                                  Información obtenida desde la plataforma
                                  Moodle
                                </span>
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
                              v-if="step === 3"
                              :disabled="step === 3"
                              color="blueS"
                              :dark="step !== 3"
                              @click="step++"
                            >
                              Guardar
                            </v-btn>
                            <v-btn
                              v-else
                              color="blueS"
                              :dark="step !== 3"
                              @click="step++"
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
              </v-row>
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
      </v-card-text>
    </v-card>
  </base-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import CourseRegisteredUser from '../../models/CourseRegisteredUser'
import axios from '../../services/axios'

export default {
  mixins: [validationMixin],
  validations: {
    courseModel: {
      required
    }
  },
  data: () => ({
    headers: [
      {
        text: 'RUT',
        value: 'registeredUser.rut',
        class: 'redS--text',
        width: 150
      },
      {
        text: 'Nombre',
        value: 'registeredUser.name',
        class: ['redS--text', 'text-md-h6']
      },
      {
        text: 'Apellido Paterno',
        value: 'registeredUser.last_name',
        class: 'redS--text'
      },
      {
        text: 'Apellido materno',
        value: 'registeredUser.mother_last_name',
        class: 'redS--text',
        visibility: 'd-none'
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
    loadingButton: false,
    courseModel: null,
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
    rut: '',
    isRutCorrect: true,
    searchRutLoading: false
  }),
  created() {
    this.fetchCourses()
  },
  watch: {
    courseModel() {
      this.isData = false
    }
  },
  computed: {
    ...mapGetters({
      courseItems: 'course/courses',
      usersByCourse: 'course/usersByCourse'
    }),
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
    formTitle() {
      return this.editedIndex === -1 ? 'Crear sección' : 'Editar sección'
    }
  },
  methods: {
    ...mapActions({
      fetchCourses: 'course/fetchCourses',
      fetchUsersByCourse: 'course/getUsersByCourse'
    }),
    searchUserByRut() {
      this.searchRutLoading = true

      // const vm = this
      setTimeout(async () => {
        const { data } = await axios.get(`/api/v2/registered-user/${this.rut}`)

        const response = await axios.get(
          `/api/v2/course-users/${data.registeredUser.id}/courses`
        )

        response.data._data.forEach(data => {
          if (data.properties.course.id === this.courseModel.id) {
            this.editedItem = Object.assign({}, data.properties)
          }
        })

        this.findActivities(this.editedItem.id)

        this.searchRutLoading = false
      }, 1000)
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
      this.loadingButton = true
      setTimeout(() => {
        this.fetchUsersByCourse(this.courseModel.id)
        this.loadingButton = false
        this.isData = true
      }, 2000)
    },
    editItem(item) {
      this.dialog = true
      console.log(item)
    },
    deleteItem(item) {
      console.log(item)
    },
    cancell() {
      this.dialog = false
    },
    findRut() {
      let arrayRut = [...Array.from(this.rut)].reverse()

      console.log(arrayRut)
      console.log(this.isRutCorrect)

      arrayRut.forEach((element, index) => {
        if (index === 0) {
          if (this.isNumber(element)) {
            this.isRutCorrect = true
          } else if (element === 'K') {
            this.isRutCorrect = true
          } else {
            console.log('rut false branch')
            this.isRutCorrect = false
          }
        }

        switch (index) {
          case 0:
            if (this.isNumber(element)) {
              this.isRutCorrect = true
            } else if (element === 'K') {
              this.isRutCorrect = true
            } else {
              console.log('rut false branch')
              this.isRutCorrect = false
            }
            break
          case 1:
            if (element === '-') {
              this.isRutCorrect = true
            } else {
              this.isRutCorrect = false
              console.log('guion false branch')
            }
            break
          case 2:
            if (this.isNumber(element)) {
              this.isRutCorrect = true
            } else {
              this.isRutCorrect = false
              console.log('guion false branch')
            }
            break
          case 3:
            if (this.isNumber(element)) {
              this.isRutCorrect = true
            } else {
              this.isRutCorrect = false
              console.log('guion false branch')
            }
            break
          case 4:
            if (this.isNumber(element)) {
              this.isRutCorrect = true
            } else {
              this.isRutCorrect = false
              console.log('guion false branch')
            }
            break
          case 5:
            if (element === '.') {
              this.isRutCorrect = true
            } else {
              this.isRutCorrect = false
              console.log('guion false branch')
            }
            break
          case 6:
            if (this.isNumber(element)) {
              this.isRutCorrect = true
            } else {
              this.isRutCorrect = false
              console.log('guion false branch')
            }
            break
          case 7:
            if (this.isNumber(element)) {
              this.isRutCorrect = true
            } else {
              this.isRutCorrect = false
              console.log('guion false branch')
            }
            break
          case 8:
            if (this.isNumber(element)) {
              this.isRutCorrect = true
            } else {
              this.isRutCorrect = false
              console.log('guion false branch')
            }
            break
          case 9:
            if (element === '.') {
              this.isRutCorrect = true
            } else {
              this.isRutCorrect = false
              console.log('guion false branch')
            }
            break
          case 10:
            if (this.isNumber(element)) {
              this.isRutCorrect = true
            } else {
              this.isRutCorrect = false
              console.log('guion false branch')
            }
            break
          case 11:
            if (this.isNumber(element)) {
              this.isRutCorrect = true
            } else {
              this.isRutCorrect = false
              console.log('guion false branch')
            }
            break
          default:
            this.isRutCorrect = false
            break
        }
      })

      console.log('Buscando rut')
    },

    isNumber(item) {
      return !isNaN(item)
    }
  }
}
</script>

<style></style>
