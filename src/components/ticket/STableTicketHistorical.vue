<template>
  <v-data-table
    :headers="headers"
    :items="parseTickets"
    class="elevation-0 mt-3"
    calculate-widths
    disable-pagination
    hide-default-footer
    height="500"
    fixed-header
    show-expand
    :header-props="{ sortIcon: null }"
    :expanded.sync="expanded"
  >
    <template v-slot:item.code="{ item }">
      <span class="caption font-weight-bold"> {{ item.code }}</span>
    </template>
    <template v-slot:item.sourceTicket="{ item }">
      <v-tooltip color="blueS" bottom>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">{{ getSourceIcon(item.immutableTicket) }}</v-icon>
        </template>
        <span>{{ item.sourceTicket }}</span>
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
    <template v-slot:item.createdAt="{ item }">
      <span class="caption">{{ item.createdAt.toUpperCase() }}</span>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <span class="overline blueS--text">Contactos</span>
        <v-divider />
        <v-simple-table class="ma-2">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  N°
                </th>
                <th class="text-left">
                  Observación
                </th>
                <th class="text-left">
                  Contacto
                </th>
                <th class="text-left">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detail, index) in item.detailTickets" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ detail.comment }}</td>
                <td>
                  {{
                    detail.status_detail_ticket_id === 1 ? 'Exitoso' : 'Fallido'
                  }}
                </td>
                <td>
                  {{
                    new Date(detail.created_at).toLocaleString('es-ES', {
                      timeZone: 'America/Santiago'
                    })
                  }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const HEADER_CLASS = 'blueS white--text'
export default {
  props: {
    courseRegisteredUser: Object
  },
  data: () => ({
    items: [],
    expanded: [],
    singleExpand: false,
    headers: [
      {
        text: 'Código',
        width: 130,
        sortable: false,
        value: 'code',
        class: HEADER_CLASS
      },
      {
        text: 'Motivo',
        value: 'motive',
        class: HEADER_CLASS
      },
      {
        text: 'Origen',
        value: 'sourceTicket',
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
        text: 'Fecha creación',
        align: 'center',
        value: 'createdAt',
        width: 120,
        class: HEADER_CLASS
      },

      {
        text: 'Intentos',
        align: 'center',
        value: 'attemptOfContact',
        class: HEADER_CLASS
      },
      {
        text: 'Ver contactos',
        value: 'data-table-expand',
        sortable: false,
        width: 90,
        class: HEADER_CLASS
      }
    ]
  }),
  async mounted() {
    this.items = await this.findTicketByUser(this.courseRegisteredUser)
  },
  computed: {
    ...mapGetters({
      loggedUser: 'auth/user'
    }),
    parseTickets() {
      if (!this.items) return this.items
      return this.items.map(({ properties, relationships, links }) => {
        const ticket = properties
        const attemptOfContact = relationships.numberOfElements

        return {
          id: ticket.id,
          code: ticket.ticketCode,
          statusTicket: ticket.statusTicket.description,
          sourceTicket: ticket.sourceTicket.description,
          motive: ticket.motiveTicket.description,
          typeTicket: ticket.typeTicket.description,
          createdAt: `${ticket.createdAt} ${ticket.timeCreatedAt}`,
          attemptOfContact: attemptOfContact,
          immutableTicket: { properties, relationships, links },
          detailTickets: relationships.array
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
      findTicketDetailByTicket: 'ticket/findTicketDetailByTicket',
      findTicketByUser: 'ticket/findTicketByUser'
    }),
    getSourceIcon({ properties }) {
      switch (properties.sourceTicket.description) {
        case 'Entrante':
          if (properties.typeTicket.description === 'Correo electrónico')
            return 'mdi-email-receive-outline'
          return 'mdi-phone-incoming'

        case 'Saliente':
          if (properties.typeTicket.description === 'Contacto telefónico')
            return 'mdi-email-send-outline'
          return 'mdi-phone-outgoing'
      }
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
    showTooltipSearch(item) {
      return item.close ? 'Ver ticket' : 'Agregar contacto'
    }
  }
}
</script>

<style lang="scss" scoped></style>
