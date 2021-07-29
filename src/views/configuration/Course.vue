<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-hammer-wrench"
      title="Curso"
    >
      <sigaf-skeleton-loader
        v-if="loading"
        :transition="transition"
        :loading="loading"
      ></sigaf-skeleton-loader>
      <sigaf-datatable
        v-else
        :items="coursesItems"
        :headers="headers"
        :button-name="buttonName"
        :loading="loading"
        :items-per-page="5"
        @createItem="createCourse"
        @editItem="editItem"
        @deleteItem="deleteItem"
      ></sigaf-datatable>
    </base-card>
    <sigaf-dialog
      :dialog="dialog"
      :form-title="formTitle"
      :loading="loading"
      :loading-save="loadingSave"
      :max-width="maxWidth"
      @close="close"
      @save="save"
    >
      <template v-slot:default>
        <v-row>
          <v-col cols="12">
            <base-textfield
              v-model="editedItem.description"
              label="Nombre"
              @input="$v.description.$touch()"
              @blur="$v.description.$touch()"
              :error-messages="descriptionErrors"
            ></base-textfield>
          </v-col>
          <v-col cols="6">
            <base-textfield
              v-model="editedItem.email"
              label="Correo electrónico"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
              :error-messages="emailErrors"
            ></base-textfield>
          </v-col>
          <v-col cols="6">
            <base-textfield
              v-model="editedItem.password"
              label="Contraseña"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              :error-messages="passwordErrors"
            ></base-textfield>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <base-autocomplete
              v-model="editedItem.category"
              :items="categoriesItems"
              label="Categoría"
              item-value="id"
              item-text="description"
              return-object
              @change="$v.category.$touch()"
              @blur="$v.category.$touch()"
              :error-messages="categoryErrors"
            ></base-autocomplete>
          </v-col>
          <v-col cols="4">
            <base-textfield
              v-model="editedItem.idCourseMoodle"
              label="Id Moodle"
              required
              clearable
              @input="$v.idMoodle.$touch()"
              @blur="$v.idMoodle.$touch()"
              :error-messages="idMoodleErrors"
            ></base-textfield>
          </v-col>
        </v-row>
      </template>
    </sigaf-dialog>
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
  </div>
</template>

<script>
import Course from '../../models/Course'
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  maxLength,
  numeric,
  minValue,
  maxValue,
  email
} from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import SigafSnackbar from '../../components/component/Snackbar'
import { Snackbar } from '../../utils/constants'
import ConfirmDialog from '../../components/component/ConfirmCard'
import SigafSkeletonLoader from '../../components/maintenance/SigafSkeletonLoader.vue'
import SigafDatatable from '../../components/maintenance/SigafDatatable.vue'
import SigafDialog from '../../components/maintenance/SigafDialog.vue'

export default {
  inject: ['theme'],
  mixins: [validationMixin],
  components: {
    SigafSnackbar,
    ConfirmDialog,
    SigafSkeletonLoader,
    SigafDatatable,
    SigafDialog
  },
  validations: {
    description: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(150)
    },
    email: {
      required,
      email
    },
    password: {
      required
    },
    category: {
      required
    },
    idMoodle: {
      numeric,
      minValue: minValue(100),
      maxValue: maxValue(999999)
    }
  },
  data: () => ({
    dialog: false,
    dialogConfirm: false,
    buttonName: 'Importar curso',
    maxWidth: '700px',
    headers: [
      {
        text: 'Nombre',
        value: 'description'
      },
      {
        text: 'Correo electrónico',
        value: 'email'
      },
      {
        text: 'Contraseña',
        value: 'password'
      },
      {
        text: 'ID moodle',
        value: 'idCourseMoodle'
      },
      {
        text: 'Categoría',
        value: 'category.properties.description'
      },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false
      }
    ],
    editedIndex: -1,
    editedItem: new Course(),
    defaultItem: new Course(),
    message: '',
    snackbar: false,
    type: '',
    loading: false,
    transition: 'scale-transition',
    loadingSave: false,
    snakResponse: null,
    search: ''
  }),
  computed: {
    ...mapGetters({
      coursesItems: 'course/courses',
      categoriesItems: 'category/categories'
    }),
    descriptionErrors() {
      const errors = []

      if (!this.$v.description.$dirty) return errors
      !this.$v.description.required && errors.push('Es obligatorio.')
      !this.$v.description.minLength &&
        errors.push('Debe contener al menos 10 caracteres.')
      !this.$v.description.maxLength &&
        errors.push('Debe contener máximo 100 caracteres.')
      return errors
    },
    emailErrors() {
      const errors = []

      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required && errors.push('Es obligatorio.')
      !this.$v.email.email && errors.push('Correo electrónico inválido.')

      return errors
    },
    passwordErrors() {
      const errors = []

      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Es obligatorio.')

      return errors
    },
    categoryErrors() {
      const errors = []

      if (!this.$v.category.$dirty) return errors
      !this.$v.category.required && errors.push('Es obligatorio.')

      return errors
    },
    idMoodleErrors() {
      const errors = []

      if (!this.$v.idMoodle.$dirty) return errors
      !this.$v.idMoodle.numeric && errors.push('Debe ser un número válido.')
      !this.$v.idMoodle.minValue &&
        errors.push('Debe contener al menos 3 cifras.')
      !this.$v.idMoodle.maxValue &&
        errors.push('Debe contener máximo 6 cifras.')
      return errors
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Crear curso' : 'Editar curso'
    },
    description() {
      return this.editedItem.description
    },
    email() {
      return this.editedItem.email
    },
    password() {
      return this.editedItem.password
    },
    category() {
      return this.editedItem.category
    },
    idMoodle() {
      return this.editedItem.idCourseMoodle
    }
  },
  async created() {
    this.loading = true
    if (this.coursesItems.length === 0) {
      const { success } = await this.fetchCourseItems()
      this.loading = !success
    } else {
      this.loading = false
    }
  },
  methods: {
    ...mapActions({
      fetchCourseItems: 'course/fetchCourses',
      postItem: 'course/postCourse',
      putItem: 'course/putCourse',
      removeItem: 'course/deleteCourse',
      fetchCategoryItems: 'category/fetchCategories'
    }),
    createCourse() {
      this.getCategories()
      this.dialog = true
    },
    getCategories() {
      if (this.categoriesItems.length === 0) {
        this.fetchCategoryItems()
      }
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
    editItem(item) {
      this.getCategories()
      this.editedIndex = this.coursesItems.indexOf(item)

      this.editedItem = Object.assign({}, item)

      this.editedItem.category = Object.assign({}, item.category.properties)

      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.coursesItems.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogConfirm = true
    },
    async confirmDelete() {
      const { success } = await this.removeItem(this.editedItem)

      if (success) {
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
    async save() {
      this.$v.$touch()
      if (!this.$v.$error) {
        this.loadingSave = true
        let dataStore = Object.assign(this.editedItem, {
          category_id: this.editedItem.category.id,
          id_course_moodle: this.editedItem.idCourseMoodle,
          status: 1
        })
        if (this.editedIndex > -1) {
          const { success } = await this.putItem(dataStore)
          if (success) {
            this.responseSuccessMessage()
          } else {
            this.responseErrorMessage()
          }
        } else {
          const { success } = await this.postItem(dataStore)
          if (success) {
            this.responseSuccessMessage()
          } else {
            this.responseErrorMessage()
          }
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
      this.$v.$reset()
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    }
  }
}
</script>
