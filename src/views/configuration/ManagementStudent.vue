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
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>
                      <v-card-text> </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <base-button
                          icon="mdi-check-circle"
                          label="Guardar"
                        ></base-button>
                        <v-btn text color="grayS">
                          <v-icon size="30" left>mdi-close-circle</v-icon>
                          Cancelar</v-btn
                        >
                      </v-card-actions>
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
    loading: false
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
    getStudents() {
      this.loadingButton = true
      setTimeout(() => {
        this.fetchUsersByCourse(this.courseModel.id)
        this.loadingButton = false
        this.isData = true
        // this.isData = true
        // this.$vuetify.goTo(300, this.options)
      }, 2000)
    },
    editItem(item) {
      this.dialog = true
      console.log(item)
    },
    deleteItem(item) {
      console.log(item)
    }
  }
}
</script>

<style></style>
