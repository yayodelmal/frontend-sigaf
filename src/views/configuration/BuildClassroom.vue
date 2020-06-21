<template>
  <base-card color="blueS" class="px-5 py-3" title="Conformación de aulas">
    <v-card>
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
        <v-spacer></v-spacer>
        <base-button
          :disabled="courseModel === null"
          icon="mdi-package-down"
          label="Obtener alumnos"
          @click="getStudents"
        ></base-button>
      </v-card-actions>
    </v-card>
    <v-card class="mt-5" v-if="isData">
      <v-card-title>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>
                Filtrar estudiantes:
              </v-card-title>
              <v-card-text>
                <base-autocomplete
                  v-if="regions"
                  v-model="regionModel"
                  :items="regions"
                  label="Región"
                  item-value="id"
                  item-text="description"
                  return-object
                >
                </base-autocomplete>
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

                <base-button
                  icon="mdi-check-circle"
                  label="Conformar aula"
                  @click="makeClassroom"
                ></base-button
              ></v-card-text>
            </v-card>
          </v-col>
          <v-col cols="3" sm="12" md="12" lg="3">
            <v-card>
              <v-card-text>
                <base-button
                  icon="mdi-file-excel"
                  label="Descargar Excel"
                  @click="downloadExcel"
                ></base-button>
              </v-card-text>
            </v-card>
            <v-spacer></v-spacer>
            <v-card class="mt-5">
              <v-card-title>
                Crear alumno:
              </v-card-title>
              <v-card-text>
                <base-button
                  icon="mdi-file-excel"
                  label="CREAR"
                  @click="downloadExcel"
                ></base-button>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filteredUserByCourse"
          class="elevation-1 grayS--text"
          v-model="selected"
          :loading="loading"
          loading-text="Cargando... por favor espere"
          show-select
          hide-default-footer
          calculate-widths
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
              :items-per-page-options="[15, 20, 25, 30, -1]"
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
    </v-card>

    <v-snackbar color="blueS" v-model="snackbar" :timeout="timeout">
      {{ message }}
      <v-btn dark text @click="snackbar = false">
        Cerrar
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-form>
        <v-card>
          <v-card-title>
            <span class="headline">Modificar Aula</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
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
      { text: 'RUT', value: 'registered_user.rut', class: 'redS--text' },
      {
        text: 'Nombre',
        value: 'registered_user.name',
        class: 'redS--text',
        width: 150
      },
      {
        text: 'Apellido Paterno',
        value: 'registered_user.last_name',
        class: 'redS--text'
      },
      {
        text: 'Apellido materno',
        value: 'registered_user.mother_last_name',
        class: 'redS--text'
      },
      {
        text: 'Región',
        value: 'registered_user.region',
        class: 'redS--text'
      },
      {
        text: 'Ciudad',
        value: 'registered_user.city_school',
        class: 'redS--text'
      },
      {
        text: 'Acciones',
        value: 'actions',
        class: 'redS--text',
        sortable: false
      }
    ],
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
    editClassroomModel: null
  }),
  created() {
    this.fetchCourseItems()
  },
  computed: {
    ...mapGetters({
      courseItems: 'course/courses',
      registeredUsers: 'registeredUser/registeredUsers',
      courseRegisteredUser: 'courseRegisteredUser/courseRegisteredUsers',
      classrooms: 'classroom/classrooms'
    }),
    filteredUserByCourse() {
      return this.courseRegisteredUser.filter(courseUser => {
        this.region.push(courseUser.registered_user.region)
        if (this.regionModel !== null) {
          return (
            courseUser.course.id === this.courseModel.id &&
            courseUser.registered_user.region === this.regionModel
          )
        }
        return courseUser.course.id === this.courseModel.id
      })
    },
    regions() {
      return [...new Set([...this.region])]
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
      editCourseRegisteredUser: 'courseRegisteredUser/putCourseRegisteredUser'
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

      this.dialog = true
    },
    async save() {
      this.$v.editClassroom.$touch()
      if (!this.$v.$error) {
        const { success } = await this.editCourseRegisteredUser(this.editedItem)

        if (success) {
          this.fetchCourseRegisteredUser()
          this.close()
          this.snackbar = true
          this.message = `Aula modificada exitosamente`
        }
      }
    },
    async getStudents() {
      setTimeout(() => {
        this.fetchCourseRegisteredUser()
        this.fetchClassrooms()
        this.isData = true
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
              this.snackbar = true
              this.message = `Se ha conformado el ${this.classroomModel.description} con ${this.selected.length} alumnos`

              this.classroomModel = null
              this.regionModel = null
              this.selected = []
            }, 1000)
          }
        })
    },
    async downloadExcel() {
      const config = {
        responseType: 'blob' // o blob o arraybuffer
      }
      const response = await axios.get(
        `/api/v2/download-file/excel/${this.courseModel.description}`,
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
    }
  }
}
</script>

<style></style>
