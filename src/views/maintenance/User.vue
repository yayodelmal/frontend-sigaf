<template>
  <div>
    <base-card color="blueS" class="px-5 py-3" title="Usuario">
      <v-data-table
        :headers="headers"
        :items="usersItems"
        class="elevation-1 grayS--text"
        :loading="loading"
        loading-text="Cargando... por favor espere"
      >
        <template v-slot:progress>
          <v-progress-linear
            :height="3"
            color="blueS"
            indeterminate
          ></v-progress-linear>
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="700" persistent>
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
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6">
                          <base-textfield
                            label="RUT"
                            v-model="editedItem.rut"
                          ></base-textfield>
                        </v-col>
                        <v-col cols="6">
                          <base-textfield
                            label="Nombre"
                            v-model="editedItem.name"
                          ></base-textfield>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6">
                          <base-textfield
                            label="Teléfono"
                            v-model="editedItem.phone"
                          ></base-textfield>
                        </v-col>
                        <v-col cols="6">
                          <base-textfield
                            label="Celular"
                            v-model="editedItem.mobile"
                          ></base-textfield>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6">
                          <base-textfield
                            label="Correo electrónico"
                            v-model="editedItem.email"
                          ></base-textfield>
                        </v-col>
                        <v-col cols="6">
                          <base-autocomplete
                            label="Rol"
                            v-model="roleModel"
                            :items="rolesItems"
                            item-value="id"
                            item-text="description"
                            return-object
                          ></base-autocomplete>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <base-button
                      icon="mdi-check-circle"
                      label="Guardar"
                      @click="save"
                    >
                    </base-button>
                    <v-btn text color="grayS" @click="close">
                      <v-icon size="30" left>mdi-close-circle</v-icon>
                      Cancelar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
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
    </base-card>
    <v-snackbar color="blueS" v-model="snackbar" :timeout="timeout">
      {{ message }}
      <v-btn dark text @click="snackbar = false">
        Cerrar
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import User from '../../models/User'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [validationMixin],
  validations: {
    rut: {
      required,
      minLenght: minLength(11),
      maxLength: maxLength(12)
    },
    name: {
      required,
      minLenght: minLength(10),
      maxLength: maxLength(200)
    },
    mobile: {
      required,
      minLenght: minLength(10),
      maxLength: maxLength(12)
    },
    email: {
      required,
      minLenght: minLength(10),
      maxLength: maxLength(255)
    },
    roleModel: {
      required
    }
  },
  data: () => ({
    headers: [
      { text: '#', value: 'id', class: 'redS--text' },
      { text: 'RUT', value: 'rut', class: 'redS--text' },
      { text: 'Nombre', value: 'name', class: 'redS--text' },
      { text: 'Celular', value: 'mobile', class: 'redS--text' },
      { text: 'Correo electrónico', value: 'email', class: 'redS--text' },
      {
        text: 'Rol',
        value: 'role.description',
        class: 'redS--text'
      },
      {
        text: 'Acciones',
        value: 'actions',
        class: 'redS--text',
        sortable: false
      }
    ],
    loading: false,
    dialog: false,
    snackbar: false,
    timeout: -1,
    editedIndex: -1,
    editedItem: new User(),
    defaultItem: new User(),
    message: null,
    successMessage: 'Operación realizada con éxito.',
    errorMEssage: 'Ha ocurrido un error.',
    roleModel: null
  }),
  computed: {
    ...mapGetters({ usersItems: 'user/allUsers', rolesItems: 'role/roles' }),
    formTitle() {
      return this.editedIndex === -1 ? 'Crear usuario' : 'Editar usuario'
    }
  },
  created() {
    this.fetchRoleItems()
    this.fetchUserItems()
  },
  methods: {
    ...mapActions({
      fetchUserItems: 'user/fetchUsers',
      fetchRoleItems: 'role/fetchRoles'
    }),
    async save() {},
    editItem(item) {
      item
    },
    deleteItem(item) {
      item
    },
    close() {
      setTimeout(() => {
        this.clear()
      }, 300)
    },
    clear() {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.roleModel = null
      this.editedIndex = -1
    }
  }
}
</script>

<style lang="scss" scoped></style>
