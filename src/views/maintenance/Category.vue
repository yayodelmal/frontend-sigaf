<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-hammer-wrench"
      title="Categoría de curso"
    >
      <sigaf-skeleton-loader
        v-if="loading"
        :transition="transition"
        :loading="loading"
      ></sigaf-skeleton-loader>
      <sigaf-datatable
        v-else
        :items="categoriesItems"
        :headers="headers"
        :button-name="buttonName"
        :loading="loading"
        :items-per-page="5"
        @createItem="createCategory"
        @editItem="editItem"
        @deleteItem="deleteItem"
      ></sigaf-datatable>
    </base-card>
    <sigaf-dialog
      :dialog="dialog"
      :form-title="formTitle"
      :loading="loading"
      :loading-save="loadingSave"
      @close="close"
      @save="save"
    >
      <template v-slot:default>
        <v-row>
          <v-col cols="8">
            <base-textfield
              v-model="editedItem.description"
              label="Nombre"
              @input="$v.description.$touch()"
              @blur="$v.description.$touch()"
              :error-messages="descriptionErrors"
            ></base-textfield>
          </v-col>
          <v-col cols="4">
            <base-textfield
              v-model="editedItem.categoryCode"
              label="Código"
              @input="$v.categoryCode.$touch()"
              @blur="$v.categoryCode.$touch()"
              :error-messages="categoryCodeErrors"
            ></base-textfield>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <base-autocomplete
              v-model="editedItem.platform"
              :items="platformsItems"
              label="Plataforma"
              item-value="id"
              item-text="description"
              return-object
              @change="$v.platform.$touch()"
              @blur="$v.platform.$touch()"
              :error-messages="platformErrors"
            ></base-autocomplete>
          </v-col>
          <v-col cols="4">
            <base-textfield
              v-model="editedItem.idCategoryMoodle"
              label="Id Moodle"
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
import Category from '../../models/Category'
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  maxLength,
  numeric,
  minValue,
  maxValue
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
      minLength: minLength(7),
      maxLength: maxLength(150)
    },
    categoryCode: {
      required
    },
    platform: {
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
    buttonName: 'Crear categoría',
    headers: [
      {
        text: 'Nombre',
        value: 'description'
      },
      {
        text: 'Código',
        value: 'categoryCode'
      },
      {
        text: 'ID moodle',
        value: 'idCategoryMoodle'
      },
      {
        text: 'Plataforma',
        value: 'platform.properties.description'
      },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false
      }
    ],
    editedIndex: -1,
    editedItem: new Category(),
    defaultItem: new Category(),
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
      categoriesItems: 'category/categories',
      platformsItems: 'platform/platforms'
    }),
    descriptionErrors() {
      const errors = []

      if (!this.$v.description.$dirty) return errors
      !this.$v.description.required && errors.push('Es obligatorio.')
      !this.$v.description.minLength &&
        errors.push('Debe contener al menos 7 caracteres.')
      !this.$v.description.maxLength &&
        errors.push('Debe contener máximo 25 caracteres.')
      return errors
    },
    categoryCodeErrors() {
      const errors = []

      if (!this.$v.categoryCode.$dirty) return errors
      !this.$v.categoryCode.required && errors.push('Es obligatorio.')

      return errors
    },
    platformErrors() {
      const errors = []

      if (!this.$v.platform.$dirty) return errors
      !this.$v.platform.required && errors.push('Es obligatorio.')

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
      return this.editedIndex === -1 ? 'Crear categoría' : 'Editar categoría'
    },
    description() {
      return this.editedItem.description
    },
    categoryCode() {
      return this.editedItem.categoryCode
    },
    platform() {
      return this.editedItem.platform
    },
    idMoodle() {
      return this.editedItem.idCategoryMoodle
    }
  },
  async created() {
    this.loading = true
    if (this.categoriesItems.length === 0) {
      const { success } = await this.fetchCategoryItems()
      this.loading = !success
    } else {
      this.loading = false
    }
  },
  methods: {
    ...mapActions({
      fetchCategoryItems: 'category/fetchCategories',
      postItem: 'category/postCategory',
      putItem: 'category/putCategory',
      removeItem: 'category/deleteCategory',
      fetchPlatformItems: 'platform/fetchPlatforms'
    }),
    createCategory() {
      this.getPlatforms()
      this.dialog = true
    },
    getPlatforms() {
      if (this.platformsItems.length === 0) {
        this.fetchPlatformItems()
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
      console.log('mostrando item en el papá', item)
      this.getPlatforms()
      this.editedIndex = this.categoriesItems.indexOf(item)

      this.editedItem = Object.assign({}, item)
      this.editedItem.platform = Object.assign({}, item.platform.properties)

      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.categoriesItems.indexOf(item)
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
          category_code: this.editedItem.categoryCode,
          platform_id: this.editedItem.platform.id,
          id_category_moodle: this.editedItem.idCategoryMoodle,
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
