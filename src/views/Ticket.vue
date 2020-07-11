<template>
  <v-container>
    <base-card
      color="blueS"
      class="px-5 py-3 mt-10"
      icon="mdi-ticket-account"
      title="Ticket"
    >
      <template v-slot:searchInput>
        <v-card flat outlined>
          <v-card-title>
            Filtrar ticket
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <base-autocomplete
                  v-model="category"
                  :items="categoryItems"
                  label="Curso"
                  item-value="id"
                  item-text="description"
                  return-object
                >
                </base-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="5">
                <base-textfield
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                ></base-textfield>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-row justify="center">
                  <v-checkbox
                    color="redS"
                    v-model="openTicket"
                    label="Abierto"
                  ></v-checkbox>

                  <v-checkbox
                    class="ml-10"
                    color="redS"
                    v-model="closeTicket"
                    label="Cerrado"
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mt-3" flat outlined>
          <v-card-text>
            <v-row justify="center">
              <v-col cols="12" sm="12" md="7" lg="6">
                <template>
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
                        label="Crear ticket individual"
                      ></base-button>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ titleTicket }}</span>
                        <v-spacer></v-spacer>
                        <v-btn color="blueS" text @click="clearTicket"
                          >Cancelar</v-btn
                        >
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-stepper alt-labels non-linear v-model="e1">
                            <v-stepper-header>
                              <v-stepper-step
                                :color="!completeStepOne ? 'redS' : 'green'"
                                dark
                                :complete="completeStepOne"
                                :rules="[() => rulesValueStepOne]"
                                step="1"
                                >Destinatario</v-stepper-step
                              >
                              <v-divider></v-divider>
                              <v-stepper-step
                                :color="!completeStepTwo ? 'redS' : 'green'"
                                dark
                                :complete="completeStepTwo"
                                :rules="[() => rulesValueStepTwo]"
                                step="2"
                                >Ticket</v-stepper-step
                              >
                              <v-divider></v-divider>
                              <v-stepper-step
                                :color="!completeStepThree ? 'redS' : 'green'"
                                dark
                                step="3"
                                :complete="completeStepThree"
                                :rules="[() => rulesValueStepThree]"
                                >Contacto</v-stepper-step
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
                                        :disabled="ticketClose"
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
                                        :disabled="ticketClose"
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
                                        <v-icon left>{{
                                          iconLastAccess
                                        }}</v-icon>
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
                                        :disabled="ticketClose"
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
                                        :disabled="ticketClose"
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
                                        :disabled="ticketClose"
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
                                        :disabled="ticketClose"
                                        label="Curso"
                                        required
                                        dense
                                        v-model="user.course.description"
                                      ></base-textfield>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-spacer />
                                    <v-btn
                                      class="mt-3"
                                      color="blueS"
                                      depressed
                                      dark
                                      @click="
                                        () => {
                                          e1 = 2
                                          completeStepOne = true
                                        }
                                      "
                                    >
                                      Continuar
                                      <v-icon class="ml-3"
                                        >mdi-arrow-right-bold-circle</v-icon
                                      >
                                    </v-btn>
                                  </v-row>
                                </template>
                              </v-stepper-content>

                              <v-stepper-content step="2">
                                <v-row>
                                  <v-col cols="12" sm="4">
                                    <base-autocomplete
                                      :disabled="ticketClose"
                                      :items="sourceTicketItems"
                                      label="Origen"
                                      v-model="source"
                                      item-value="id"
                                      item-text="description"
                                      return-object
                                      @change="setSource($event)"
                                      @blur="$v.source.$touch()"
                                      :error-messages="sourceErrors"
                                    ></base-autocomplete>
                                  </v-col>

                                  <v-col cols="12" sm="4">
                                    <base-autocomplete
                                      :disabled="ticketClose"
                                      :items="typeTicketItems"
                                      label="Tipo"
                                      v-model="type"
                                      item-value="id"
                                      item-text="description"
                                      return-object
                                      @change="setType($event)"
                                      @blur="$v.type.$touch()"
                                      :error-messages="typeErrors"
                                    ></base-autocomplete>
                                  </v-col>
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
                                          disabled
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
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="4">
                                    <base-autocomplete
                                      :disabled="ticketClose"
                                      :items="motiveTicketItems"
                                      label="Motivo"
                                      v-model="motive"
                                      item-value="id"
                                      item-text="description"
                                      return-object
                                      @change="setMotive($event)"
                                      @blur="$v.motive.$touch()"
                                      :error-messages="motiveErrors"
                                    ></base-autocomplete>
                                  </v-col>

                                  <v-col cols="12" sm="4">
                                    <base-autocomplete
                                      :disabled="ticketClose"
                                      :items="priorityTicketItems"
                                      label="Prioridad"
                                      v-model="priority"
                                      item-value="id"
                                      item-text="description"
                                      return-object
                                      @change="setPriority($event)"
                                      @blur="$v.priority.$touch()"
                                      :error-messages="priorityErrors"
                                    ></base-autocomplete>
                                  </v-col>

                                  <v-col cols="12" sm="4">
                                    <base-autocomplete
                                      :disabled="ticketClose"
                                      :items="userItems"
                                      label="Operador"
                                      v-model="operator"
                                      item-value="id"
                                      item-text="name"
                                      return-object
                                      @change="setOperator($event)"
                                      @blur="$v.operator.$touch()"
                                      :error-messages="operatorErrors"
                                    ></base-autocomplete>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-spacer />
                                  <v-btn
                                    dark
                                    depressed
                                    color="grayS"
                                    @click="e1 = 1"
                                  >
                                    <v-icon left
                                      >mdi-arrow-left-bold-circle</v-icon
                                    >
                                    Atrás</v-btn
                                  >
                                  <v-btn
                                    class="ml-3"
                                    color="blueS"
                                    depressed
                                    dark
                                    @click="checkStepTwo"
                                  >
                                    Continuar
                                    <v-icon class="ml-3"
                                      >mdi-arrow-right-bold-circle</v-icon
                                    >
                                  </v-btn>
                                </v-row>
                              </v-stepper-content>
                              <v-stepper-content step="3">
                                <v-row>
                                  <v-col cols="12" sm="4" md="3">
                                    <base-autocomplete
                                      :disabled="ticketClose"
                                      :items="statusDetailTicketItems"
                                      label="Intento de contacto"
                                      v-model="statusDetail"
                                      item-value="id"
                                      item-text="description"
                                      return-object
                                      @change="setStatusDetail($event)"
                                      @blur="$v.statusDetail.$touch()"
                                      :error-messages="statusDetailErrors"
                                    ></base-autocomplete>
                                  </v-col>

                                  <v-col cols="12" sm="8" md="9">
                                    <v-textarea
                                      :disabled="ticketClose"
                                      color="blueS"
                                      v-model="observation"
                                      dense
                                      outlined
                                      auto-grow
                                      counter
                                      clearable
                                      clear-icon="mdi-cancel"
                                      label="Observaciones"
                                      rows="1"
                                      @input="$v.observation.$touch()"
                                      @blur="$v.observation.$touch()"
                                      :error-messages="observationErrors"
                                    ></v-textarea>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col>
                                    <v-card hover>
                                      <v-card-title :class="'blueS--text'">
                                        Intentos de contacto
                                      </v-card-title>
                                      <v-card-text>
                                        <v-simple-table
                                          fixed-header
                                          height="200px"
                                        >
                                          <template v-slot:default>
                                            <thead>
                                              <tr>
                                                <th class="text-left">#</th>
                                                <th class="text-left">
                                                  Intento
                                                </th>
                                                <th
                                                  style="width: 400px;"
                                                  class="text-left"
                                                >
                                                  Observación
                                                </th>
                                                <th class="text-left">
                                                  Fecha
                                                </th>
                                                <th class="text-left">
                                                  Operador
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-for="(item,
                                                index) in ticketDetails"
                                                :key="item.name"
                                              >
                                                <td>{{ index + 1 }}</td>
                                                <td
                                                  :class="
                                                    item.statusDetailTicket
                                                      .description === 'Fallido'
                                                      ? 'redS--text'
                                                      : 'success--text'
                                                  "
                                                >
                                                  {{
                                                    item.statusDetailTicket
                                                      .description
                                                  }}
                                                </td>
                                                <td>
                                                  {{ item.comment }}
                                                </td>
                                                <td>
                                                  {{ item.createdAt }}
                                                </td>
                                                <td>
                                                  {{ item.userCreated.name }}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </template>
                                        </v-simple-table>
                                      </v-card-text>
                                    </v-card>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-spacer />
                                  <v-col cols="12" sm="6" md="4" lg="3">
                                    <base-autocomplete
                                      :disabled="ticketClose"
                                      :items="statusTicketItems"
                                      label="Estado"
                                      v-model="status"
                                      item-value="id"
                                      item-text="description"
                                      return-object
                                      @change="setStatus($event)"
                                      @blur="$v.status.$touch()"
                                      :error-messages="statusErrors"
                                    ></base-autocomplete>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-spacer />
                                  <v-btn
                                    dark
                                    depressed
                                    color="grayS"
                                    @click="e1 = 2"
                                  >
                                    <v-icon left
                                      >mdi-arrow-left-bold-circle</v-icon
                                    >
                                    Atrás</v-btn
                                  >
                                  <v-btn
                                    class="ml-3"
                                    color="blueS"
                                    depressed
                                    :dark="!ticketClose"
                                    :disabled="ticketClose"
                                    @click="saveTicket()"
                                  >
                                    Guardar
                                    <v-icon class="ml-3"
                                      >mdi-arrow-right-bold-circle</v-icon
                                    >
                                  </v-btn>
                                </v-row>
                              </v-stepper-content>
                            </v-stepper-items>
                          </v-stepper>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </template>
              </v-col>
              <v-col cols="12" sm="12" md="5" lg="6">
                <template>
                  <v-dialog
                    v-model="dialogMassive"
                    fullscreen
                    hide-overlay
                    transition="dialog-bottom-transition"
                  >
                    <template v-slot:activator="{ on }">
                      <base-button
                        v-if="isAdmin"
                        icon="mdi-plus-circle"
                        v-on="on"
                        label="Crear Ticket Masivo"
                      ></base-button>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">Ticket masivo</span>
                        <v-spacer />
                        <v-btn color="blueS" text @click="clearTicket"
                          >Cancelar</v-btn
                        >
                      </v-card-title>
                      <v-card-text>
                        <v-stepper alt-labels non-linear v-model="em1">
                          <v-stepper-header>
                            <v-stepper-step
                              :color="!completeStepOne ? 'redS' : 'green'"
                              dark
                              :complete="completeStepOne"
                              :rules="[() => rulesValueStepOne]"
                              step="1"
                              >Destinatarios</v-stepper-step
                            >
                            <v-divider></v-divider>
                            <v-stepper-step
                              :color="!completeStepTwo ? 'redS' : 'green'"
                              dark
                              step="2"
                              :complete="completeStepTwo"
                              :rules="[() => rulesValueStepTwo]"
                              >Ticket</v-stepper-step
                            >
                            <v-divider></v-divider>
                            <v-stepper-step
                              :color="!completeStepThree ? 'redS' : 'green'"
                              dark
                              step="3"
                              :complete="completeStepThree"
                              :rules="[() => rulesValueStepThree]"
                              >Detalle</v-stepper-step
                            >
                          </v-stepper-header>
                          <v-stepper-items>
                            <v-stepper-content step="1">
                              <v-row justify="center">
                                <v-col cols="12" sm="5" md="5" lg="4">
                                  <base-autocomplete
                                    v-model="categoryMassiveTicket"
                                    :items="categoryItems"
                                    label="Curso"
                                    item-value="id"
                                    item-text="description"
                                    @change="
                                      filterUsersByCategoriesTicket()
                                      $v.categoryMassiveTicket.$touch()
                                    "
                                    return-object
                                    outlined
                                    @blur="$v.categoryMassiveTicket.$touch()"
                                    :error-messages="
                                      categoryMassiveTicketErrors
                                    "
                                  >
                                  </base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="4" md="4" lg="4">
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
                                <v-col cols="12" sm="3" md="3" lg="4">
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

                              <v-data-table
                                v-model="selected"
                                :headers="headersTicket"
                                :items="userRegisteredFiltered"
                                item-key="id"
                                show-select
                                class="elevation-1"
                                :search="searchMassiveTicket"
                                disable-pagination
                                hide-default-footer
                              >
                              </v-data-table>
                              <v-row>
                                <v-spacer />
                                <v-btn
                                  class="mt-3"
                                  color="blueS"
                                  depressed
                                  dark
                                  @click="checkStepOne"
                                >
                                  Continuar
                                  <v-icon class="ml-3"
                                    >mdi-arrow-right-bold-circle</v-icon
                                  >
                                </v-btn>
                              </v-row>
                            </v-stepper-content>
                            <v-stepper-content step="2">
                              <v-row>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="sourceTicketItems"
                                    label="Origen"
                                    v-model="source"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                    @change="$v.source.$touch()"
                                    @blur="$v.source.$touch()"
                                    :error-messages="sourceErrors"
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
                                    @change="$v.type.$touch()"
                                    @blur="$v.type.$touch()"
                                    :error-messages="typeErrors"
                                  ></base-autocomplete>
                                </v-col>
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
                                        disabled
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
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="motiveTicketItems"
                                    label="Motivo"
                                    v-model="motive"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                    @change="$v.motive.$touch()"
                                    @blur="$v.motive.$touch()"
                                    :error-messages="motiveErrors"
                                  ></base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="priorityTicketItems"
                                    label="Prioridad"
                                    v-model="priority"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                    @change="$v.priority.$touch()"
                                    @blur="$v.priority.$touch()"
                                    :error-messages="priorityErrors"
                                  ></base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <base-autocomplete
                                    :items="userItems"
                                    label="Operador"
                                    v-model="operator"
                                    item-value="id"
                                    item-text="name"
                                    return-object
                                    @change="$v.operator.$touch()"
                                    @blur="$v.operator.$touch()"
                                    :error-messages="operatorErrors"
                                  ></base-autocomplete>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-spacer />
                                <v-btn
                                  dark
                                  depressed
                                  color="grayS"
                                  @click="em1 = 1"
                                >
                                  <v-icon left
                                    >mdi-arrow-left-bold-circle</v-icon
                                  >
                                  Atrás</v-btn
                                >
                                <v-btn
                                  class="ml-3"
                                  color="blueS"
                                  depressed
                                  dark
                                  @click="checkStepTwo"
                                >
                                  Continuar
                                  <v-icon class="ml-3"
                                    >mdi-arrow-right-bold-circle</v-icon
                                  >
                                </v-btn>
                              </v-row>
                            </v-stepper-content>

                            <v-stepper-content step="3">
                              <v-row>
                                <v-col cols="12" sm="4" md="4">
                                  <base-autocomplete
                                    prepend-icon="mdi-comment"
                                    :items="statusDetailTicketItems"
                                    label="Intento de contacto"
                                    v-model="statusDetailMasive"
                                    item-value="id"
                                    item-text="description"
                                    return-object
                                    v-if="showStatusDetailTicket"
                                  ></base-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="8" md="8">
                                  <v-textarea
                                    v-model="observationMassive"
                                    color="blueS"
                                    dense
                                    auto-grow
                                    counter
                                    v-if="showObservation"
                                    clearable
                                    clear-icon="mdi-cancel"
                                    label="Observaciones"
                                    rows="1"
                                    prepend-icon="mdi-comment"
                                  ></v-textarea>
                                </v-col>
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
                                    @change="$v.status.$touch()"
                                    @blur="$v.status.$touch()"
                                    :error-messages="statusErrors"
                                  ></base-autocomplete>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-spacer />
                                <v-btn
                                  dark
                                  depressed
                                  color="grayS"
                                  @click="em1 = 2"
                                >
                                  <v-icon left
                                    >mdi-arrow-left-bold-circle</v-icon
                                  >
                                  Atrás</v-btn
                                >
                                <v-btn
                                  :disabled="ticketClose"
                                  class="ml-3"
                                  color="blueS"
                                  depressed
                                  :dark="ticketClose"
                                  @click="saveMassiveTicket()"
                                >
                                  Generar tickets
                                  <v-icon class="ml-3"
                                    >mdi-arrow-right-bold-circle</v-icon
                                  >
                                </v-btn>
                              </v-row>
                            </v-stepper-content>
                          </v-stepper-items>
                        </v-stepper>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>
      <v-card flat>
        <v-card-text>
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
            calculate-widths
          >
            <template
              v-slot:item.properties.id="{
                item
              }"
            >
              {{ showPosition(item) }}
            </template>
            <template
              v-slot:item.properties.courseRegisteredUser.registered_user.rut_registered_moodle="{
                item
              }"
            >
              {{
                item.properties.courseRegisteredUser.registered_user.rut_registered_moodle.toUpperCase()
              }}
            </template>
            <template
              v-slot:item.properties.courseRegisteredUser.registered_user.name_registered_moodle="{
                item
              }"
            >
              <v-tooltip color="blueS" bottom>
                <template v-slot:activator="{ on }">
                  <v-label v-on="on">
                    {{
                      item.properties.courseRegisteredUser.registered_user.name_registered_moodle.toUpperCase()
                    }}</v-label
                  >
                </template>
                <span>{{
                  item.properties.courseRegisteredUser.course.description
                }}</span>
              </v-tooltip>
            </template>
            <template v-slot:item.properties.typeTicket.description="{ item }">
              <v-tooltip color="blueS" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">{{
                    getTypeTicket(item.properties.typeTicket.description)
                  }}</v-icon>
                </template>
                <span>{{ item.properties.typeTicket.description }}</span>
              </v-tooltip>
            </template>
            <template
              v-slot:item.properties.statusTicket.description="{ item }"
            >
              <v-tooltip color="blueS" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">{{
                    getStatusTicket(item.properties.statusTicket.description)
                  }}</v-icon>
                </template>
                <span>{{ item.properties.statusTicket.description }}</span>
              </v-tooltip>
            </template>
            <template
              v-slot:item.properties.priorityTicket.description="{ item }"
            >
              <v-chip
                small
                :color="getColor(item.properties.priorityTicket.description)"
                dark
                label
                >{{
                  item.properties.priorityTicket.description.toUpperCase()
                }}</v-chip
              >
            </template>
            <template v-slot:item.actions="{ item }">
              <v-tooltip color="blueS" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    class="mr-2"
                    @click.prevent="editItem(item)"
                  >
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
        </v-card-text>
      </v-card>
      <template v-slot:actions>
        <div class="text-center pt-2">
          <v-pagination
            color="redS"
            v-model="page"
            :length="pageCount"
          ></v-pagination>
        </div>
      </template>
      <v-snackbar color="blueS" v-model="snackbar" :timeout="timeout">
        {{ message }}
        <v-btn dark text @click="snackbar = false">
          Cerrar
        </v-btn>
      </v-snackbar>
      <v-dialog v-model="dialogConfirm" persistent max-width="350">
        <base-card
          class="pt-12"
          color="redS"
          icon="mdi-hand-left"
          title="¡Atención!"
        >
          <v-divider></v-divider>
          <v-card-text>Eliminará un registro de forma permanente</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <base-button
              icon="mdi-check-circle"
              label="Aceptar"
              @click.prevent="confirmDelete"
            ></base-button>
            <v-btn text color="grayS" @click="close">
              <v-icon size="30" left>mdi-close-circle</v-icon>
              Cancelar</v-btn
            >
          </v-card-actions>
        </base-card>
      </v-dialog>
      <v-dialog v-model="dialogSelectCourse" max-width="400">
        <v-card>
          <v-card-title class="headline text-center"
            >Seleccione un curso:</v-card-title
          >
          <v-card-text>
            <v-hover
              v-for="user in arrayCourseUserSelect"
              :key="user.course.id"
              v-slot:default="{ hover }"
              close-delay="100"
            >
              <v-card
                class="mt-3"
                :elevation="hover ? 6 : 0"
                flat
                @click="selectCourse(user)"
              >
                <v-card-text class="font-weight-medium text-center subtitle-1">
                  {{ user.course.description }}
                </v-card-text>
              </v-card>
            </v-hover>
          </v-card-text>
        </v-card>
      </v-dialog>
    </base-card>
  </v-container>
