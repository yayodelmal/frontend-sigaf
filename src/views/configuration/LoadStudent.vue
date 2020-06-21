<template>
  <base-card color="blueS" class="px-5 py-3" title="Matrícula">
    <v-row v-if="!loading">
      <v-col cols="6" md="12" sm="12" lg="6">
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
      </v-col>
      <v-col cols="6" md="12" sm="12" lg="6">
        <v-file-input
          outlined
          dense
          v-model="file"
          placeholder="Cargar archivo estudiantes"
          label="Archivo"
          prepend-icon="mdi-paperclip"
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
    <v-card-actions>
      <v-spacer></v-spacer>
      <base-button
        icon="mdi-file-import"
        label="Importar archivo"
        @click="sendFile"
      ></base-button>
    </v-card-actions>
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
    loading: false
  }),
  created() {
    this.fetchCourseItems()
  },
  computed: {
    ...mapGetters({
      courseItems: 'course/courses'
    }),
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
