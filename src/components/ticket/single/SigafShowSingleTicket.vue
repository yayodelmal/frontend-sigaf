<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card color="grey lighten-4">
      <v-card-title>
        <span class="headline">Resumen ticket</span>
        <v-spacer></v-spacer>
        <v-btn color="blueS" text @click="clearTicket">Cerrar</v-btn>
      </v-card-title>
      <v-divider class="mb-3" />
      <v-container class="fill-height" fluid>
        <v-card-text>
          <v-row class="d-flex align-center">
            <v-col cols="12" sm="6" md="4" lg="4" class="d-flex justify-center">
              <v-card width="350">
                <v-card-title class="blueS--text darken-1">
                  Alumno
                </v-card-title>
                <v-divider></v-divider>
                <div class="d-flex text-center">
                  <sigaf-card-data-student
                    :backgroundColor="true"
                    :user="user"
                  />
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="8" lg="8">
              <v-row>
                <v-col cols="12">
                  <v-card height="250">
                    <v-card-title class="blueS--text darken-1">
                      Ticket
                      <v-spacer></v-spacer>
                      <v-chip
                        :color="ticketInformation.priority.backgroundColor"
                        label
                        text-color="white"
                        class="overline font-weight-bold"
                      >
                        <v-icon left>
                          mdi-alarm-light
                        </v-icon>
                        Prioridad: {{ ticketInformation.priority.value }}
                      </v-chip>
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-card-text>
                      <v-row>
                        <v-col cols="4">
                          <v-chip
                            class="ma-2 overline bg-color"
                            color="blueS"
                            pill
                            outlined
                            v-for="(chip, index) in ticketInformation.chips"
                            :key="chip.content"
                          >
                            <span
                              v-if="index === 0"
                              class="font-weight-bold subtitle-1"
                              >{{ chip.content }}</span
                            >
                            <span v-else class="font-weight-bold">{{
                              chip.content
                            }}</span>
                            <v-icon class="mr-1" right>
                              {{ chip.icon }}
                            </v-icon>
                          </v-chip>
                        </v-col>
                        <v-divider vertical class="mx-3" />
                        <v-col cols="6">
                          <v-list dense class="mt-n3">
                            <v-list-item
                              v-for="item in ticketInformation.list"
                              :key="item.title"
                            >
                              <v-list-item-title v-text="item.title" />
                              <v-list-item-icon>:</v-list-item-icon>
                              <v-list-item-subtitle
                                v-if="item.title === 'Motivo'"
                                v-text="item.value"
                                class="text-left text-uppercase"
                              />
                              <v-list-item-subtitle
                                v-else
                                v-text="item.value"
                                class="text-left text-capitalize"
                              />
                            </v-list-item>
                          </v-list>
                        </v-col>
                        <v-col
                          cols="1"
                          class="d-flex flex-column  mt-5 align-center text-center"
                        >
                          <span class="subtitle-2">Tolal intentos</span>
                          <v-avatar
                            size="56"
                            class=" headline white--text mt-2"
                            color="blueS lighten-1"
                          >
                            {{ ticketInformation.numberOfTicketDetails }}
                          </v-avatar>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="7">
                  <v-card height="370">
                    <v-card-title class="blueS--text darken-1">
                      Detalle de intentos de contacto
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-virtual-scroll
                      :items="detailsTicketsMap"
                      :item-height="100"
                      height="300"
                    >
                      <template v-slot:default="{ item, index }">
                        <v-list three-line>
                          <v-subheader
                            class="body-1 blueS--text font-weight-bold"
                            v-text="item.header"
                            v-if="item.header"
                            :key="item.header"
                          ></v-subheader>

                          <v-divider
                            v-else-if="item.divider"
                            :key="index"
                            :inset="item.inset"
                          ></v-divider>

                          <v-list-item
                            :class="item.backgroundColor"
                            v-else
                            :key="item.id"
                          >
                            <v-list-item-avatar>
                              <v-avatar
                                size="56"
                                class="white--text"
                                :color="item.icon.color"
                              >
                                {{ item.avatar }}
                              </v-avatar>
                            </v-list-item-avatar>

                            <v-list-item-content>
                              <v-list-item-title
                                v-html="item.title"
                              ></v-list-item-title>

                              <v-tooltip :color="item.icon.color" bottom>
                                <template v-slot:activator="{ on }">
                                  <v-list-item-subtitle
                                    v-on="on"
                                    v-html="item.subtitleHTML"
                                  ></v-list-item-subtitle>
                                </template>
                                <span>Observación: "{{ item.subtitle }}"</span>
                              </v-tooltip>
                            </v-list-item-content>

                            <v-list-item-action class="d-flex">
                              <v-list-item-action-text class="mx-auto"
                                >Creado el</v-list-item-action-text
                              >
                              <v-list-item-action-text
                                class="mx-auto"
                                v-html="item.createdAt.date"
                              ></v-list-item-action-text>
                              <v-list-item-action-text
                                class="mx-auto"
                                v-html="item.createdAt.hour"
                              ></v-list-item-action-text>
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </template>
                    </v-virtual-scroll>
                  </v-card>
                </v-col>
                <v-col cols="5">
                  <v-card height="370">
                    <v-card-title class="blueS--text darken-1">
                      Información adicional
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-list dense>
                      <v-list-item
                        v-for="info in aditionalInformation"
                        :key="info.title"
                      >
                        <v-list-item-title v-text="info.title" />
                        <v-list-item-icon>:</v-list-item-icon>
                        <v-list-item-subtitle
                          class="text-left text-capitalize"
                          v-text="info.value"
                        />
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import SigafCardDataStudent from '@/components/utility/SigafCardDataStudent.vue'
import { mapUser } from '@/utils/constants'
export default {
  components: {
    SigafCardDataStudent
  },

  props: {
    value: Boolean,
    selectedCourse: Object,
    ticket: Object,
    ticketDetails: Array
  },
  data: () => ({
    user: {},
    editedTicketItem: {
      id: null,
      source: null,
      type: null,
      motive: null,
      priority: null,
      operator: null,
      status: null,
      courseRegisteredUser: null,
      createdAt: null
    },
    editedDetailTicketItem: {
      statusDetail: null,
      comment: null
    }
  }),
  watch: {
    ticket() {
      this.parseTicket()
    }
  },
  computed: {
    ...mapGetters({
      sections: 'section/sections'
    }),
    ticketInformation() {
      if (!this.ticketDetails) return [{}]

      return {
        chips: [
          {
            content: this.ticket.properties.ticketCode,
            icon: 'mdi-barcode'
          },
          {
            content: this.ticket.properties.typeTicket.description,
            icon: this.getTypeIcon(this.ticket)
          },
          {
            content: this.ticket.properties.sourceTicket.description,
            icon: this.getSourceIcon(this.ticket)
          }
        ],
        list: [
          {
            title: 'Motivo',
            value: this.ticket.properties.motiveTicket.description.toLowerCase()
          },
          {
            title: 'Operador asignado',
            value: this.ticket.properties.userAssigned.name.toLowerCase()
          },
          {
            title: 'Fecha de creación',
            value: `${this.ticket.properties.updatedAt} ${this.ticket.properties.timeCreatedAt}`
          },
          {
            title: 'Fecha de cierre',
            value: `${this.ticket.properties.closingDate} ${this.ticket.properties.timeClosingDate}`
          }
        ],
        numberOfTicketDetails: this.ticketDetails.length,
        priority: {
          backgroundColor: this.getPriorityColor(this.ticket),
          value: this.ticket.properties.priorityTicket.description
        }
      }
    },
    aditionalInformation() {
      if (!this.ticketDetails) return [{}]

      const last = this.ticketDetails[this.ticketDetails.length - 1]
      console.log(last)
      return [
        {
          title: 'Tiempo de respuesta',
          value: `${this.ticket.properties.ageTicket} ${
            this.ticket.properties.ageTicket === 1 ? 'día' : 'días'
          }`.toLowerCase()
        },
        {
          title: 'Creador',
          value: this.ticket.properties.userCreated.name.toLowerCase()
        },
        {
          title: 'Estado cierre',
          value: last.properties.statusDetailTicket.description
        }
      ]
    },
    detailsTicketsMap() {
      if (!this.ticketDetails) return []

      const parseDetails = this.ticketDetails.map(detail => {
        const successAttempt =
          detail.properties.statusDetailTicket.description === 'Exitoso'

        const splitName = detail.properties.userCreated.name.split(' ')
        const splitDate = detail.properties.createdAt.split(' ')

        return {
          id: detail.properties.id,
          avatar: `${splitName[0].charAt(0)} ${splitName[1].charAt(0)}`,
          title: `<span class="font-weight-bold">Intento ${detail.properties.statusDetailTicket.description}</span>`,
          subtitleHTML: `<span class="text--primary">${detail.properties.userCreated.name}</span> &mdash; ${detail.properties.comment}`,
          subtitle: detail.properties.comment,
          createdAt: {
            date: `<em>${splitDate[0]}</em>`,
            hour: `<em>${splitDate[1]} hrs.</em>`
          },
          backgroundColor: successAttempt ? 'green lighten-5' : 'red lighten-5',
          icon: {
            type: successAttempt
              ? 'mdi-check-circle-outline'
              : 'mdi-close-circle-outline',
            color: successAttempt ? 'success' : 'redS'
          }
        }
      })

      return parseDetails

      /*    return [{ header: 'Intentos de contacto' }].concat(
        ...parseDetails.map(detail => [detail, { divider: true, inset: true }])
      ) */
    }
  },
  methods: {
    clearTicket() {
      this.$emit('closeModal', false)
    },
    getTypeIcon({ properties }) {
      switch (properties.typeTicket.description) {
        case 'Correo electrónico':
          return 'mdi-email-outline'

        case 'Contacto telefónico':
          return 'mdi-phone'
      }
    },
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
    getPriorityColor({ properties }) {
      switch (properties.priorityTicket.description) {
        case 'Alta':
          return 'redS'

        case 'Media':
          return 'warning'

        case 'Baja':
          return 'success'
      }
    },
    async parseTicket() {
      if (this.ticket) {
        const editedTicket = this.ticket.properties
        this.editedTicketItem.id = editedTicket.id
        this.editedTicketItem.source = editedTicket.sourceTicket
        this.editedTicketItem.type = editedTicket.typeTicket
        this.editedTicketItem.motive = editedTicket.motiveTicket
        this.editedTicketItem.priority = editedTicket.priorityTicket
        this.editedTicketItem.operator = editedTicket.userAssigned
        this.editedTicketItem.status = editedTicket.statusTicket
        this.editedTicketItem.courseRegisteredUser =
          editedTicket.courseRegisteredUser
        this.editedTicketItem.createdAt = editedTicket.createdAt

        const userTicket = { ...editedTicket.courseRegisteredUser }

        this.user = Object.assign({}, mapUser(userTicket, this.sections))
      }
    }
  }
}
</script>

<style scoped>
.v-chip.v-chip--outlined.v-chip.v-chip {
  background-color: #eceff1 !important;
}
</style>
