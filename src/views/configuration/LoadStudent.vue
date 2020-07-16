<template>
  <base-card color="blueS" class="px-5 py-3" title="Matrícula">
    <v-row v-if="!loading">
      <v-col cols="6" md="6" sm="6" lg="6">
        <v-card flat hover outlined>
          <v-card-title>
            Carga masiva
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
            <v-file-input
              outlined
              dense
              v-model="file"
              placeholder="Cargar archivo estudiantes"
              label="Archivo"
              prepend-icon=""
              prepend-inner-icon="mdi-paperclip"
              color="blueS"
              show-size
              @input="$v.file.$touch()"
              @blur="$v.file.$touch()"
              :error-messages="fileErrors"
            >
              <template v-slot:selection="{ text }">
                <v-chip label color="blueS" dark small>
                  {{ text }}
                </v-chip>
              </template>
            </v-file-input>
            <v-card-actions>
              <v-spacer />
              <base-button
                block
                large
                icon="mdi-file-import"
                label="Importar archivo"
                @click="sendFile"
              ></base-button>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" md="6" sm="6" lg="6">
        <v-card flat hover outlined>
          <v-card-title>
            Carga individual
          </v-card-title>
          <v-card-text>
            <base-autocomplete
              v-model="courseModelSingle"
              :items="courseItems"
              label="Curso"
              item-value="id"
              item-text="description"
              return-object
              @change="$v.courseModelSingle.$touch()"
              @blur="$v.courseModelSingle.$touch()"
              :error-messages="courseSingleErrors"
            >
            </base-autocomplete>
            <base-textfield
              v-model="editedItem.registeredUser.rut"
              label="RUT"
              color="blueS"
              hint="Formato 12.345.678-9"
              append-icon="mdi-magnify"
              :loading="searchRutLoading"
              @click:append="searchUserByRut"
              @keypress.enter="searchUserByRut"
            >
            </base-textfield>
            <v-card-actions>
              <v-spacer />
              <v-dialog v-model="dialog" max-width="1000px" persistent>
                <template v-slot:activator="{ on }">
                  <base-button
                    :disabled="!isCreatedUser"
                    v-on="on"
                    block
                    large
                    icon="mdi-account"
                    label="Crear usuario moodle"
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
                                    v-model="editedItem.registeredUser.rut"
                                    :readonly="editedIndex !== -1"
                                    label="RUT*"
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
                                    label="Nombre*"
                                    required
                                    v-model="editedItem.registeredUser.name"
                                    @input="$v.name.$touch()"
                                    @blur="$v.name.$touch()"
                                    :error-messages="nameErrors"
                                  ></base-textfield>
                                </v-col>
                                <v-col cols="12" sm="6" md="3" lg="3">
                                  <base-textfield
                                    label="Apellido paterno*"
                                    required
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
                                    label="Apellido materno*"
                                    required
                                    v-model="
                                      editedItem.registeredUser.mother_last_name
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
                                    label="Correo electrónico*"
                                    required
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
                                    v-model="editedItem.registeredUser.phone"
                                  ></base-textfield>
                                </v-col>
                                <v-col cols="12" sm="6" md="3" lg="3">
                                  <base-textfield
                                    label="Teléfono movil*"
                                    required
                                    v-model="editedItem.registeredUser.mobile"
                                    @input="$v.mobile.$touch()"
                                    @blur="$v.mobile.$touch()"
                                    :error-messages="mobileErrors"
                                  ></base-textfield>
                                </v-col>
                              </v-row>
                              <v-row justify="space-between">
                                <v-col cols="12" sm="12" md="6" lg="6">
                                  <base-textfield
                                    label="Dirección"
                                    required
                                    v-model="editedItem.registeredUser.address"
                                  ></base-textfield>
                                </v-col>
                                <v-col cols="12" sm="6" md="3" lg="3">
                                  <base-textfield
                                    label="Ciudad"
                                    required
                                    v-model="editedItem.registeredUser.city"
                                  ></base-textfield>
                                </v-col>
                                <v-col cols="12" sm="6" md="3" lg="3">
                                  <base-textfield
                                    label="Región"
                                    required
                                    v-model="editedItem.registeredUser.region"
                                  ></base-textfield>
                                </v-col>
                              </v-row>
                              <span class="caption grey--text text--darken-1">
                                Por favor complete la información del usuario
                                referente a sus datos personales
                              </span>
                              <span class="caption grey--text text--darken-1">
                                (*) Requerido
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
                                    v-model="
                                      editedItem.registeredUser.rbd_school
                                    "
                                  ></base-textfield>
                                </v-col>
                                <v-col cols="12" sm="12" md="8" lg="8">
                                  <base-textfield
                                    label="Nombre"
                                    required
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
                                    v-model="
                                      editedItem.registeredUser.phone_school
                                    "
                                  ></base-textfield>
                                </v-col>
                                <v-col cols="12" sm="12" md="4" lg="4">
                                  <base-textfield
                                    label="Ciudad"
                                    required
                                    v-model="
                                      editedItem.registeredUser.city_school
                                    "
                                  ></base-textfield>
                                </v-col>
                                <v-col cols="12" sm="12" md="4" lg="4">
                                  <base-textfield
                                    label="Región"
                                    required
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
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else class="fill-height" align-content="center" justify="center">
      <v-col class="subtitle-1 text-center" cols="12">
        Subiendo archivo
      </v-col>
      <v-col cols="6">
        <v-progress-linear
          color="blueS accent-4"
          indeterminate
          rounded
          height="6"
        ></v-progress-linear>
      </v-col>
    </v-row>
    <v-overlay :value="overlay" color="grayS" :opacity="opacity">
      <div class="text-center">
        <v-progress-circular indeterminate size="64"> </v-progress-circular>
      </div>
      <h3 class="headline text-center mt-5">Sincronizando...</h3>
    </v-overlay>
    <base-snackbar
      :message="message"
      :type="typeSnackbar"
      :active="snackbar"
      @changeValue="snackbar = $event"
    >
    </base-snackbar>
    <!-- <v-snackbar :color="colorSnackBar" v-model="snackbar" :timeout="timeout">
      <v-icon x-large dark>mdi-alert-circle-outline</v-icon>
      <span class="ml-3">{{ message }}</span>
      <v-btn dark text @click="snackbar = false">
        Cerrar
      </v-btn>
    </v-snackbar> -->
  </base-card>
