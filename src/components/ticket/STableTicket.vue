<template>
  <v-data-table
    :headers="headers"
    :search="search"
    :items="parseTickets"
    class="elevation-0"
    :loading="loading"
    loading-text="Cargando... por favor espere"
    calculate-widths
    disable-pagination
    hide-default-footer
    height="400"
    fixed-header
    :header-props="{ sortIcon: null }"
  >
    <template v-slot:item.code="{ item }">
      <span class="caption font-weight-bold"> {{ item.code }}</span>
    </template>
    <template v-slot:item.rut="{ item }">
      <span class="caption">{{ item.rut.toUpperCase() }}</span>
    </template>
    <template v-slot:item.fullname="{ item }">
      <v-tooltip color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-label v-on="on">
            <span class="caption"> {{ item.fullname.toUpperCase() }}</span>
          </v-label>
        </template>
        <span class="caption">{{ item.fullname.toUpperCase() }}</span>
      </v-tooltip>
    </template>
    <template v-slot:item.typeTicket="{ item }">
      <v-tooltip color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">{{ getTypeTicket(item.typeTicket) }}</v-icon>
        </template>
        <span>{{ item.typeTicket }}</span>
      </v-tooltip>
    </template>
    <template v-slot:item.statusTicket="{ item }">
      <v-tooltip color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">{{ getStatusTicket(item.statusTicket) }}</v-icon>
        </template>
        <span>{{ item.statusTicket }}</span>
      </v-tooltip>
    </template>
    <template v-slot:item.priorityTicket="{ item }">
      <v-chip small :color="getColor(item.priorityTicket)" dark label>{{
        item.priorityTicket.toUpperCase()
      }}</v-chip>
    </template>
    <template v-slot:item.attemptOfContact="{ item }">
      <v-avatar
        size="25"
        :color="item.attemptOfContact === 0 ? 'error' : 'success'"
      >
        <span class="white--text caption">{{ item.attemptOfContact }}</span>
      </v-avatar>
    </template>
    <template v-slot:item.ageTicket="{ item }">
      <span class="caption"> {{ addDayWord(item.ageTicket) }}</span>
    </template>
    <template v-slot:item.operator="{ item }">
      <span class="caption">{{ item.operator.toUpperCase() }}</span>
    </template>
    <template v-slot:item.createdAt="{ item }">
      <span class="caption">{{ item.createdAt.toUpperCase() }}</span>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-tooltip color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            :loading="loadingEditingButton"
            class="mr-2"
            icon
            @click.prevent="editItem(item)"
          >
            <v-icon>
              {{ showIconSearch(item) }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ showTooltipSearch(item) }}</span>
      </v-tooltip>

      <v-tooltip v-if="showDeleteButton(item)" color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click.prevent="deleteItem(item)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <span>Eliminar ticket</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'