</template>

<script>
import axios from '../services/axios'
import Ticket from '../models/Ticket'
import DetailTicket from '../models/DetailTicket'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
export default {
  mixins: [validationMixin],
  validations: {
    category: {
      required
    },
    categoryMassiveTicket: {
      required
    },
    priority: {
      required
    },
    source: {
      required
    },
    type: {
      required
    },
    motive: {
      required
    },
    status: {
      required
    },
    operator: {
      required
    },
    statusDetail: {
      required
    },
    observation: {
      minLength: minLength(0),
      maxLength: maxLength(150),
      required
    }
  },
  data() {
    return {
      completeStepOne: false,
      completeStepTwo: false,
      completeStepThree: false,
      rulesValueStepOne: true,
      rulesValueStepTwo: true,
      rulesValueStepThree: true,
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
          align: 'center',
          sortable: false,
          width: 50,
          value: 'properties.id',
          class: 'redS--text'
        },
        {
          text: 'RUT',
          width: 120,
          value:
            'properties.courseRegisteredUser.registered_user.rut_registered_moodle',
          class: 'redS--text'
        },
        {
          text: 'Nombre participante',
          width: 250,
          value:
            'properties.courseRegisteredUser.registered_user.name_registered_moodle',
          class: 'redS--text'
        },
        {
          text: 'Tipo',
          value: 'properties.typeTicket.description',
          class: 'redS--text'
        },
        {
          text: 'Estado',
          value: 'properties.statusTicket.description',
          class: 'redS--text'
        },
        {
          text: 'Prioridad',
          value: 'properties.priorityTicket.description',
          class: 'redS--text'
        },
        {
          text: 'Intentos',
          align: 'center',
          value: 'relationships.numberOfElements',
          class: 'redS--text'
        },
        {
          text: 'Antigüedad (días)',
          align: 'center',
          value: 'properties.ageTicket',
          class: 'redS--text'
        },
        {
          text: 'Fecha creación',
          align: 'center',
          value: 'properties.createdAt',
          width: 150,
          class: 'redS--text'
        },
        {
          text: 'Hora creación',
          align: 'center',
          value: 'properties.timeCreatedAt',
          class: 'redS--text'
        },
        {
          text: 'Fecha cierre',
          align: 'center',
          value: 'properties.closingDate',
          width: 150,
          class: 'redS--text'
        },
        {
          text: 'Hora cierre',
          align: 'center',
          value: 'properties.timeClosingDate',
          class: 'redS--text'
        },
        {
          text: 'Operador',
          align: 'center',
          width: 150,
          value: 'properties.userAssigned.name',
          class: 'redS--text'
        },
        {
          text: 'Opciones',
          value: 'actions',
          sortable: false,
          width: 90,
          class: 'redS--text'
        }
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
        {
          text: 'Aula',
          value: 'classroom.description',
          class: 'redS--text'
        },
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
      categoryMassiveTicket: null,
      priority: null,
      type: null,
      motive: null,
      status: null,
      source: null,
      operator: null,
      statusDetail: null,
      statusDetailMasive: null,
      observation: '',
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
      rut: '17.057.394-3',
      rutACTIVO: '17.057.394-3',
      rutRenunciado: '12.122.260-4',
      e1: 1,
      em1: 1,
      message: '',
      successMessage: 'Operación realizada con éxito.',
      errorMEssage: 'Ha ocurrido un error.',
      snackbar: false,
      timeout: 3000,
      editedTicketIndex: -1,
      editedTicketItem: new Ticket(),
      defaultTicketItem: new Ticket(),
      editedDetailTicketItem: new DetailTicket(),
      defaultDetailTicketItem: new DetailTicket(),
      editItem_: new Ticket(),
      dialogConfirm: false,
      openTicket: true,
      closeTicket: false,
      showStatusDetailTicket: true,
      showObservation: true,
      observationMassive: '',
      dialogSelectCourse: false,
      arrayCourseUserSelect: [],
      currentCourseUser: {},
      ticketClose: false,
      checkCloseStatus: false
    }
  },
  methods: {
    ...mapActions({
      fetchMotiveTicket: 'motiveTicket/fetchMotiveTickets',
      fetchPriorityTicket: 'priorityTicket/fetchPriorityTickets',
      fetchSourceTicket: 'sourceTicket/fetchSourceTickets',
      fetchTypeTicket: 'typeTicket/fetchTypeTickets',
      fetchUser: 'user/fetchUsers',
      fetchStatusTicket: 'statusTicket/fetchStatusTickets',
      fetchClassroom: 'classroom/fetchClassrooms',
      fetchStatusDetailTicket: 'statusDetailTicket/fetchStatusDetailTickets',
      fetchDetailTicket: 'detailTicket/fetchDetailTickets',
      fetchItems: 'ticket/fetchTickets',
      fetchCourseItems: 'course/fetchCourses',
      fetchCourseByCategory: 'course/getCoursesByCategory',
      fetchCategoryItems: 'category/fetchCategories',
      fetchCourseRegisteredUserItems:
        'courseRegisteredUser/fetchCourseRegisteredUsers',
      postTicket: 'ticket/postTicket',
      putTicket: 'ticket/putTicket',
      removeItem: 'ticket/deleteTicket',
      findTicket: 'ticket/findTicket',
      fetchTicketDetails: 'ticket/fetchTicketDetails',
      postDetailTicket: 'detailTicket/postDetailTicket',
      clearTicketDetail: 'ticket/clearDetailTickets'
    }),
    showIconSearch(item) {
      return item.close ? 'mdi-email-search' : 'mdi-chat-plus'
    },
    showTooltipSearch(item) {
      return item.close ? 'Ver ticket' : 'Agregar contacto'
    },
    setSource(value) {
      this.editedTicketItem.sourceTicket = value
      this.$v.source.$touch()
    },
    setPriority(value) {
      this.editedTicketItem.prioriryTicket = value
      this.$v.priority.$touch()
    },
    setType(value) {
      this.editedTicketItem.typeTicket = value
      this.$v.type.$touch()
    },
    setMotive(value) {
      this.editedTicketItem.motiveTicket = value
      this.$v.motive.$touch()
    },
    setStatus(value) {
      this.editedTicketItem.statusTicket = value
      this.$v.status.$touch()
    },
    setOperator(value) {
      this.editedTicketItem.operatorTicket = value
      this.$v.operator.$touch()
    },
    setStatusDetail(value) {
      this.editedDetailTicketItem.statusDeailTicket = value
      this.$v.statusDetail.$touch()
    },
    async saveTicket() {
      this.rulesValueStepThree = true

      if (!this.$v.status.required) {
        this.$v.status.$touch()
        this.rulesValueStepThree = this.$v.status.required
      }

      if (this.editedTicketIndex > -1) {
        if (!this.$v.statusDetail.required) {
          this.$v.statusDetail.$touch()
          this.rulesValueStepThree = this.$v.statusDetail.required
        }

        if (!this.$v.observation.required) {
          this.$v.observation.$touch()
          this.rulesValueStepThree = this.$v.observation.required
        }

        if (!this.$v.observation.maxLength) {
          this.$v.observation.$touch()
          this.rulesValueStepThree = this.$v.observation.maxLength
        }
      }

      if (this.rulesValueStepThree) {
        this.completeStepThree = true

        if (
          this.status.description === 'Cerrado' &&
          this.observation === '' &&
          this.statusDetail === null
        ) {
          this.snackbar = true
          this.message =
            'Debe seleccionar un intento de contacto y agregar una observación'
          this.checkCloseStatus = false
          this.$v.observation.$touch()
          this.$v.statusDetail.$touch()
        } else {
          console.log('branch false')
          let dataStoreTicket = {
            course_registered_user_id: this.user.id,
            type_ticket_id: this.type.id,
            source_ticket_id: this.source.id,
            status_ticket_id: this.status.id,
            priority_ticket_id: this.priority.id,
            motive_ticket_id: this.motive.id,
            user_create_id: this.userLog.id,
            user_assigned_id: this.operator.id
          }

          if (this.status.description === 'Cerrado') {
            let arrayDate = new Date().toISOString().substr(0, 10)

            dataStoreTicket = Object.assign(dataStoreTicket, {
              closing_date: arrayDate
            })
          }

          if (this.editedTicketIndex > -1) {
            dataStoreTicket = Object.assign(dataStoreTicket, {
              id: this.editedTicketItem.id
            })

            const { success } = await this.putTicket(dataStoreTicket)

            if (success) {
              const dataDetailTicket = {
                comment: this.observation,
                ticket_id: this.editedTicketItem.id,
                status_detail_ticket_id: this.statusDetail.id,
                user_created_id: this.userLog.id
              }
              const { success, message } = await this.postDetailTicket(
                dataDetailTicket
              )
              if (success) {
                this.snackbar = true
                this.message = this.successMessage
              } else {
                this.snackbar = true
                this.message = message
              }
            }
          } else {
            const { success } = await this.postTicket(dataStoreTicket)
            if (success) {
              if (this.statusDetail) {
                const dataDetailTicket = {
                  comment: this.observation,
                  ticket_id: this.savedTicket.properties.id,
                  status_detail_ticket_id: this.statusDetail.id,
                  user_created_id: this.userLog.id
                }

                const { success, message } = await this.postDetailTicket(
                  dataDetailTicket
                )

                if (success) {
                  this.snackbar = true
                  this.message = this.successMessage
                } else {
                  this.snackbar = true
                  this.message = message
                }
              }
            }
          }
          this.fetchItems()
          this.clearTicket()
        }
      }
    },
    async editItem(ticket) {
      const item = ticket.properties

      this.priority = item.priorityTicket
      this.type = item.typeTicket
      this.motive = item.motiveTicket
      this.status = item.statusTicket
      this.source = item.sourceTicket
      this.operator = item.userAssigned
      this.rut = item.courseRegisteredUser.registered_user.rut_registered_moodle

      this.fetchUserByRut(this.rut)
      this.selectCourse(ticket.properties.courseRegisteredUser)

      this.editedTicketIndex = this.tickets.findIndex(
        find => find.properties.id === item.id
      )
      this.editItem_ = Object.assign({}, item)
      this.editedTicketItem.id = item.id

      console.log(ticket)

      this.ticketClose = ticket.close
      this.checkCloseStatus = true

      await this.fetchTicketDetails(this.editItem_)

      this.dialog = true
      this.e1 = 3
    },
    async filterUsersByCategories() {
      if (this.category !== null) {
        await this.fetchCourseByCategory(this.category.courses.href)
        this.coursesByCategory.forEach(course => {
          this.userRegisteredFiltered = this.courseRegisteredUserItems.filter(
            userCourse => {
              return userCourse.course.id === course.properties.id
            }
          )
        })
      }
    },
    async filterUsersByCategoriesTicket() {
      this.userRegisteredFiltered = []
      if (this.categoryMassiveTicket !== null) {
        await this.fetchCourseByCategory(
          this.categoryMassiveTicket.courses.href
        )

        const vm = this
        this.coursesByCategory.forEach(course => {
          if (vm.classrooms.length === 0) {
            vm.courseRegisteredUserItems.forEach(userCourse => {
              if (userCourse.course.id === course.properties.id) {
                vm.userRegisteredFiltered.push(userCourse)
              }
            })
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
      if (status === 'Abierto') return 'mdi-lock-open-outline'
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
      this.clearTicketDetail()

      const vm = this
      setTimeout(async () => {
        const { data } = await axios.get(`/api/v2/registered-user/${this.rut}`)

        const { _data, statusCode, message } = data

        if (statusCode === 204) {
          vm.snackbar = true
          vm.message = message
        } else if (statusCode === 406) {
          vm.snackbar = true
          vm.message = message
        } else if (statusCode === 200) {
          if (_data !== null) {
            this.userCourse = _data

            this.arrayCourseUserSelect = this.courseRegisteredUserItems.filter(
              userCourse => {
                return userCourse.registered_user.id === this.userCourse.id
              }
            )

            if (
              this.arrayCourseUserSelect.length > 1 &&
              this.editedTicketIndex === -1
            ) {
              this.dialogSelectCourse = true
            }
          } else {
            vm.snackbar = true
            vm.message = 'El alumno no se encuentra registrado'
          }
        }
        this.searchRutLoading = false
      }, 1000)
    },
    selectCourse(user) {
      this.dialogSelectCourse = false

      this.editedTicketItem.courseRegisteredUser = Object.assign({}, user)

      this.user = Object.assign({}, user)
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
    },
    async deleteItem(ticket) {
      this.editedTicketIndex = this.tickets.findIndex(
        find => find.properties.id === ticket.properties.id
      )
      this.editItem_ = Object.assign({}, this.tickets[this.editedTicketIndex])
      this.dialogConfirm = true
    },
    async confirmDelete() {
      const { success, message } = await this.removeItem(
        this.editItem_.properties
      )

      if (success) {
        this.snackbar = true
        this.message = this.successMessage
      } else {
        this.snackbar = true
        this.message = message
      }
      this.closeConfirmDelete()
    },
    closeConfirmDelete() {
      this.dialogConfirm = false
      setTimeout(() => {
        this.clearTicket()
      }, 300)
    },
    close() {
      this.dialogConfirm = false
      setTimeout(() => {
        this.clearTicket()
      }, 300)
    },
    async saveMassiveTicket() {
      this.rulesValueStepThree = true

      if (!this.$v.status.required) {
        this.$v.status.$touch()
        this.rulesValueStepThree = this.$v.status.required
      }

      if (this.rulesValueStepThree) {
        this.completeStepThree = true

        if (
          this.status.description === 'Cerrado' &&
          this.observation === '' &&
          this.statusDetail === null
        ) {
          this.snackbar = true
          this.message =
            'Debe seleccionar un intento de contacto y agregar una observación'
          this.checkCloseStatus = false
          this.$v.observation.$touch()
          this.$v.statusDetail.$touch()
        } else {
          let dataStoreTicket = {
            type_ticket_id: this.type.id,
            source_ticket_id: this.source.id,
            status_ticket_id: this.status.id,
            priority_ticket_id: this.priority.id,
            motive_ticket_id: this.motive.id,
            user_create_id: this.userLog.id,
            user_assigned_id: this.operator.id
          }

          if (this.status.description === 'Cerrado') {
            let arrayDate = new Date().toISOString().substr(0, 10)

            dataStoreTicket = Object.assign(dataStoreTicket, {
              closing_date: arrayDate
            })
          }

          this.selected.forEach(async userCourse => {
            dataStoreTicket = {
              ...dataStoreTicket,
              ...{ course_registered_user_id: userCourse.id }
            }

            const { success, message, _data } = await this.postTicket(
              dataStoreTicket
            )
            if (success) {
              if (this.statusDetailMasive) {
                const dataDetailTicket = {
                  comment: this.observationMassive,
                  ticket_id: _data.properties.id,
                  status_detail_ticket_id: this.statusDetailMasive.id,
                  user_created_id: this.userLog.id
                }

                const { success } = await this.postDetailTicket(
                  dataDetailTicket
                )

                if (success) {
                  this.snackbar = true
                  this.message = `Creando ticket de usuario ${userCourse.registered_user.name_registered_moodle}`
                }
              }

              this.snackbar = true
              this.message = `Creando ticket de usuario ${userCourse.registered_user.name_registered_moodle}`
            } else {
              this.snackbar = true
              this.message = message
            }
          })
          this.clearTicket()
          setTimeout(() => {
            this.fetchItems()
          }, 2000)
        }
      }
    },
    showComment(comment) {
      if (comment.length > 50) {
        return `${comment.slice(0, 50)}...`
      } else {
        return comment
      }
    },
    checkStepOne() {
      this.rulesValueStepOne = true

      if (!this.$v.categoryMassiveTicket.required) {
        this.$v.categoryMassiveTicket.$touch()
        this.rulesValueStepOne = this.$v.categoryMassiveTicket.required
      }

      if (this.selected.length === 0 && this.rulesValueStepOne) {
        this.snackbar = true
        this.message = 'Debe seleccionar al menos un destinatario'
        this.rulesValueStepOne = false
      }

      if (this.rulesValueStepOne) {
        this.completeStepOne = true
        this.em1 = 2
      }
    },
    clearTicket() {
      this.type = null
      this.source = null
      this.status = null
      this.priority = null
      this.categoryMassiveTicket = null
      this.motive = null
      this.operator = null
      this.statusDetail = null
      this.observation = ''
      this.selected = []
      this.userRegisteredFiltered = []
      this.completeStepOne = false
      this.completeStepTwo = false
      this.completeStepThree = false
      this.rulesValueStepOne = true
      this.rulesValueStepTwo = true
      this.rulesValueStepThree = true
      this.rut = ''
      this.e1 = 1
      this.em1 = 1
      this.dialogMassive = false
      this.dialog = false
      this.user = {
        registered_user: {},
        course: {},
        activities: [],
        isActive: null
      }
      this.$v.$reset()
      this.editedTicketIndex = -1
      this.editedTicketItem = Object.assign({}, this.defaultTicketItem)
      this.showStatusDetailTicket = true
      this.showObservation = true
      this.classrooms = []
      this.ticketClose = false
      this.checkCloseStatus = false
      this.clearTicketDetail()
    },
    checkStepTwo() {
      this.$v.$reset()

      setTimeout(() => {
        this.rulesValueStepTwo = true

        if (!this.$v.source.required) {
          this.$v.source.$touch()
          this.rulesValueStepTwo = this.$v.source.required
        }

        if (!this.$v.priority.required) {
          this.$v.priority.$touch()
          this.rulesValueStepTwo = this.$v.priority.required
        }

        if (!this.$v.type.required) {
          this.$v.type.$touch()
          this.rulesValueStepTwo = this.$v.type.required
        }

        if (!this.$v.motive.required) {
          this.$v.motive.$touch()
          this.rulesValueStepTwo = this.$v.motive.required
        }

        if (!this.$v.operator.required) {
          this.$v.operator.$touch()
          this.rulesValueStepTwo = this.$v.operator.required
        }

        if (this.type.description !== 'Correo electrónico') {
          this.showStatusDetailTicket = false
          this.showObservation = false
        } else {
          this.showStatusDetailTicket = true
          this.showObservation = true
        }

        if (this.rulesValueStepTwo) {
          this.completeStepTwo = true
          this.em1 = 3
          this.e1 = 3
        }
      }, 500)
    },
    showPosition(ticket) {
      const index = this.tickets.findIndex(find => {
        return find.properties.id === ticket.properties.id
      })

      return index + 1
    }
  },
  created() {
    this.fetchCourseRegisteredUserItems()
    this.fetchDataCourses()
    this.fetchDataCategories()
    this.filterUsersByCategories()
    this.fetchMotiveTicket()
    this.fetchPriorityTicket()
    this.fetchSourceTicket()
    this.fetchTypeTicket()
    this.fetchUser()
    this.fetchStatusTicket()
    this.fetchClassroom()
    this.fetchStatusDetailTicket()
    this.fetchDetailTicket()
    this.fetchItems()
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
      classroomItems: 'classroom/classrooms',
      userLog: 'auth/user',
      statusDetailTicketItems: 'statusDetailTicket/statusDetailTickets',
      savedTicket: 'ticket/getLastTicket',
      ticketDetails: 'ticket/ticketDetailsByTicket',
      loggedUser: 'auth/user',
      isAdmin: 'auth/isAdmin'
    }),
    titleTicket() {
      return this.editedTicketIndex > -1 ? 'Agregar contacto' : 'Generar ticket'
    },
    titleButtonTicket() {
      return this.editedTicketIndex > -1 ? 'Agregar contacto' : 'Generar ticket'
    },
    categoryErrors() {
      const errors = []

      if (!this.$v.category.$dirty) return errors
      !this.$v.category.required && errors.push('Es obligatorio.')

      return errors
    },
    categoryMassiveTicketErrors() {
      const errors = []

      if (!this.$v.categoryMassiveTicket.$dirty) return errors
      !this.$v.categoryMassiveTicket.required && errors.push('Es obligatorio.')

      return errors
    },
    priorityErrors() {
      const errors = []

      if (!this.$v.priority.$dirty) return errors
      !this.$v.priority.required && errors.push('Es obligatorio.')

      return errors
    },
    sourceErrors() {
      const errors = []

      if (!this.$v.source.$dirty) return errors
      !this.$v.source.required && errors.push('Es obligatorio.')

      return errors
    },
    typeErrors() {
      const errors = []

      if (!this.$v.type.$dirty) return errors
      !this.$v.type.required && errors.push('Es obligatorio.')

      return errors
    },
    motiveErrors() {
      const errors = []

      if (!this.$v.motive.$dirty) return errors
      !this.$v.motive.required && errors.push('Es obligatorio.')

      return errors
    },
    statusErrors() {
      const errors = []

      if (!this.$v.status.$dirty) return errors
      !this.$v.status.required && errors.push('Es obligatorio.')

      return errors
    },
    operatorErrors() {
      const errors = []

      if (!this.$v.operator.$dirty) return errors
      !this.$v.operator.required && errors.push('Es obligatorio.')

      return errors
    },
    statusDetailErrors() {
      const errors = []

      if (this.editedTicketIndex > -1 && this.checkCloseStatus) {
        if (!this.$v.statusDetail.$dirty) return errors
        !this.$v.statusDetail.required && errors.push('Es obligatorio.')
      }

      return errors
    },
    observationErrors() {
      const errors = []

      if (this.editedTicketIndex > -1 && this.checkCloseStatus) {
        if (!this.$v.observation.$dirty) return errors
        !this.$v.observation.required && errors.push('Es obligatorio.')
        !this.$v.observation.maxLength &&
          errors.push('No debe sobrepasar los 150 carácteres')
      }

      return errors
    },
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
      const vm = this
      if (this.category !== null) {
        return this.items
          .filter(item => {
            if (this.openTicket === true && this.closeTicket === false) {
              return (
                item.properties.statusTicket.description === 'Abierto' &&
                item.properties.courseRegisteredUser.course.category
                  .description === this.category.description
              )
            } else if (this.openTicket === false && this.closeTicket === true) {
              return (
                item.properties.statusTicket.description === 'Cerrado' &&
                item.properties.courseRegisteredUser.course.category
                  .description === this.category.description
              )
            } else {
              return (
                item &&
                item.properties.courseRegisteredUser.course.category
                  .description === this.category.description
              )
            }
          })
          .filter(item => {
            if (vm.loggedUser) {
              if (vm.isAdmin) {
                return true
              } else {
                return item.properties.userAssigned.id === vm.loggedUser.id
              }
            }
          })
      } else {
        return this.items
          .filter(item => {
            if (this.openTicket === true && this.closeTicket === false) {
              return item.properties.statusTicket.description === 'Abierto'
            } else if (this.openTicket === false && this.closeTicket === true) {
              return item.properties.statusTicket.description === 'Cerrado'
            } else {
              return item
            }
          })
          .filter(item => {
            if (vm.loggedUser) {
              if (vm.isAdmin) {
                return true
              } else {
                return item.properties.userAssigned.id === vm.loggedUser.id
              }
            }
          })
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
