<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-hammer-wrench"
      title="Usuario"
    >
      <sigaf-skeleton-loader
        v-if="loading"
        :transition="transition"
        :loading="loading"
      ></sigaf-skeleton-loader>
      <sigaf-datatable
        v-else
        :items="usersItems"
        :headers="headers"
        :button-name="buttonName"
        :loading="loading"
        :items-per-page="5"
        @createItem="createUser"
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
          <v-col cols="6">
            <base-textfield
              label="RUT"
              v-model="editedItem.rut"
              @input="$v.rut.$touch()"
              @blur="$v.rut.$touch()"
              :error-messages="rutErrors"
            ></base-textfield>
          </v-col>
          <v-col cols="6">
            <base-textfield
              label="Nombre"
              v-model="editedItem.name"
              @blur="$v.name.$touch()"
              @input="$v.name.$touch()"
              :error-messages="nameErrors"
            ></base-textfield>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <base-textfield
              label="Teléfono"
              v-model="editedItem.phone"
              @blur="$v.phone.$touch()"
              @input="$v.phone.$touch()"
              :error-messages="phoneErrors"
            ></base-textfield>
          </v-col>
          <v-col cols="6">
            <base-textfield
              label="Celular"
              v-model="editedItem.mobile"
              @blur="$v.mobile.$touch()"
              @input="$v.mobile.$touch()"
              :error-messages="mobileErrors"
            ></base-textfield>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <base-textfield
              label="Correo electrónico"
              v-model="editedItem.email"
              @blur="$v.email.$touch()"
              @input="$v.email.$touch()"
              :error-messages="emailErrors"
            ></base-textfield>
          </v-col>
          <v-col cols="6">
            <base-autocomplete
              label="Rol"
              v-model="editedItem.role"
              :items="rolesItems"
              item-value="id"
              item-text="description"
              return-object
              @blur="$v.role.$touch()"
              @change="$v.role.$touch()"
              :error-messages="roleErrors"
            ></base-autocomplete>
          </v-col>
        </v-row>
      </template>
    </sigaf-dialog>
    <snackbar-component v-model="snackbar" :type="type" :message="message">
    </snackbar-component>
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
import User from '../../models/User'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'

import SnackbarComponent from '../../components/component/Snackbar'
import { Snackbar } from '../../utils/constants'
import ConfirmDialog from '../../components/component/ConfirmCard'
import SigafSkeletonLoader from '../../components/maintenance/SigafSkeletonLoader.vue'
import SigafDatatable from '../../components/maintenance/SigafDatatable.vue'
import SigafDialog from '../../components/maintenance/SigafDialog.vue'

