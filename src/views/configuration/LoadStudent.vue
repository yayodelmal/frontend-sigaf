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
            <base-textfield
              v-model="rutFormated"
              label="RUT"
              color="blueS"
              clearable
              hint="Formato 12.345.678-9"
              append-icon="mdi-magnify"
              @click:append="appendIconCallback"
            >
            </base-textfield>
            <v-card-actions>
              <v-spacer />
              <base-button
                block
                large
                icon="mdi-account"
                label="Crear usuario moodle"
              ></base-button>
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
    <v-snackbar color="blueS" v-model="snackbar" :timeout="timeout">
      {{ message }}
      <v-btn dark text @click="snackbar = false">
        Cerrar
      </v-btn>
    </v-snackbar>
  </base-card>
</template>

<script>
import axios from '../../services/axios'
import CourseRegisteredUser from '../../models/CourseRegisteredUser'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
export default {
  mixins: [validationMixin],
  validations: {
    courseModel: {
      required
    },
    file: {
      required
    }
  },
  data: () => ({
    file: null,
    courseModel: null,
    editedItem: new CourseRegisteredUser(),
    defaultItem: new CourseRegisteredUser(),
    editIndex: -1,
    message: '',
    successMessage: 'Operación realizada con éxito.',
    errorMEssage: 'Ha ocurrido un error.',
    snackbar: false,
    timeout: 3000,
    dialog: false,
    loading: false,
    value: '',
    rut: '1'
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
        // const chars = this.rut.split('')
        // const charsWithoutValidator = this.rut
        //   .substr(0, this.rut.length - 1)
        //   .split('')

        //   if()
        // const mask = charsWithoutValidator.reverse().map((char, i) => {
        //   if (i % 3 === 0 && i !== 0) {
        //     return `${char}.`
        //   }
        //   return char
        // })

        // return `${mask}-${chars.reverse()[0]}`

        return this.rut
      },
      set(val) {
        this.rut = val
      }
    },
    courseErrors() {
      const errors = []

      if (!this.$v.courseModel.$dirty) return errors
      !this.$v.courseModel.required && errors.push('Es obligatorio.')

      return errors
    },
    fileErrors() {
      const errors = []

      if (!this.$v.file.$dirty) return errors
      !this.$v.file.required && errors.push('Es obligatorio.')

      return errors
    }
  },
  methods: {
    ...mapActions({
      fetchCourseItems: 'course/fetchCourses'
    }),
    maskRut(event) {
      console.log(event)
    },
    async sendFile() {
      this.$v.$touch()
      if (!this.$v.$error) {
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
    },
    appendIconCallback() {
      console.log('test')
    }
  }
}
</script>

<style lang="scss" scoped></style>