const HEADER_CLASS = 'blueS white--text'
export default {
  props: {
    tickets: Array,
    loading: Boolean,
    search: String
  },
  data: () => ({
    headers: [
      {
        text: 'Prioridad',
        width: 80,
        value: 'priorityTicket',
        class: HEADER_CLASS
      },
      {
        text: 'Código',
        width: 130,
        sortable: false,
        value: 'code',
        class: HEADER_CLASS
      },
      {
        text: 'Opciones',
        value: 'actions',
        sortable: false,
        width: 120,
        class: HEADER_CLASS
      },
      {
        text: 'Rut',
        width: 120,
        value: 'rut',
        class: HEADER_CLASS
      },
      {
        text: 'Nombre',
        width: 200,
        value: 'fullname',
        class: HEADER_CLASS
      },
      {
        text: 'Motivo',
        value: 'motiveTicket',
        class: HEADER_CLASS
      },
      {
        text: 'Tipo',
        value: 'typeTicket',
        class: HEADER_CLASS
      },
      {
        text: 'Estado',
        value: 'statusTicket',
        class: HEADER_CLASS
      },

      {
        text: 'Antigüedad',
        align: 'center',
        width: 100,
        value: 'ageTicket',
        class: HEADER_CLASS
      },
      {
        text: 'Fecha creación',
        align: 'center',
        value: 'createdAt',
        width: 120,
        class: HEADER_CLASS
      },
      {
        text: `Operador`,
        align: 'center',
        width: 130,
        value: 'operator',
        class: HEADER_CLASS
      },
      {
        text: 'Intentos',
        align: 'center',
        value: 'attemptOfContact',
        class: HEADER_CLASS
      }
    ],
    loadingEditingButton: false
  }),
  created() {
    const lenght = this.tickets.length
    console.log(lenght)

    for (let index = 0; index < lenght.length; index++) {
      this.loadingEditingButton[index] = false
    }
  },
  computed: {
    ...mapGetters({
      loggedUser: 'auth/user'
    }),
    parseTickets() {
      if (!this.tickets) return this.tickets
      return this.tickets.map(
        ({ properties, relationships, links, showDeleteButton, close }) => {
          const ticket = properties
          const attemptOfContact = relationships.numberOfElements
          const user = properties.courseRegisteredUser.registered_user
          return {
            id: ticket.id,
            code: ticket.ticketCode,
            rut: user.rut,
            fullname: `${user.name} ${user.last_name} ${user.mother_last_name}`,
            statusTicket: ticket.statusTicket.description,
            priorityTicket: ticket.priorityTicket.description,
            motiveTicket: ticket.motiveTicket.description,
            typeTicket: ticket.typeTicket.description,
            closingDate: ticket.closingDate,
            createdAt: `${ticket.createdAt} ${ticket.timeCreatedAt}`,
            ageTicket: `${ticket.ageTicket}`,
            operator: ticket.userAssigned.name,
            attemptOfContact: attemptOfContact,
            immutableTicket: { properties, relationships, links },
            showDeleteButton: showDeleteButton,
            close: close
          }
        }
      )
    }
  },
  methods: {
    ...mapActions({
      findLogEditingTicketByTicket:
        'logEditingTicket/findLogEditingTicketByTicket',
      findTicket: 'ticket/findTicket',
      postLogEditingTicket: 'logEditingTicket/postLogEditingTicket',
      findTicketDetailByTicket: 'ticket/findTicketDetailByTicket'
    }),
    ...mapMutations({
      PUT_TICKET: 'ticket/PUT_TICKET'
    }),
    showDeleteButton(event) {
      return event.showDeleteButton
    },
    addDayWord(ageTicket) {
      if (ageTicket === 1) return `${ageTicket} día`
      return `${ageTicket} días`
    },
    showPosition(ticket) {
      const index = this.parseTickets.findIndex(find => {
        return find.id === ticket.id
      })
      return index + 1
    },
    getTypeTicket(type) {
      if (type === 'Correo electrónico') return 'mdi-email'
      else if (type === 'Contacto telefónico') return 'mdi-phone'
      else return 'error'
    },
    getStatusTicket(status) {
      if (status === 'Abierto') return 'mdi-lock-open-outline'
      else if (status === 'Cerrado') return 'mdi-lock'
      else return 'error'
    },
    getColor(priority) {
      if (priority === 'Alta') return 'red'
      else if (priority === 'Media') return 'orange'
      else return 'green'
    },
    showIconSearch(item) {
      return item.close ? 'mdi-email-search' : 'mdi-chat-plus'
    },
    showTooltipSearch(item) {
      return item.close ? 'Ver ticket' : 'Agregar contacto'
    },
    async editItem({ immutableTicket, close }) {
      this.loadingEditingButton = true

      if (close) {
        const url = immutableTicket.relationships.links.href

        const { _data } = await this.findTicketDetailByTicket(url)

        this.$emit('showItem', {
          editedTicketDetails: _data.relationships.collection.data,
          editedTicketItem: immutableTicket,
          showSingleShowModal: true,
          singleShowModal: true
        })
        setTimeout(() => {
          this.loadingEditingButton = false
        }, 2000)
      } else {
        const ticket = immutableTicket.properties
        const response = await this.findLogEditingTicketByTicket(ticket.id)
        if (response.statusCode === 204) {
          const res = await this.findTicket(ticket)
          const version = res._data.properties.version

          if (version !== ticket.version) {
            this.PUT_TICKET(res._data)
          }
          await this.postLogEditingTicket({
            ticket_id: ticket.id,
            user_id: this.loggedUser.id
          })

          const url = immutableTicket.relationships.links.href

          const { _data } = await this.findTicketDetailByTicket(url)

          if (_data) {
            this.$emit('editTicket', {
              editedTicketDetails: _data.relationships.collection.data,
              editedTicketItem: immutableTicket,
              showSingleEditModal: true,
              singleEditModal: true
            })

            setTimeout(() => {
              this.loadingEditingButton = false
            }, 2000)
          }
        } else {
          this.$emit('showSnackbar', {
            type: 'warning',
            message: 'No se puede editar. Este ticket se ha bloqueado.'
          })
        }
        setTimeout(() => {
          this.loadingEditingButton = false
        }, 2000)
      }
    },
    deleteItem({ immutableTicket }) {
      this.$emit('deleteItem', immutableTicket)
    }
  }
}
</script>

<style lang="scss" scoped></style>
