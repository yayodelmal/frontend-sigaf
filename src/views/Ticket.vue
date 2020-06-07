<template>
  <v-row justify="center" align="center">
    <v-col cols="10">
      <base-card
        color="blueS"
        class="px-5 py-3"
        icon="mdi-ticket-account"
        title="Ticket"
      >
        <template v-slot:searchInput>
          <v-row justify="center">
            <v-col cols="12" md="6">
              <base-autocomplete
                v-model="category"
                :items="categoryItems"
                label="Categoria"
                item-value="id"
                item-text="description"
                return-object
              >
              </base-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <base-textfield
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
              ></base-textfield>
            </v-col>
          </v-row>
        </template>
        <v-row>
          <v-col cols="12" md="3">
            <template>
              <v-col cols="12" md="2">
                <v-dialog
                  v-model="dialog"
                  fullscreen
                  hide-overlay
                  transition="dialog-bottom-transition"
                >
                  <template v-slot:activator="{ on }">
                    <base-button
                      icon="mdi-plus-circle"
                      v-on="on"
                      label="Crear Ticket"
                    ></base-button>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Ticket</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-stepper alt-labels non-linear v-model="e1">
                          <v-stepper-header>
                            <v-stepper-step
                              color="redS"
                              dark
                              editable
                              :complete="e1 > 1"
                              step="1"
                              >Destinatario</v-stepper-step
                            >
                            <v-divider></v-divider>
                            <v-stepper-step
                              color="redS"
                              dark
                              editable
                              :complete="e1 > 2"
                              step="2"
                              >Ticket</v-stepper-step
                            >
                            <v-divider></v-divider>
                            <v-stepper-step color="redS" dark editable step="3"
                              >Detalle</v-stepper-step
                            >
                          </v-stepper-header>
                          <v-stepper-items>
                            <v-stepper-content step="1">
                              <form @keydown.enter.prevent="fetchUserByRut()">
                                <v-row>
                                  <v-spacer />
                                  <v-col cols="10" sm="4" md="4">
                                    <base-textfield
                                      label="Rut"
                                      required
                                      color="blueS"
                                      v-model="rut"
                                      clearable
                                      :loading="searchRutLoading"
                                      hint="Formato 12.345.678-9"
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="2" sm="1" md="1">
                                    <v-btn
                                      color="blueS"
                                      elevation="1"
                                      fab
                                      small
                                      dark
                                      @click.stop="fetchUserByRut()"
                                    >
                                      <v-icon>mdi-magnify</v-icon>
                                    </v-btn>
                                  </v-col>
                                  <v-spacer />
                                </v-row>
                              </form>
                              <template v-if="user.isActive !== null">
                                <v-row>
                                  <v-col cols="12" sm="6" md="6">
                                    <v-label>Último acceso:</v-label>
                                    <v-chip
                                      v-if="user"
                                      :color="colorLastAccess"
                                      label
                                      dark
                                      class="ma-2"
                                    >
                                      <v-icon left>{{ iconLastAccess }}</v-icon>
                                      {{ user.last_access_registered_moodle }}
                                    </v-chip>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="6">
                                    <v-label>Estado participante:</v-label>
                                    <v-chip
                                      v-if="user"
                                      :color="colorStatusStudent"
                                      label
                                      dark
                                      class="ma-2"
                                    >
                                      <v-icon left>{{
                                        iconStatusStudent
                                      }}</v-icon>
                                      {{
                                        user.isActive === null
                                          ? ''
                                          : user.isActive
                                          ? 'ACTIVO'
                                          : 'RENUNCIADO'
                                      }}
                                    </v-chip>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="4" md="4">
                                    <base-textfield
                                      label="Nombre"
                                      required
                                      color="blueS"
                                      v-model="
                                        user.registered_user
                                          .name_registered_moodle
                                      "
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="4" md="4">
                                    <base-textfield
                                      label="Correo electrónico"
                                      required
                                      color="blueS"
                                      v-model="
                                        user.registered_user
                                          .email_registered_moodle
                                      "
                                    ></base-textfield>
                                  </v-col>
                                  <v-col cols="12" sm="4" md="4">
                                    <base-textfield
                                      label="Teléfono"
                                      required
                                      color="blueS"
                                      v-model="user.registered_user.mobile"
                                    ></base-textfield>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12">
                                    <base-textfield
                                      label="Curso"
                                      required
                                      dense
                                      v-model="user.course.description"
                                    ></base-textfield>
                                  </v-col>
                                </v-row>
                                <base-button
                                  @click="e1 = 2"
                                  icon="mdi-arrow-right-bold-circle"
                                  label="Continuar"
                                ></base-button>
                                <v-btn
                                  text
                                  color="grayS"
                                  @click="dialog = false"
                                >
                                  <v-icon size="30" left
                                    >mdi-close-circle</v-icon
                                  >
                                  Cancelar</v-btn
                                >
                              </template>
                            </v-stepper-content>

                            <v-stepper-content step="2">
                              <v-row>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="priorityTicketItems"
                                    label="Prioridad"
                                    v-model="priority"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="sourceTicketItems"
                                    label="Origen"
                                    v-model="source"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="typeTicketItems"
                                    label="Tipo"
                                    v-model="type"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="6" md="4">
                                  <v-menu
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on }">
                                      <base-textfield
                                        v-model="dateSingle"
                                        label="Fecha apertura"
                                        readonly
                                        v-on="on"
                                      ></base-textfield>
                                    </template>
                                    <v-date-picker
                                      :weekday-format="getDay"
                                      show-week
                                      landscape
                                      locale="es"
                                      v-model="dateSingle"
                                      header-color="blueS"
                                      color="redS"
                                      @input="menu = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="motiveTicketItems"
                                    label="Motivo"
                                    v-model="motive"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="userItems"
                                    label="Operador"
                                    v-model="operator"
                                    item-value="properties.id"
                                    item-text="properties.name"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                              </v-row>

                              <base-button
                                @click="e1 = 3"
                                icon="mdi-arrow-right-bold-circle"
                                label="Continuar"
                              ></base-button>

                              <v-btn text color="grayS" @click="dialog = false">
                                <v-icon size="30" left>mdi-close-circle</v-icon>
                                Cancelar</v-btn
                              >
                            </v-stepper-content>

                            <v-stepper-content step="3">
                              <v-row>
                                <v-col cols="12" sm="4" md="4">
                                  <base-autocomplete
                                    prepend-icon="mdi-comment"
                                    :items="motiveTicketItems"
                                    label="Motivo"
                                    v-model="motive"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="8" md="8">
                                  <v-textarea
                                    color="blueS"
                                    dense
                                    auto-grow
                                    counter
                                    clearable
                                    clear-icon="mdi-cancel"
                                    label="Observaciones"
                                    rows="1"
                                    prepend-icon="mdi-comment"
                                  ></v-textarea>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col>
                                  <v-label>Estado detalle</v-label>
                                  <v-label>Comentarios</v-label>
                                </v-col>
                                <v-card> </v-card>
                              </v-row>

                              <v-row>
                                <v-spacer />
                                <v-col cols="12" md="4">
                                  <base-autocomplete
                                    :items="statusTicketItems"
                                    label="Estado"
                                    v-model="status"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                              </v-row>
                              <base-button
                                @click="saveTicket()"
                                icon="mdi-arrow-right-bold-circle"
                                label="Generar Ticket"
                              ></base-button>

                              <v-btn text color="grayS" @click="dialog = false">
                                <v-icon size="30" left>mdi-close-circle</v-icon>
                                Cancelar</v-btn
                              >
                            </v-stepper-content>
                          </v-stepper-items>
                        </v-stepper>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blueS" text @click="dialog = false"
                        >Cerrar</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </template>
          </v-col>
          <v-col cols="12" md="3">
            <template>
              <v-col cols="12" md="2">
                <v-dialog
                  v-model="dialogMassive"
                  fullscreen
                  hide-overlay
                  transition="dialog-bottom-transition"
                >
                  <template v-slot:activator="{ on }">
                    <base-button
                      icon="mdi-plus-circle"
                      v-on="on"
                      label="Crear Ticket Masivo"
                    ></base-button>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Ticket</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-stepper alt-labels non-linear v-model="em1">
                          <v-stepper-header>
                            <v-stepper-step
                              color="redS"
                              dark
                              editable
                              :complete="em1 > 1"
                              step="1"
                              >Destinatarios</v-stepper-step
                            >
                            <v-divider></v-divider>
                            <v-stepper-step
                              color="redS"
                              dark
                              editable
                              :complete="em1 > 2"
                              step="2"
                              >Ticket</v-stepper-step
                            >
                            <v-divider></v-divider>
                            <v-stepper-step color="redS" dark editable step="3"
                              >Detalle</v-stepper-step
                            >
                          </v-stepper-header>
                          <v-stepper-items>
                            <v-stepper-content step="1">
                              <v-row justify="center">
                                <v-col cols="12">
                                  <base-autocomplete
                                    v-model="categoryTicket"
                                    :items="categoryItems"
                                    label="Curso"
                                    item-value="id"
                                    item-text="description"
                                    @change="filterUsersByCategoriesTicket()"
                                    return-object
                                    outlined
                                  >
                                  </base-autocomplete>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="8" md="8">
                                  <v-autocomplete
                                    :items="classroomItems"
                                    label="Filtrar aula"
                                    chips
                                    dense
                                    item-text="description"
                                    item-value="description"
                                    return-object
                                    v-model="classrooms"
                                    @change="filterUsersByCategoriesTicket()"
                                    multiple
                                    color="blueS"
                                    outlined
                                  >
                                    <template v-slot:selection="data">
                                      <v-chip
                                        :key="JSON.stringify(data.item)"
                                        v-bind="data.attrs"
                                        :input-value="data.selected"
                                        :disabled="data.disabled"
                                        close
                                        small
                                        @click:close="
                                          data.parent.selectItem(data.item)
                                        "
                                      >
                                        <v-avatar
                                          class="redS whiteS--text"
                                          left
                                          v-text="
                                            `${data.item.description
                                              .split(' ')[0]
                                              .slice(0, 1)
                                              .toUpperCase()}${data.item.description
                                              .split(' ')[1]
                                              .slice(0, 2)
                                              .toUpperCase()}`
                                          "
                                        ></v-avatar>
                                        {{ data.item.description }}
                                      </v-chip>
                                    </template></v-autocomplete
                                  >
                                </v-col>
                                <v-spacer />
                                <v-col cols="12" sm="4" md="4">
                                  <v-text-field
                                    v-model="searchMassiveTicket"
                                    append-icon="mdi-magnify"
                                    label="Buscar"
                                    color="blueS"
                                    dense
                                    outlined
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12">
                                  <v-data-table
                                    v-model="selected"
                                    :headers="headersTicket"
                                    :items="userRegisteredFiltered"
                                    item-key="rut"
                                    show-select
                                    class="elevation-1"
                                    :search="searchMassiveTicket"
                                    disable-pagination
                                    hide-default-footer
                                  >
                                  </v-data-table>
                                </v-col>
                              </v-row>
                              <base-button
                                @click="em1 = 2"
                                icon="mdi-arrow-right-bold-circle"
                                label="Continuar"
                              ></base-button>

                              <v-btn text color="grayS">
                                <v-icon size="30" left>mdi-close-circle</v-icon>
                                Cancelar</v-btn
                              >
                            </v-stepper-content>

                            <v-stepper-content step="2">
                              <v-row>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="priorityTicketItems"
                                    label="Prioridad"
                                    v-model="priority"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="sourceTicketItems"
                                    label="Origen"
                                    v-model="source"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="typeTicketItems"
                                    label="Tipo"
                                    v-model="type"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="6" md="4">
                                  <v-menu
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                  >
                                    <template v-slot:activator="{ on }">
                                      <base-textfield
                                        v-model="dateMassive"
                                        label="Fecha apertura"
                                        readonly
                                        v-on="on"
                                      ></base-textfield>
                                    </template>
                                    <v-date-picker
                                      :weekday-format="getDay"
                                      show-week
                                      landscape
                                      locale="es"
                                      v-model="dateMassive"
                                      header-color="blueS"
                                      color="redS"
                                      @input="menu = false"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="motiveTicketItems"
                                    label="Motivo"
                                    v-model="motive"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="userItems"
                                    label="Operador"
                                    v-model="operator"
                                    item-value="properties.id"
                                    item-text="properties.name"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                              </v-row>

                              <base-button
                                @click="em1 = 3"
                                icon="mdi-arrow-right-bold-circle"
                                label="Continuar"
                              ></base-button>

                              <v-btn text color="grayS" @click="dialog = false">
                                <v-icon size="30" left>mdi-close-circle</v-icon>
                                Cancelar</v-btn
                              >
                            </v-stepper-content>

                            <v-stepper-content step="3">
                              <v-row>
                                <v-col cols="12" sm="4" md="4">
                                  <base-autocomplete
                                    prepend-icon="mdi-comment"
                                    :items="motiveTicketItems"
                                    label="Motivo"
                                    v-model="motive"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="8" md="8">
                                  <v-textarea
                                    color="blueS"
                                    dense
                                    auto-grow
                                    counter
                                    clearable
                                    clear-icon="mdi-cancel"
                                    label="Observaciones"
                                    rows="1"
                                    prepend-icon="mdi-comment"
                                  ></v-textarea>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col>
                                  <v-label>Estado detalle</v-label>
                                  <v-label>Comentarios</v-label>
                                </v-col>
                                <v-card> </v-card>
                              </v-row>

                              <v-row>
                                <v-spacer />
                                <v-col cols="12" md="4">
                                  <base-autocomplete
                                    :items="statusTicketItems"
                                    label="Estado"
                                    v-model="status"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                  ></base-autocomplete>
                                </v-col>
                              </v-row>
                              <base-button
                                @click="em1 = 1"
                                icon="mdi-arrow-right-bold-circle"
                                label="Continuar"
                              ></base-button>

                              <v-btn text color="grayS" @click="dialog = false">
                                <v-icon size="30" left>mdi-close-circle</v-icon>
                                Cancelar</v-btn
                              >
                            </v-stepper-content>
                          </v-stepper-items>
                        </v-stepper>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blueS" text @click="dialogMassive = false"
                        >Cerrar</v-btn
                      >
                      <v-btn color="blueS" text @click="dialogMassive = false"
                        >Crear ticket</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </template>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :search="search"
          :items="tickets"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          class="elevation-1"
          @page-count="pageCount = $event"
          :loading="loading"
          loading-text="Cargando... por favor espere"
        >
          <template
            v-slot:item.courseRegisteredUser.registered_user.rut_registered_moodle="{
              item
            }"
          >
            {{
              item.courseRegisteredUser.registered_user.rut_registered_moodle.toUpperCase()
            }}
          </template>
          <template
            v-slot:item.courseRegisteredUser.registered_user.name_registered_moodle="{
              item
            }"
          >
            <v-tooltip color="blueS" bottom>
              <template v-slot:activator="{ on }">
                <v-label v-on="on">
                  {{
                    item.courseRegisteredUser.registered_user.name_registered_moodle.toUpperCase()
                  }}</v-label
                >
              </template>
              <span>{{ item.courseRegisteredUser.course.description }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.typeTicket.description="{ item }">
            <v-tooltip color="blueS" bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">{{
                  getTypeTicket(item.typeTicket.description)
                }}</v-icon>
              </template>
              <span>{{ item.typeTicket.description }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.statusTicket.description="{ item }">
            <v-tooltip color="blueS" bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">{{
                  getStatusTicket(item.statusTicket.description)
                }}</v-icon>
              </template>
              <span>{{ item.statusTicket.description }}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.priorityTicket.description="{ item }">
            <v-chip
              small
              :color="getColor(item.priorityTicket.description)"
              dark
              label
              >{{ item.priorityTicket.description.toUpperCase() }}</v-chip
            >
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click.prevent="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon @click.prevent="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
        <template v-slot:actions>
          <div class="text-center pt-2">
            <v-pagination
              color="redS"
              v-model="page"
              :length="pageCount"
            ></v-pagination>
          </div>
        </template>
      </base-card>
    </v-col>
    <v-snackbar color="blueS" v-model="snackbar" :timeout="timeout">
      {{ message }}
      <v-btn dark text @click="snackbar = false">
        Cerrar
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
import axios from '../services/axios'
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: '',
      loading: false,
      searchRutLoading: false,
      searchMassiveTicket: '',
      headers: [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: 'id'
        },
        {
          text: 'RUT',
          value: 'courseRegisteredUser.registered_user.rut_registered_moodle'
        },
        {
          text: 'Nombre participante',
          value: 'courseRegisteredUser.registered_user.name_registered_moodle'
        },
        { text: 'Tipo', value: 'typeTicket.description' },
        { text: 'Estado', value: 'statusTicket.description' },
        {
          text: 'Prioridad',
          value: 'priorityTicket.description'
        },
        { text: 'Opciones', value: 'actions', sortable: false }
      ],
      headersTicket: [
        {
          text: 'RUT',
          value: 'registered_user.rut_registered_moodle',
          class: 'redS--text'
        },
        {
          text: 'Nombre participante',
          value: 'registered_user.name_registered_moodle',
          class: 'redS--text'
        },
        { text: 'Aula', value: 'classroom.description', class: 'redS--text' },
        {
          text: 'Última conexión',
          value: 'last_access_registered_moodle',
          class: 'redS--text'
        }
      ],
      courses: [],
      course: {
        id: 0
      },
      category: null,
      categoryTicket: null,
      priority: null,
      source: null,
      type: null,
      motive: null,
      status: null,
      operator: null,
      classrooms: [],
      userRegisteredFiltered: [],
      ticket: {},
      usersCourse: [],
      userCourse: {},
      dialog: false,
      dialogMassive: false,
      singleSelect: false,
      selected: [],
      dateSingle: new Date().toISOString().substr(0, 10),
      dateMassive: new Date().toISOString().substr(0, 10),
      menu: false,
      user: {
        registered_user: {},
        course: {},
        activities: [],
        isActive: null
      },
      rut: '',
      rutACTIVO: '17.057.394-3',
      rutRenunciado: '12.122.260-4',
      e1: 1,
      em1: 1,
      message: '',
      successMessage: 'Operación realizada con éxito.',
      errorMEssage: 'Ha ocurrido un error.',
      snackbar: false,
      timeout: 3000
    }
  },
  methods: {
    ...mapActions({
      fetchItems: 'ticket/fetchTickets',
      fetchCourseItems: 'course/fetchCourses',
      fetchCourseByCategory: 'course/getCoursesByCategory',
      fetchCategoryItems: 'category/fetchCategories',
      fetchCourseRegisteredUserItems:
        'courseRegisteredUser/fetchCourseRegisteredUsers'
    }),

    saveTicket() {
      console.log('save')
    },
    async filterUsersByCategories() {
      if (this.category !== null) {
        await this.fetchCourseByCategory(this.category.getLinkCourses)
        this.coursesByCategory.forEach(course => {
          this.userRegisteredFiltered = this.usersCourse.filter(userCourse => {
            return userCourse.course.id === course.properties.id
          })
        })
      }
    },
    async filterUsersByCategoriesTicket() {
      this.userRegisteredFiltered = []
      if (this.categoryTicket !== null) {
        await this.fetchCourseByCategory(this.categoryTicket.getLinkCourses)
        this.coursesByCategory.forEach(course => {
          if (this.classrooms.length === 0) {
            this.userRegisteredFiltered = this.courseRegisteredUserItems.filter(
              userCourse => {
                return userCourse.course.id === course.properties.id
              }
            )
          } else {
            this.courseRegisteredUserItems.forEach(userCourse => {
              this.classrooms.forEach(classroom => {
                if (
                  userCourse.course.id === course.properties.id &&
                  userCourse.classroom.description === classroom.description
                ) {
                  this.userRegisteredFiltered.push(userCourse)
                }
              })
            })
          }
        })
      }
    },
    async fetchDataCourses() {
      this.loading = true
      const { success, message } = await this.fetchCourseItems()
      if (!success) {
        this.snackbar = true

        this.message = message
      }
      this.loading = false
    },
    async fetchDataCategories() {
      this.loading = true
      const { success, message } = await this.fetchCategoryItems()
      console.log()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
      this.loading = false
    },
    getColor(priority) {
      if (priority === 'Alta') return 'red'
      else if (priority === 'Media') return 'orange'
      else return 'green'
    },
    getTypeTicket(type) {
      if (type === 'Correo electrónico') return 'mdi-email'
      else if (type === 'Contacto telefónico') return 'mdi-phone'
      else return 'error'
    },
    getStatusTicket(status) {
      if (status === 'Abierto') return 'mdi-lock-open'
      else if (status === 'Cerrado') return 'mdi-lock'
      else return 'error'
    },
    getDay(date) {
      const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
      let i = new Date(date).getDay(date)
      return daysOfWeek[i]
    },
    async fetchUserByRut() {
      this.searchRutLoading = true

      const vm = this
      setTimeout(async () => {
        const { data } = await axios.get(`/api/v2/registered-user/${this.rut}`)

        if (data.registeredUser !== null) {
          this.userCourse = data.registeredUser

          const userInter = this.courseRegisteredUserItems.filter(
            userCourse => {
              return userCourse.registered_user.id === this.userCourse.id
            }
          )[0]

          this.user = { ...this.user, ...userInter }

          this.findActivities(this.user.id)
        } else {
          vm.snackbar = true
          vm.message = 'El alumno no se encuentra registrado'
        }

        this.searchRutLoading = false
      }, 1000)
    },
    async findActivities(id) {
      const { data } = await axios.get(
        `/api/v2/activity-course-registered-user/${id}`
      )

      this.user.activities = data.activityCourseRegisteredUser

      this.user.activities.forEach(activity => {
        if (
          activity.activity.description === 'Formulario de Renuncia' &&
          activity.status_moodle === 'Finalizado'
        ) {
          this.user.isActive = false
        } else {
          this.user.isActive = true
        }
      })
    }
  },
  created() {
    this.fetchCourseRegisteredUserItems()
    // this.fetchTickets()
    this.fetchItems()
    this.fetchDataCourses()
    this.fetchDataCategories()
    this.filterUsersByCategories()
  },
  watch: {
    category() {
      if (this.category !== null) {
        this.filterUsersByCategories()
      }
    }
  },
  computed: {
    ...mapGetters({
      items: 'ticket/tickets',
      coursesByCategory: 'course/coursesByCategory',
      categoryItems: 'category/categories',
      courseRegisteredUserItems: 'courseRegisteredUser/courseRegisteredUsers',
      motiveTicketItems: 'motiveTicket/motiveTickets',
      priorityTicketItems: 'priorityTicket/priorityTickets',
      sourceTicketItems: 'sourceTicket/sourceTickets',
      typeTicketItems: 'typeTicket/typeTickets',
      userItems: 'user/users',
      statusTicketItems: 'statusTicket/statusTickets',
      classroomItems: 'classroom/classrooms'
    }),
    colorLastAccess() {
      return this.user.last_access_registered_moodle === 'Nunca'
        ? 'redS'
        : 'blueS'
    },
    colorStatusStudent() {
      return this.user.isActive ? 'blueS' : 'redS'
    },
    iconLastAccess() {
      return this.user.last_access_registered_moodle === 'Nunca'
        ? 'mdi-alert-circle'
        : 'mdi-check-circle'
    },
    iconStatusStudent() {
      return this.user.isActive ? 'mdi-check-circle' : 'mdi-alert-circle'
    },
    coursesComputed() {
      return this.courses
        .map(course => {
          return {
            id: course.properties.id,
            name: course.properties.description,
            status: course.properties.status
          }
        })
        .filter(course => {
          return course.status === 1
        })
    },
    tickets() {
      if (this.courseId !== 0) {
        return this.items.filter(ticket => {
          return ticket.courseRegisteredUser.course.id === this.courseId
        })
      } else {
        return this.items
      }
    },
    courseId() {
      return this.course.id
    },
    activities() {
      return this.user.activities
    }
  }
}
</script>

<style lang="sass" scoped></style>