</template>

<script>
import axios from '../../services/axios'
import CourseRegisteredUser from '../../models/CourseRegisteredUser'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'

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
    courseModelSingle: { required },
    file: { required },
    name: { required },
    lastName: { required },
    motherLastName: { required },
    email: { required, email },
    mobile: { required },
    rut: { required, rutFormated }
  },
  data: () => ({
    file: null,
    courseModel: null,
    courseModelSingle: null,
    editedItem: new CourseRegisteredUser(),
    defaultItem: new CourseRegisteredUser(),
    editedIndex: -1,
    message: '',
    successMessage: 'Operación realizada con éxito.',
    errorMEssage: 'Ha ocurrido un error.',
    snackbar: false,
    timeout: 3000,
    dialog: false,
    loading: false,
    value: '',
    checkRut: '',
    isRutCorrect: false,
    searchRutLoading: false,
    progressiveColor: 'blueS',
    progressiveValue: 0,
    rulesValueStepOne: true,
    completeStepOne: false,
    isCreatedUser: false,
    step: 1,
    typeSnackbar: 'success',
    colorSnackBar: 'blueS',
    finalSave: false,
    overlay: false
  }),
  created() {
    this.fetchCourseItems()
  },
  computed: {
    ...mapGetters({
      courseItems: 'course/courses'
    }),
    mask() {
      // const $this = this
      const chars = this.value.split('')
      const charsWithoutValidator = this.value
        .substr(0, this.value.length - 1)
        .split('')
      let currentValidator =
        11 -
        (charsWithoutValidator
          .reverse()
          .reduce((sum, el, i) => (sum += el * ((i % 6) + 2)), 0) %
          11)
      currentValidator = currentValidator == 10 ? 'N' : '#'
      let nextValidator =
        11 -
        (chars
          .reverse()
          .reduce((sum, el, i) => (sum += el * ((i % 6) + 2)), 0) %
          11)
      nextValidator = nextValidator == 10 ? 'N' : '#'
      const mask = charsWithoutValidator
        .reverse()
        .map((char, i) => {
          if (i % 3 === 0 && i !== 0) {
            return '#.'
          }
          return '#'
        })
        .reverse()
        .join('')
      return `${mask}-${currentValidator}${nextValidator}` // ad an extra char at the end to be able to type.
    },
    rutFormated: {
      get() {
        return this.checkRut
      },
      set(val) {
        this.checkRut = val
      }
    },
    courseErrors() {
      const errors = []

      if (!this.$v.courseModel.$dirty) return errors
      !this.$v.courseModel.required && errors.push('Es obligatorio.')

      return errors
    },
    courseSingleErrors() {
      const errors = []

      if (!this.$v.courseModelSingle.$dirty) return errors
      !this.$v.courseModelSingle.required && errors.push('Es obligatorio.')

      return errors
    },

    fileErrors() {
      const errors = []

      if (!this.$v.file.$dirty) return errors
      !this.$v.file.required && errors.push('Es obligatorio.')

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
    mobileErrors() {
      const errors = []
      if (!this.$v.mobile.$dirty) return errors
      !this.$v.mobile.required && errors.push('El teléfono movil es requerido.')
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
    }
  },
  methods: {
    ...mapActions({
      fetchCourseItems: 'course/fetchCourses',
      postRegisteredUser: 'registeredUser/postRegisteredUser',
      postCourseUser: 'courseRegisteredUser/postCourseRegisteredUser'
    }),
    maskRut(event) {
      console.log(event)
    },
    searchUserByRut() {
      this.$v.rut.$touch()
      this.$v.courseModelSingle.$touch()
      if (this.$v.rut.required && this.$v.courseModelSingle.required) {
        if (this.editedIndex === -1) {
          this.searchRutLoading = true
          setTimeout(async () => {
            const { data } = await axios.get(
              `/api/v2/registered-user/${this.editedItem.registeredUser.rut}`
            )

            const { _data, success, statusCode, message } = data

            if (success) {
              const response = await axios.get(
                `/api/v2/course-users/${_data.id}/courses`
              )

              const user = response.data._data.filter(
                data => data.properties.course.id === this.courseModelSingle.id
              )

              if (user.length > 0) {
                this.showSnackbar({
                  message: 'El usuario ya se encuentra matriculado en el curso',
                  type: 'warning'
                })
              } else {
                console.log('registeredUser => ', _data)
                this.editedItem.registeredUser = _data
                this.isCreatedUser = true
              }
            } else {
              if (statusCode === 406) {
                this.showSnackbar({
                  message: message,
                  type: 'danger'
                })

                this.editedItem = this.defaultItem
              } else {
                this.isCreatedUser = true
              }
            }
            this.searchRutLoading = false
          }, 1000)
        }
      } else {
        this.showSnackbar({
          message: 'Debe seleccionar un curso',
          type: 'warning'
        })
      }
    },
    async save() {
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

      const { _data, success } = await this.postRegisteredUser(dataSend)

      if (success) {
        const dataCourseUser = {
          course_id: this.courseModelSingle.id,
          registered_user_id: _data.properties.id,
          profile_id: 1,
          classroom_id: 1
        }

        const { success, message } = await this.postCourseUser(dataCourseUser)

        if (success) {
          this.showSnackbar({
            message: this.successMessage,
            type: 'success'
          })
        } else {
          this.showSnackbar({
            message: message,
            type: 'danger'
          })
        }
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

        if (!this.$v.mobile.required) {
          this.$v.mobile.$touch()
          this.completeStepOne = this.$v.mobile.required
        }
      }

      if (this.completeStepOne) {
        this.step++
        this.finalSave = true
      }
    },

    async sendFile() {
      this.$v.courseModel.$touch()
      this.$v.file.$touch()
      if (!this.$v.courseModel.$error && !this.$v.file.$error) {
        this.loading = true

        let formData = new FormData()
        formData.append('file', this.file)
        formData.append('courseId', this.courseModel.id)

        const config = {
          'Content-Type': 'multipart/form-data'
        }
        const { data } = await axios.post(
          '/api/v2/upload-file',
          formData,
          config
        )

        if (data.success) {
          setTimeout(() => {
            this.loading = false
            this.snackbar = true
            this.message = `Archivo cargado con éxito`
            this.clear()
          }, 2000)
        }
      }
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    clear() {
      this.$v.$reset()
      this.file = null
      this.courseModel = null
      this.courseModelSingle = null
      this.editedItem = new CourseRegisteredUser()
      this.finalSave = false
      this.isCreatedUser = false
    },
    appendIconCallback() {
      console.log('test')
    },
    showSnackbar({ type, message }) {
      this.snackbar = true
      this.typeSnackbar = type
      this.message = message
    }
  }
}
</script>

<style lang="scss" scoped></style>
