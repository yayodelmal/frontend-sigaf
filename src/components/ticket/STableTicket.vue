<template>
  <v-data-table
    :headers="headers"
    :search="search"
    :items="parseTickets"
    class="elevation-1"
    :loading="loading"
    loading-text="Cargando... por favor espere"
    calculate-widths
    disable-pagination
    hide-default-footer
    height="400"
    fixed-header
  >
    <template
      v-slot:item.id="{
        item
      }"
    >
      {{ showPosition(item) }}
    </template>
    <template v-slot:item.rut="{ item }">
      {{ item.rut.toUpperCase() }}
    </template>
    <template v-slot:item.fullname="{ item }">
      <v-tooltip color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-label v-on="on"> {{ item.fullname.toUpperCase() }}</v-label>
        </template>
        <span>{{ item.fullname.toUpperCase() }}</span>
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
        size="30"
        :color="item.attemptOfContact === 0 ? 'error' : 'success'"
      >
        <span class="white--text subtitle-1">{{ item.attemptOfContact }}</span>
      </v-avatar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-tooltip color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" class="mr-2" @click.prevent="editItem(item)">
            {{ showIconSearch(item) }}
          </v-icon>
        </template>
        <span>{{ showTooltipSearch(item) }}</span>
      </v-tooltip>
      <v-tooltip color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            v-if="item.showDeleteButton"
            v-on="on"
            @click.prevent="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <span>Eliminar ticket</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
export default {
  props: {
    tickets: Array,
    loading: Boolean,
    search: String
  },
  data: () => ({
    headers: [
      {
        text: '#',
        align: 'center',
        sortable: false,
        width: 50,
        value: 'id',
        class: 'redS--text'
      },
      {
        text: 'RUT',
        width: 120,
        value: 'rut',
        class: 'redS--text'
      },
      {
        text: 'Nombre',
        width: 250,
        value: 'fullname',
        class: 'redS--text'
      },
      {
        text: 'Tipo',
        value: 'typeTicket',
        class: 'redS--text'
      },
      {
        text: 'Estado',
        value: 'statusTicket',
        class: 'redS--text'
      },
      {
        text: 'Prioridad',
        width: 80,
        value: 'priorityTicket',
        class: 'redS--text'
      },

      {
        text: 'Antigüedad (días)',
        align: 'center',
        width: 100,
        value: 'ageTicket',
        class: 'redS--text'
      },
      {
        text: 'Fecha creación',
        align: 'center',
        value: 'createdAt',
        width: 120,
        class: 'redS--text'
      },
      /*       {
        text: 'Fecha cierre',
        align: 'center',
        value: 'closingDate',
        width: 150,
        class: 'redS--text'
      }, */
      {
        text: `Operador`,
        align: 'center',
        width: 130,
        value: 'operator',
        class: 'redS--text'
      },
      {
        text: 'Intentos',
        align: 'center',
        value: 'attemptOfContact',
        class: 'redS--text'
      },
      {
        text: 'Opciones',
        value: 'actions',
        sortable: false,
        width: 90,
        class: 'redS--text'
      }
    ]
  }),
  computed: {
    ...mapGetters({
      loggedUser: 'auth/user'
    }),
    parseTickets() {
      if (!this.tickets) return this.tickets
      return this.tickets.map(({ properties, relationships, links }) => {
        const ticket = properties
        const attemptOfContact = relationships.numberOfElements
        const user = properties.courseRegisteredUser.registered_user
        return {
          id: ticket.id,
          rut: user.rut,
          fullname: `${user.name} ${user.last_name} ${user.mother_last_name}`,
          statusTicket: ticket.statusTicket.description,
          priorityTicket: ticket.priorityTicket.description,
          typeTicket: ticket.typeTicket.description,
          closingDate: ticket.closingDate,
          createdAt: `${ticket.createdAt} ${ticket.timeCreatedAt}`,
          ageTicket: `${ticket.ageTicket}`,
          operator: ticket.userAssigned.name,
          attemptOfContact: attemptOfContact,
          immutableTicket: { properties, relationships, links }
        }
      })
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
    async editItem({ immutableTicket }) {
      console.log(immutableTicket)
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
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
