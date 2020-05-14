<template>
  <v-container class="fill-height orange lighten-5" fluid>
    <nav-bar-component></nav-bar-component>
    <v-col class="mx-auto" cols="12" sm="8" md="4">
      <v-card>
        <v-toolbar flat color="secondary" dark>
          <v-toolbar-title>Iniciar sesión</v-toolbar-title>
        </v-toolbar>
        <v-form>
          <v-card-text>
            <v-text-field
              v-model="userEdited.email"
              label="E-mail"
              type="email"
              prepend-icon="mdi-account"
              required
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
              :error-messages="emailErrors"
            ></v-text-field>
            <v-text-field
              v-model="userEdited.password"
              label="Contraseña"
              type="password"
              prepend-icon="mdi-lock"
              required
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              :error-messages="passwordErrors"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="mr-4"
              text
              rounded
              dark
              color="secondary"
              @click="submit"
              >Entrar</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ message }}
        <v-btn color="blue" text @click="snackbar = false">
          Cerrar
        </v-btn>
      </v-snackbar>
    </v-col>
  </v-container>
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
    email: { required, email }
  },
  data: () => ({
    userEdited: new User('', ''),
    userDefault: new User('', ''),
    snackbar: false,
    timeout: 3000,
    message: ''
  }),
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user'
    }),
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
      this.$v.$touch()

      if (!this.$v.$error) {
        const { success, token } = await this.login(this.userEdited)

        if (success) {
          const { success } = await this.attempt(token)
          if (success) {
            this.$router.push({ name: 'My' })
          } else {
            this.snackbar = true
            this.message = 'Usuario/contraseña inválidos'
          }
        } else {
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
