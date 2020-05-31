<template>
  <v-container class="fill-height" fluid>
    <nav-bar-component></nav-bar-component>
    <v-col cols="6" md="4" sm="4" xs="4" lg="4">
      <v-card tile flat align="center" justify="center">
        <v-img
          src="..\assets\logo_iie.jpeg"
          aspect-ratio="1.7"
          max-width="300"
          contain
        ></v-img>
      </v-card>
    </v-col>
    <v-col class="mx-auto" cols="6" md="6" sm="6" xs="6" lg="6">
      <base-card color="blueS" title="Iniciar Sesión">
        <v-form ref="form">
          <v-card-text>
            <base-textfield
              v-model="userEdited.email"
              label="E-mail"
              type="email"
              prepend-icon="mdi-account"
              required
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
              :error-messages="emailErrors"
            ></base-textfield>
            <base-textfield
              v-model="userEdited.password"
              label="Contraseña"
              type="password"
              prepend-icon="mdi-lock"
              required
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
      <v-snackbar color="blueS" v-model="snackbar" :timeout="timeout">
        {{ message }}
        <v-btn text @click="snackbar = false">
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
    userEdited: new User(),
    userDefault: new User(),
    snackbar: false,
    timeout: 3000,
    message: '',
    userCurrent: null
  }),
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user'
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
