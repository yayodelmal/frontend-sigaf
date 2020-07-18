<template>
  <div>
    <nav-bar-component app></nav-bar-component>
    <v-main>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12">
            <v-img
              src="..\assets\iie_web@2x.png"
              contain
              max-height="150"
            ></v-img>
          </v-col>

          <v-col cols="12">
            <base-card
              color="blueS"
              title="Iniciar Sesión"
              max-width="400px"
              class="mx-auto mt-8"
              v-show="!dialogLogin"
            >
              <v-form ref="form">
                <v-card-text>
                  <base-textfield
                    v-model="userEdited.email"
                    label="E-mail"
                    type="email"
                    prepend-icon="mdi-account"
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                    :error-messages="emailErrors"
                  ></base-textfield>
                  <base-textfield
                    v-model="userEdited.password"
                    label="Contraseña"
                    type="password"
                    prepend-icon="mdi-lock"
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                    @keypress.enter="submit"
                    :error-messages="passwordErrors"
                  ></base-textfield>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <base-button
                    icon="mdi-check-circle"
                    label="Entrar"
                    @click="submit"
                  ></base-button>
                </v-card-actions>
              </v-form>
            </base-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app color="blueS darken-1" dark>
      <v-icon class="ml-2" color="green darken-3">mdi-vuejs</v-icon>

      <v-icon class="ml-2">mdi-vuetify</v-icon>

      <v-icon class="ml-2" color="red"> mdi-laravel</v-icon>

      <v-spacer></v-spacer>
      <v-icon class="ml-2" color="grayS lighten-4"
        >mdi-alpha-s-circle-outline</v-icon
      >
      <v-icon class="ml-2">mdi-alpha-i-circle-outline</v-icon>
      <v-icon class="ml-2">mdi-alpha-g-circle-outline</v-icon>
      <v-icon class="ml-2">mdi-alpha-a-circle-outline</v-icon>
      <v-icon class="ml-2">mdi-alpha-f-circle-outline</v-icon>
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
    <v-snackbar color="blueS" v-model="snackbar" :timeout="timeout">
      {{ message }}
      <v-btn text @click="snackbar = false">
        Cerrar
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="dialogLogin" hide-overlay persistent width="300">
      <v-card color="blueS" dark class="text-center">
        <v-card-text>
          <span class="white--text">Espere un momento</span>
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogFirstLogin" persistent max-width="350">
      <v-card>
        <v-card-title class="headline">Modificar contraseña</v-card-title>
        <v-card-text>
          <label class="text-subtitle-2">Contraseña actual</label>
          <v-text-field
            class="mb-5"
            color="blueS"
            flat
            solo-inverted
            hide-details
            :type="showCurrentPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-onepassword"
            :append-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
            label="* * * * * * * * *"
            @click:append="showCurrentPassword = !showCurrentPassword"
          ></v-text-field>

          <label class="text-subtitle-2">Nueva contraseña</label>
          <v-text-field
            class="mb-5"
            color="blueS"
            flat
            solo-inverted
            hide-details
            :type="showNewPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-onepassword"
            :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            label="* * * * * * * * *"
            @click:append="showNewPassword = !showNewPassword"
          ></v-text-field>
          <label class="text-subtitle-2">Confirmar contraseña</label>
          <v-text-field
            color="blueS"
            flat
            solo-inverted
            hide-details
            :type="showConfirmPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-onepassword"
            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            label="* * * * * * * * *"
            @click:append="showConfirmPassword = !showConfirmPassword"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grayS" depressed dark @click="dialog = false"
            >Cancelar</v-btn
          >
          <v-btn color="blueS" depressed dark @click="dialog = false"
            >ACEPTAR</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Navbar from '../components/my/Navbar'
import User from '../models/User'

import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    'nav-bar-component': Navbar
  },
  mixins: [validationMixin],

  validations: {
    password: { required },
    email: { required, email },
    currentPassword: { required },
    newPassword: { required },
    confirmPassword: { required }
  },
  data: () => ({
    userEdited: new User(),
    userDefault: new User(),
    snackbar: false,
    timeout: 3000,
    message: '',
    userCurrent: null,
    dialogLogin: false,
    dialogFirstLogin: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    dialog: true
  }),
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user',
      isFirstLogin: 'auth/isFirstLogin'
    }),

    // ...mapGetters(['user', 'authenticated']),
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('La contraseña es requerida.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Ingrese un E-mail válido.')
      !this.$v.email.required && errors.push('El E-mail es requerido.')
      return errors
    },
    email() {
      return this.userEdited.email
    },
    password() {
      return this.userEdited.password
    }
  },
  methods: {
    ...mapActions({
      login: 'auth/login',
      attempt: 'auth/attempt'
    }),
    async submit() {
      this.$v.email.$touch()
      this.$v.password.$touch()
      if (!this.$v.$error) {
        this.dialogLogin = true
        const { success, token } = await this.login(this.userEdited)

        if (success) {
          const { success } = await this.attempt(token)
          if (success) {
            if (this.isFirstLogin) {
              this.dialogLogin = false
              this.dialogFirstLogin = true
              console.log('firstLogin')
            } else {
              this.dialogLogin = false
              this.$router.push({ name: 'My' })
            }
          } else {
            this.dialogLogin = false
            this.snackbar = true
            this.message = 'Usuario/contraseña inválidos'
          }
        } else {
          this.dialogLogin = false
          this.snackbar = true
          this.message = 'Usuario/contraseña inválidos'
        }
      }
    },
    clear() {
      this.$v.$reset()
      this.userEdited = Object.assign({}, this.userDefault)
    }
  }
}
</script>

<style scoped></style>
