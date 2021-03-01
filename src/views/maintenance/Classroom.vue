<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-hammer-wrench"
      title="Aula"
    >
      <sigaf-skeleton-loader
        v-if="loading"
        :transition="transition"
        :loading="loading"
      ></sigaf-skeleton-loader>
      <sigaf-datatable
        v-else
        :items="items"
        :headers="headers"
        :button-name="buttonName"
        :loading="loading"
        :items-per-page="5"
        @createItem="createItem"
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
          <v-col cols="12">
            <base-textfield
              v-model="editedItem.description"
              label="Nombre"
              @input="$v.description.$touch()"
              @blur="$v.description.$touch()"
              :error-messages="descriptionErrors"
            ></base-textfield>
          </v-col>
        </v-row>
      </template>
    </sigaf-dialog>
    <sigaf-snackbar
      v-model="snackbar"
      :type="type"
      :message="message"
    ></sigaf-snackbar>
    <confirm-dialog
      icon="mdi-alert-circle"
      color-icon="warning"
      :dialog="dialogConfirm"
      :cancel="close"
      :accept="confirmDelete"
    >
      <template v-slot:content>
        <h3 class="text-body-1">
          Eliminará un registro de forma permanente
        </h3>
      </template>
    </confirm-dialog>
  </div>
</template>

<script>
import Classroom from '../../models/Classroom'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import SigafSnackbar from '../../components/component/Snackbar'
import { Snackbar } from '../../utils/constants'
import ConfirmDialog from '../../components/component/ConfirmCard'
import SigafSkeletonLoader from '../../components/maintenance/SigafSkeletonLoader.vue'
import SigafDatatable from '../../components/maintenance/SigafDatatable.vue'
import SigafDialog from '../../components/maintenance/SigafDialog.vue'

export default {
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
      maxLength: maxLength(25)
    }
  },
  data: () => ({
    dialog: false,
    dialogConfirm: false,
    buttonName: 'Crear aula',
    headers: [
      {
        text: '#',
        value: 'id'
      },
      {
        text: 'Nombre',
        value: 'description'
      },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false
      }
    ],
    editedIndex: -1,
    editedItem: new Classroom(),
    defaultItem: new Classroom(),
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
    ...mapGetters({ items: 'classroom/classrooms' }),
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
    formTitle() {
      return this.editedIndex === -1 ? 'Crear aula' : 'Editar aula'
    },
    description() {
      return this.editedItem.description
    }
  },
  async created() {
    this.loading = true
    if (this.items.length === 0) {
      const { success } = await this.fetchItems()
      this.loading = !success
    } else {
      this.loading = false
    }
  },
  methods: {
    ...mapActions({
      fetchItems: 'classroom/fetchClassrooms',
      postItem: 'classroom/postClassroom',
      putItem: 'classroom/putClassroom',
      removeItem: 'classroom/deleteClassroom'
    }),
    createItem() {
      this.dialog = true
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
    resposeErrorMessage() {
      this.makeSnakResponse(Snackbar.ERROR.message, Snackbar.ERROR.type)
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item)

      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogConfirm = true
    },
    async confirmDelete() {
      const { success } = await this.removeItem(this.editedItem)

      if (success) {
        this.responseSuccessMessage()
      } else {
        this.resposeErrorMessage()
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
        if (this.editedIndex > -1) {
          const { success } = await this.putItem(this.editedItem)
          if (success) {
            this.responseSuccessMessage()
          } else {
            this.resposeErrorMessage()
          }
        } else {
          const { success } = await this.postItem(this.editedItem)
          if (success) {
            this.responseSuccessMessage()
          } else {
            this.resposeErrorMessage()
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