export default {
  mixins: [validationMixin],
  validations: {
    rut: {
      required,
      minLength: minLength(11),
      maxLength: maxLength(12)
    },
    name: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(200)
    },
    phone: {
      minLength: minLength(10),
      maxLength: maxLength(12)
    },
    mobile: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(12)
    },
    email: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(255),
      email
    },
    role: {
      required
    }
  },
  components: {
    SnackbarComponent,
    ConfirmDialog,
    SigafSkeletonLoader,
    SigafDatatable,
    SigafDialog
  },
  data: () => ({
    buttonName: 'Crear usuario',
    maxWidth: '700px',
    headers: [
      {
        text: 'RUT',
        value: 'rut'
      },
      {
        text: 'Nombre',
        value: 'name'
      },
      {
        text: 'Celular',
        value: 'mobile'
      },
      {
        text: 'Correo electrónico',
        value: 'email'
      },
      {
        text: 'Rol',
        value: 'role.description'
      },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false
      }
    ],
    loading: false,
    dialog: false,
    snackbar: false,
    editedIndex: -1,
    editedItem: new User(),
    defaultItem: new User(),
    message: '',
    colorSnackbar: 'blueS',
    type: '',
    loadingSave: false,
    dialogConfirm: false,
    search: '',
    transition: 'scale-transition'
  }),
  computed: {
    ...mapGetters({
      usersItems: 'user/allUsers',
      rolesItems: 'role/roles'
    }),
    rutErrors() {
      const errors = []

      if (!this.$v.rut.$dirty) return errors
      !this.$v.rut.required && errors.push('Es obligatorio.')
      !this.$v.rut.minLength &&
        errors.push('Debe contener al menos 11 caracteres.')
      !this.$v.rut.maxLength &&
        errors.push('Debe contener máximo 12 caracteres.')
      return errors
    },
    nameErrors() {
      const errors = []

      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Es obligatorio.')
      !this.$v.name.minLength &&
        errors.push('Debe contener al menos 10 caracteres.')
      !this.$v.name.maxLength &&
        errors.push('Debe contener máximo 200 caracteres.')
      return errors
    },
    phoneErrors() {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.minLength &&
        errors.push('Debe contener al menos 10 caracteres.')
      !this.$v.phone.maxLength &&
        errors.push('Debe contener máximo 12 caracteres.')
      return errors
    },
    mobileErrors() {
      const errors = []

      if (!this.$v.mobile.$dirty) return errors
      !this.$v.mobile.required && errors.push('Es obligatorio.')
      !this.$v.mobile.minLength &&
        errors.push('Debe contener al menos 10 caracteres.')
      !this.$v.mobile.maxLength &&
        errors.push('Debe contener máximo 12 caracteres.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required && errors.push('Es obligatorio.')
      !this.$v.email.email && errors.push('Correo electrónico inválido.')
      !this.$v.email.minLength &&
        errors.push('Debe contener al menos 10 caracteres.')
      !this.$v.email.maxLength &&
        errors.push('Debe contener máximo 255 caracteres.')
      return errors
    },
    roleErrors() {
      const errors = []
      if (!this.$v.role.$dirty) return errors
      !this.$v.role.required && errors.push('Es obligatorio.')
      return errors
    },
    rut() {
      return this.editedItem.rut
    },
    name() {
      return this.editedItem.name
    },
    phone() {
      return this.editedItem.phone
    },
    mobile() {
      return this.editedItem.mobile
    },
    email() {
      return this.editedItem.email
    },
    role() {
      return this.editedItem.role
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Crear usuario' : 'Editar usuario'
    }
  },
  created() {
    this.loading = true

    this.fetchRoleItems()
    this.fetchUserItems().then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions({
      fetchUserItems: 'user/fetchUsers',
      fetchRoleItems: 'role/fetchRoles',
      postItem: 'user/postUser',
      removeItem: 'user/deleteUser',
      putItem: 'user/putUser'
    }),
    createUser() {
      this.getRoles()
      this.dialog = true
    },
    getRoles() {
      if (this.rolesItems.length !== 0) {
        this.fetchRoleItems()
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
    async save() {
      this.$v.$touch()

      if (!this.$v.$error) {
        this.loadingSave = true
        this.editedItem.password = 'sigaf'
        this.editedItem.isFirstLogin = 0
        this.editedItem.role_id = this.editedItem.role.id

        let response
        if (this.editedIndex > -1) {
          response = await this.putItem(this.editedItem)
        } else {
          response = await this.postItem(this.editedItem)
        }
        if (response.success) {
          this.responseSuccessMessage()
          this.close()
        } else {
          const keys = Object.keys(response.message)
          const hasEmail = 'email'

          if (keys.includes(hasEmail)) {
            this.makeSnakResponse(response.message.email, Snackbar.WARNING.type)
          } else {
            this.responseErrorMessage()
          }
        }
      }
    },
    editItem(user) {
      this.getRoles()
      this.editedItem = Object.assign({}, user)
      this.editedIndex = this.usersItems.findIndex(
        findUser => findUser.id === user.id
      )
    },
    deleteItem(user) {
      this.editedIndex = this.usersItems.indexOf(user)
      this.editedItem = Object.assign({}, user)
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
    close() {
      this.dialog = false
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    clear() {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      this.$v.$reset()
    }
  }
}
</script>

<style lang="scss" scoped></style>
