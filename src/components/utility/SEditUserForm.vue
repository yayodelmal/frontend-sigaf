<template>
  <div class="pa-3">
    <v-row>
      <v-col cols="12">
        <base-textfield
          color="blueS"
          v-model="editedItem.name"
          clearable
          label="Nombre"
          hide-details
          placeholder="Nombre"
        ></base-textfield>
      </v-col>
      <v-col cols="12">
        <base-textfield
          color="blueS"
          label="Apellido paterno"
          v-model="editedItem.last_name"
          clearable
          hide-details
          placeholder="Apellido paterno"
        ></base-textfield>
      </v-col>
      <v-col cols="12">
        <base-textfield
          label="Apellido materno"
          color="blueS"
          v-model="editedItem.mother_last_name"
          clearable
          hide-details
          placeholder="Apellido materno"
        ></base-textfield>
      </v-col>
      <v-col cols="12">
        <base-textfield
          label="Correo electrónico"
          color="blueS"
          v-model="editedItem.email"
          clearable
          hide-details
          placeholder="Correo electrónico"
        ></base-textfield>
      </v-col>
      <v-col cols="12">
        <base-textfield
          label="Celular"
          color="blueS"
          v-model="editedItem.mobile"
          clearable
          hide-details
          placeholder="Celular"
        ></base-textfield>
      </v-col>
      <v-col cols="12">
        <base-textfield
          label="Teléfono"
          color="blueS"
          v-model="editedItem.phone"
          clearable
          hide-details
          placeholder="Teléfono"
        ></base-textfield>
      </v-col>

      <v-col cols="6">
        <v-btn color="secondary" block @click="cancel">Cancelar</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn color="blueS" block dark @click="handleUpdateUser">
          Aceptar</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    user: Object
  },
  data: () => ({
    editedItem: {
      id: '',
      name: '',
      lastname: '',
      motherLastname: '',
      email: '',
      phone: '',
      mobile: ''
    }
  }),
  mounted() {
    this.fillEditForm()
  },
  methods: {
    ...mapActions({
      updateUser: 'registeredUser/putRegisteredUser'
    }),
    fillEditForm() {
      this.editedItem = {
        id: this.user.registered_user.id,
        name: this.user.registered_user.name,
        last_name: this.user.registered_user.last_name,
        mother_last_name: this.user.registered_user.mother_last_name,
        email: this.user.registered_user.email,
        mobile: this.user.registered_user.mobile,
        phone: this.user.registered_user.phone
      }
    },
    handleUpdateUser() {
      this.updateUser(this.editedItem)
      this.$emit('userUpdate', this.editedItem)
    },
    cancel() {
      this.$nextTick(() => {
        this.editedItem = {
          id: '',
          name: '',
          last_name: '',
          mother_last_name: '',
          email: '',
          phone: '',
          mobile: ''
        }
        this.$emit('cancelForm')
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
