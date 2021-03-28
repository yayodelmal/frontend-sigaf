<template>
  <v-card elevation="0" tile class="ma-2">
    <v-row class="bg-gray lighten-4">
      <v-col cols="12">
        <v-toolbar dark color="blueS darken-1">
          <v-spacer />
          <v-text-field
            label="12.345.678-9"
            prepend-inner-icon="mdi-magnify"
            flat
            clearable
            dark
            hide-details
            solo-inverted
            color="blueS"
            v-model="rut"
            :loading="searchRutLoading"
            class="shrink"
          ></v-text-field>

          <v-btn
            class="ml-2"
            depressed
            large
            color="blueS"
            :loading="searchRutLoading"
            @click.stop="fetchUserByRut()"
          >
            BUSCAR
          </v-btn>
          <v-spacer />

          <v-btn
            class="ml-auto"
            color="secondary"
            depressed
            large
            dark
            @click="closeModal"
          >
            Cancelar
          </v-btn>
        </v-toolbar>
      </v-col>
      <v-col class="d-flex text-center" cols="4" v-if="user.fullname">
        <sigaf-container-card
          @showEditForm="editUserForm = !editUserForm"
          :showEditButton="true"
          title="Información alumno"
        >
          <template v-slot:content>
            <sigaf-card-data-student
              v-if="!editUserForm"
              :user="user"
            ></sigaf-card-data-student>
            <s-edit-user-form
              v-else
              :user="user"
              @userUpdate="updateUser"
              @cancelForm="editUserForm = false"
            ></s-edit-user-form>
          </template>
        </sigaf-container-card>
      </v-col>
      <v-col cols="8" v-if="user.fullname">
        <sigaf-container-card title="Historial de tickets">
          <template v-slot:content>
            <s-table-ticket-historical
              @showItem="showItem"
              :courseRegisteredUser="user"
            />
          </template>
        </sigaf-container-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SigafContainerCard from './SigafContainerCard.vue'
import SigafCardDataStudent from './SigafCardDataStudent.vue'
import SEditUserForm from './SEditUserForm.vue'
import STableTicketHistorical from '../ticket/STableTicketHistorical.vue'
import { mapUser } from '../../utils/constants'

export default {
  components: {
    SigafContainerCard,
    SigafCardDataStudent,
    SEditUserForm,
    STableTicketHistorical
  },

  props: {
    value: Boolean,
    selectedCourse: Object
  },
  data: () => ({
    rut: '',
    user: {
      rut: '',
      email: '',
      phone: '',
      fullname: '',
      mobile: ''
    },
    searchRutLoading: false,
    editUserForm: false
  }),
  created() {
    this.fetchSections()
  },
  computed: {
    ...mapGetters({
      sections: 'section/sections'
    })
  },
  methods: {
    ...mapActions({
      findRegisteredUserByRut: 'registeredUser/findRegisteredUserByRut',
      findSpecificUserCourse:
        'courseRegisteredUser/findCourseRegisteredUserByUserCourse',
      fetchSections: 'section/fetchSections'
    }),
    showItem(ticket) {
      this.$emit('showItem', ticket)
    },
    closeModal() {
      this.$emit('closeHistoricalModal')
    },
    updateUser(item) {
      this.$nextTick(() => {
        this.user.registered_user.name = item.name
        this.user.registered_user.last_name = item.last_name
        this.user.registered_user.mother_last_name = item.mother_last_name
        this.user.registered_user.mobile = item.mobile
        this.user.registered_user.phone = item.phone
        this.user.registered_user.email = item.email
        this.editUserForm = false
      })
    },
    async fetchUserByRut() {
      this.searchRutLoading = true

      const vm = this
      setTimeout(async () => {
        const {
          _data,
          statusCode,
          message
        } = await this.findRegisteredUserByRut(this.rut)

        console.log('_data', _data)

        if (statusCode === 204) {
          vm.snackbar = true
          vm.message = message
        } else if (statusCode === 406) {
          vm.snackbar = true
          vm.message = message
        } else if (statusCode === 200) {
          if (_data !== null) {
            const payload = {
              course: this.selectedCourse.id,
              user: _data.id
            }

            const response = await this.findSpecificUserCourse(payload)

            console.log('response', response)

            const userCreated = response._data

            if (userCreated.is_sincronized === 0) {
              vm.snackbar = true
              vm.message = 'El estudiante no se encuentra registrado'
            } else {
              this.user = Object.assign({}, mapUser(userCreated, this.sections))
              console.log('user', this.user)
            }
          } else {
            vm.snackbar = true
            vm.message = 'El estudiantes no se encuentra registrado'
          }
        }
        this.searchRutLoading = false
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped></style>
