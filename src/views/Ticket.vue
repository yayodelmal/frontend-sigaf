<template>
  <v-container fluid>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-ticket-account"
      title="Ticket"
    >
      <v-col cols="12">
        <v-toolbar dark color="blueS darken-1" class="mb-1">
          <v-select
            v-model="category"
            :items="categoryItems"
            label="Categoría"
            item-value="id"
            item-text="description"
            color="blueS"
            flat
            solo-inverted
            hide-details
            return-object
            prepend-inner-icon="mdi-filter-outline"
          >
          </v-select>
          <v-spacer />
          <v-select
            class="mx-3"
            v-model="selectedCourse"
            :items="arrayCourseByCategory"
            label="Curso"
            item-value="id"
            item-text="description"
            color="blueS"
            flat
            solo-inverted
            hide-details
            return-object
            prepend-inner-icon="mdi-filter-outline"
          >
          </v-select>
          <v-spacer />
          <v-btn
            :disabled="selectedCourse === null"
            large
            depressed
            color="blueS"
            @click="findTicketByCourse"
            :loading="loadingButton"
          >
            Buscar
          </v-btn>
        </v-toolbar>
      </v-col>

      <v-card v-if="showTable" flat>
        <v-card-title>
          <v-col cols="12">
            <v-card flat outlined>
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
                                    :color="
                                      !completeStepThree ? 'redS' : 'green'
                                    "
                                    dark
                                    step="3"
                                    :complete="completeStepThree"
                                    :rules="[() => rulesValueStepThree]"
                                    >Contacto</v-stepper-step
                                  >
                                </v-stepper-header>
                                <v-stepper-items>
                                  <v-stepper-content step="1">
                                    <form
                                      @keydown.enter.prevent="fetchUserByRut()"
                                    >
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
                                    <div v-if="user !== null">
                                      <v-row justify="center">
                                        <v-col
                                          class="d-flex text-center"
                                          cols="12"
                                          sm="8"
                                          md="6"
                                          lg="4"
                                          xl="4"
                                        >
                                          <!-- <v-divider vertical></v-divider> -->
                                          <v-hover
                                            v-slot:default="{ hover }"
                                            open-delay="200"
                                          >
                                            <v-card
                                              width="400"
                                              class="pt-6 mx-auto rounded-t-xl"
                                              flat
                                              :elevation="hover ? 16 : 0"
                                              outlined
                                            >
                                              <v-card-text>
                                                <span
                                                  class="headline font-weight-bold"
                                                >
                                                  {{
                                                    user.classroom.description
                                                  }}</span
                                                ><br />
                                                <span class="text-caption">
                                                  Progreso:</span
                                                ><br />
                                                <v-avatar size="120">
                                                  <v-progress-circular
                                                    :rotate="-90"
                                                    :size="100"
                                                    :width="15"
                                                    :value="
                                                      getValueProgress(user)
                                                    "
                                                    color="blueS"
                                                  >
                                                    {{
                                                      getValueProgress(user)
                                                    }}%
                                                  </v-progress-circular>
                                                </v-avatar>
                                                <h3 class="headline mb-2">
                                                  {{
                                                    user.registered_user.name
                                                  }}
                                                </h3>
                                                <h3 class="mb-2">
                                                  {{
                                                    user.registered_user
                                                      .last_name
                                                  }}
                                                  {{
                                                    user.registered_user
                                                      .mother_last_name
                                                  }}
                                                </h3>
                                                <div class="blueS--text mb-2">
                                                  {{
                                                    user.registered_user.email
                                                  }}
                                                </div>
                                                <div
                                                  class="redS--text subheading font-weight-bold"
                                                >
                                                  {{
                                                    user.registered_user.mobile
                                                  }}
                                                </div>
                                              </v-card-text>
                                              <v-expand-transition>
                                                <div
                                                  v-if="hover"
                                                  class="d-flex transition-fast-in-fast-out blueS darken-2 v-card--reveal white--text rounded-t-xl"
                                                  style="height: 78%;"
                                                >
                                                  <div
                                                    class="d-flex flex-column"
                                                  >
                                                    <div
                                                      v-for="section in sectionFiltered"
                                                      :key="section.id"
                                                      class="d-flex flex-row"
                                                    >
                                                      <div
                                                        class="px-3 py-2 title-section"
                                                      >
                                                        <h6
                                                          class="text-overline"
                                                        >
                                                          {{
                                                            section.description
                                                          }}:
                                                        </h6>
                                                      </div>
                                                      <div
                                                        class="px-1 py-2"
                                                        v-for="grade in getGrades(
                                                          section,
                                                          user.activities
                                                        )"
                                                        :key="
                                                          grade.idActivityMoodle
                                                        "
                                                      >
                                                        <v-tooltip
                                                          color="white"
                                                          bottom
                                                        >
                                                          <template
                                                            v-slot:activator="{
                                                              on
                                                            }"
                                                          >
                                                            <h4 v-on="on">
                                                              <kbd>{{
                                                                grade.qualificationMoodle
                                                              }}</kbd>
                                                            </h4>
                                                          </template>
                                                          <span
                                                            class="blueS--text darken-2"
                                                            >{{
                                                              grade.description
                                                            }}</span
                                                          >
                                                        </v-tooltip>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </v-expand-transition>
                                              <v-divider></v-divider>
                                              <v-row class="text-center">
                                                <v-col cols="6" class="mx-auto">
                                                  <v-card
                                                    :color="
                                                      getColorState(user.state)
                                                    "
                                                    flat
                                                    dark
                                                    class="py-1"
                                                    ><span>{{
                                                      user.state
                                                        ? 'RENUNCIADO'
                                                        : 'ACTIVO'
                                                    }}</span></v-card
                                                  >
                                                </v-col>

                                                <v-col cols="12">
                                                  <span
                                                    class="font-weight-bold"
                                                  >
                                                    Última conexión hace
                                                    {{
                                                      user.last_access_registered_moodle
                                                    }}</span
                                                  >
                                                </v-col>
                                              </v-row>
                                            </v-card>
                                          </v-hover>
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
                                    </div>
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
                                                          .description ===
                                                        'Fallido'
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
                                                      {{
                                                        item.userCreated.name
                                                      }}
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
                            v-if="isAdmin || isDeveloper"
                            icon="mdi-plus-circle"
                            v-on="on"
                            label="Crear Ticket Masivo"
                            @click="
                              fetchActivities()
                              findUsersByCourse()
                            "
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
                                  <v-row>
                                    <v-col cols="10">
                                      <v-autocomplete
                                        v-model="selectedActivities"
                                        :items="filterActivities"
                                        chips
                                        color="blueS"
                                        flat
                                        solo-inverted
                                        hide-details
                                        return-object
                                        label="Filtrar actividades pendientes"
                                        item-text="description"
                                        item-value="description"
                                        multiple
                                      >
                                        <template v-slot:selection="data">
                                          <v-chip
                                            small
                                            v-bind="data.attrs"
                                            :input-value="data.selected"
                                            close
                                            @click="data.select"
                                            @click:close="remove(data.item)"
                                          >
                                            {{ data.item.description }}
                                          </v-chip>
                                        </template>
                                        <template v-slot:item="data">
                                          <template>
                                            <v-list-item-content>
                                              <v-list-item-title
                                                v-html="data.item.description"
                                              >
                                              </v-list-item-title>
                                              <v-list-item-subtitle
                                                v-html="
                                                  data.item.section.description
                                                "
                                              ></v-list-item-subtitle>
                                            </v-list-item-content>
                                          </template>
                                        </template>
                                      </v-autocomplete>
                                    </v-col>
                                    <v-col cols="2">
                                      <v-btn
                                        large
                                        color="blueS"
                                        depressed
                                        dark
                                        @click="findUserByActivityFiltered"
                                      >
                                        Buscar
                                        <v-icon class="ml-3"
                                          >mdi-arrow-right-bold-circle</v-icon
                                        >
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                  <v-row justify="center">
                                    <!-- <v-autocomplete
                                      :items="filterActivities"
                                      label="Filtrar Actividad"
                                      item-text="description"
                                      item-value="description"
                                      return-object
                                      v-model="activityItem"
                                      @change="findUserByActivity()"
                                      color="blueS"
                                      outlined
                                    ></v-autocomplete> -->
                                    <!--  <v-col cols="12" sm="5" md="5" lg="4">
                                    <base-autocomplete
                                        v-model="categoryMassiveTicket"
                                        :items="selectedCourses"
                                        label="Curso"
                                        item-value="id"
                                        item-text="description"
                                        @change="
                                          filterUsersByCategoriesTicket()
                                          $v.categoryMassiveTicket.$touch()
                                        "
                                        return-object
                                        outlined
                                        @blur="
                                          $v.categoryMassiveTicket.$touch()
                                        "
                                        :error-messages="
                                          categoryMassiveTicketErrors
                                        "
                                      >
                                      </base-autocomplete>
                                    </v-col> -->
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
                                        @change="
                                          filterUsersByCategoriesTicket()
                                        "
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
                                  <v-card>
                                    <div v-if="loadingUsers">
                                      <v-skeleton-loader
                                        :loading="loading"
                                        :transition="transition"
                                        class="mx-auto"
                                        type="table-tbody"
                                      ></v-skeleton-loader>
                                      <v-skeleton-loader
                                        :loading="loading"
                                        :transition="transition"
                                        class="mx-auto"
                                        type="table-tfoot"
                                      ></v-skeleton-loader>
                                    </div>

                                    <v-data-table
                                      v-else
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
                                  </v-card>

                                  <v-row>
                                    <v-spacer />
                                    <v-btn
                                      :disabled="loadingUsers"
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
          </v-col>
          <v-col cols="12">
            <v-toolbar dark color="blueS darken-1" class="mb-1">
              <v-text-field
                v-model="search"
                color="blueS"
                clearable
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="mdi-magnify"
                label="Buscar"
              ></v-text-field>
              <v-spacer />
              <v-checkbox v-model="openTicket" label="Abierto"></v-checkbox>
              <v-checkbox
                class="ml-10"
                v-model="closeTicket"
                label="Cerrado"
              ></v-checkbox>
            </v-toolbar>
          </v-col>
        </v-card-title>
        <v-card-text>
          <div v-if="loading">
            <v-skeleton-loader
              :loading="loading"
              :transition="transition"
              class="mx-auto"
              type="table-tbody"
            ></v-skeleton-loader>
            <v-skeleton-loader
              :loading="loading"
              :transition="transition"
              class="mx-auto"
              type="table-tfoot"
            ></v-skeleton-loader>
          </div>
          <v-data-table
            v-else
            :headers="headers"
            :search="search"
            :items="tickets"
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
        <v-card-actions>
          <v-pagination
            color="redS"
            v-model="page"
            :length="pageCount"
          ></v-pagination>
        </v-card-actions>
      </v-card>

      <v-snackbar color="blueS" v-model="snackbar" :timeout="timeout">
        {{ message }}
        <v-btn dark text @click="snackbar = false">
          Cerrar
        </v-btn>
      </v-snackbar>

      <confirm-dialog
        :icon="'mdi-alert-circle-outline'"
        :color-icon="'warning'"
        :dialog="dialogConfirm"
        :cancel="close"
        :accept="confirmDelete"
      >
        <template v-slot:content>
          <h3 class="text-button">
            Eliminará un registro de forma permanente
          </h3>
        </template>
      </confirm-dialog>
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
    <v-overlay :value="overlay" color="grayS" :opacity="opacity">
      <h3 class="text-body-2 text-center mb-16">
        Por favor espere. Esto puede tardar un momento
      </h3>
      <div class="text-center">
        <v-progress-circular indeterminate size="64"> </v-progress-circular>
      </div>
      <h3 class="headline text-center mt-5">
        Generando ticket {{ indexCurrentSyncUser }}
      </h3>
      <h3 class="headline text-center mt-3">{{ currentTicket }}</h3>
    </v-overlay>
  </v-container>
</template>

<script>
import axios from '../services/axios'
import Ticket from '../models/Ticket'
import DetailTicket from '../models/DetailTicket'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import ConfirmDialog from '../components/component/ConfirmCard'

Array.prototype.forEachAsyncCustom = function(fn) {
  return this.reduce(
    (promise, n, index) => promise.then(() => fn(n, index)),
    Promise.resolve()
  )
}

export default {
  inject: ['theme'],
  mixins: [validationMixin],
  components: {
    ConfirmDialog
  },
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
        // {
        //   text: 'Hora creación',
        //   align: 'center',
        //   value: 'properties.timeCreatedAt',
        //   class: 'redS--text'
        // },
        {
          text: 'Fecha cierre',
          align: 'center',
          value: 'properties.closingDate',
          width: 150,
          class: 'redS--text'
        },
        // {
        //   text: 'Hora cierre',
        //   align: 'center',
        //   value: 'properties.timeClosingDate',
        //   class: 'redS--text'
        // },
        // {
        //   text: 'Creador',
        //   align: 'center',
        //   width: 150,
        //   value: 'properties.userCreated.name',
        //   class: 'redS--text'
        // },
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
      user: null,
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
      checkCloseStatus: false,
      transition: 'scale-transition',
      overlay: false,
      currentTicket: '',
      indexCurrentSyncUser: '',
      opacity: 0.8,
      selectedCourse: null,
      showTable: false,
      loadingButton: false,
      loadingUsers: false,
      selectedActivities: []
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
      clearTicketDetail: 'ticket/clearDetailTickets',
      fetchSections: 'section/fetchSections',
      fetchUsersByCourse: 'courseRegisteredUser/getCourseRegisteredByCourse',
      fetchTicketsByCourse: 'ticket/findTicketByCourse',
      findSpecificUserCourse:
        'courseRegisteredUser/findCourseRegisteredUserByUserCourse',
      fetchActivities: 'activity/fetchActivities',
      findUserByActivity:
        'courseRegisteredUser/findCourseRegisteredUserByActivity'
    }),

    remove(item) {
      console.log(item.id)
      console.log(this.selectedActivities)
      const index = this.selectedActivities.findIndex(
        activity => item.id === activity.id
      )

      console.log(index)
      if (index >= 0) this.selectedActivities.splice(index, 1)
    },
    findUserByActivityFiltered() {
      console.log(this.selectedActivities)
    },
    async findTicketByCourse() {
      this.loadingButton = true

      await this.fetchTicketsByCourse(this.selectedCourse)

      this.loadingButton = false
      this.loading = false
      this.showTable = true
    },

    async findUsersByCourse() {
      this.loadingUsers = true
      await this.fetchUsersByCourse(this.selectedCourse)
      this.filterUsersByCategoriesTicket()
      this.loadingUsers = false
    },

    async findUsers() {
      this.loadingButton = true
      const response = await this.fetchUsersByCourse(this.selectedCourse)

      this.filterUsersByCategories(response._data)

      this.showTable = true

      this.loadingButton = false
    },
    getValueProgress(user) {
      return user.progress
    },
    getColorState(state) {
      if (state) return 'redS darken-1'
      return 'blueS darken-1'
    },
    getGrades(section, activities) {
      if (activities && section) {
        return activities[section.id].filter(activity => {
          return activity.qualificationMoodle !== '-'
        })
      }
    },
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
          //this.fetchItems()
          this.findTicketByCourse()
          this.clearTicket()
        }
      }
    },
    async editItem(ticket) {
      const localTicket = ticket.properties

      this.priority = localTicket.priorityTicket
      this.type = localTicket.typeTicket
      this.motive = localTicket.motiveTicket
      this.status = localTicket.statusTicket
      this.source = localTicket.sourceTicket
      this.operator = localTicket.userAssigned
      this.rut = localTicket.courseRegisteredUser.registered_user.rut

      const user = localTicket.courseRegisteredUser

      this.editedTicketIndex = this.tickets.findIndex(
        find => find.properties.id === localTicket.id
      )

      this.selectCourse(user)

      this.editItem_ = Object.assign({}, localTicket)
      this.editedTicketItem.id = localTicket.id

      this.ticketClose = ticket.close
      this.checkCloseStatus = true

      await this.fetchTicketDetails(this.editItem_)

      this.dialog = true
      this.e1 = 3
    },
    async filterUsersByCategories(users) {
      if (this.category !== null) {
        this.selectedCourses.forEach(course => {
          this.userRegisteredFiltered = users.filter(userCourse => {
            return userCourse.course.id === course.id
          })
        })
      }
    },
    async filterUsersByCategoriesTicket() {
      this.userRegisteredFiltered = []

      const vm = this

      if (vm.classrooms.length === 0) {
        vm.courseRegisteredUserItems.forEach(userCourse => {
          vm.userRegisteredFiltered.push(userCourse)
        })
      } else {
        this.courseRegisteredUserItems.forEach(userCourse => {
          this.classrooms.forEach(classroom => {
            if (userCourse.classroom.description === classroom.description) {
              this.userRegisteredFiltered.push(userCourse)
            }
          })
        })
      }
    },
    async fetchDataCourses() {
      const { success, message } = await this.fetchCourseItems()
      if (!success) {
        this.snackbar = true

        this.message = message
      }
    },
    async fetchDataCategories() {
      const { success, message } = await this.fetchCategoryItems()
      console.log()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
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
            const payload = {
              course: this.selectedCourse.id,
              user: _data.id
            }

            const response = await this.findSpecificUserCourse(payload)

            const userCreated = response._data

            // this.arrayCourseUserSelect = this.courseRegisteredUserItems.filter(
            //   userCourse =>
            //     userCourse.registered_user.id === this.userCourse.id &&
            //     userCourse.is_sincronized === 1
            // )

            if (userCreated.is_sincronized === 0) {
              vm.snackbar = true
              vm.message = 'El estudiante no se encuentra registrado'
            } else {
              this.editedTicketItem.courseRegisteredUser = Object.assign(
                {},
                userCreated
              )

              this.user = Object.assign({}, this.mapUser(userCreated))
            }
          } else {
            vm.snackbar = true
            vm.message = 'El estudiantes no se encuentra registrado'
          }
        }
        this.searchRutLoading = false
      }, 1000)
    },
    mapUser(user) {
      if (user.activity_course_users.length !== 0) {
        let state
        let progress = 0
        const activities = user.activity_course_users
          .map(activity => {
            if (activity) {
              if (
                activity.activity.section.description === 'Renuncia' &&
                activity.status_moodle === 'Finalizado'
              ) {
                state = true
              } else {
                state = false
              }

              let checkQualificationMoodle = ['', '-']
              if (
                !checkQualificationMoodle.includes(
                  activity.qualification_moodle
                ) &&
                activity.activity.weighing !== 0
              ) {
                progress++
              }

              return {
                qualificationMoodle: activity.qualification_moodle,
                statusMoodle: activity.status_moodle,
                description: activity.activity.description,
                idActivityMoodle: activity.activity.id_activity_moodle,
                idSection: activity.activity.section_id,
                section: activity.activity.section.description,
                type: activity.activity.type,
                weighing: activity.activity.weighing
              }
            } else {
              return activity
            }
          })
          .filter(activity => {
            if (activity) {
              return activity.section !== 'Formativa'
            }
          })

        const totalProgress = this.sections
          .filter(section => {
            const filterSection = ['Formativa', 'Renuncia', 'Inicio', 'Cierre']
            return !filterSection.includes(section.description)
          })
          .reduce(
            (accumulator, currentValue) =>
              accumulator + currentValue.numberActivities,
            0
          )

        const accumulativeProgress = Number.parseFloat(
          (progress / totalProgress) * 100
        )
        user['state'] = state
        user[
          'fullname'
        ] = `${user.registered_user.name} ${user.registered_user.last_name}`
        user['progress'] = accumulativeProgress
        user['activities'] = this.groupBy(activities, 'idSection')
      }
      return user
    },
    selectCourse(user) {
      this.dialogSelectCourse = false

      this.editedTicketItem.courseRegisteredUser = Object.assign({}, user)

      this.user = Object.assign({}, this.mapUser(user))

      console.log(this.user)
    },
    groupBy(objectArray, property) {
      return objectArray.reduce(function(accumulator, object) {
        let key = object[property]
        if (!accumulator[key]) {
          accumulator[key] = []
        }
        accumulator[key].push(object)
        return accumulator
      }, {})
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
    async showSyncTickets(userCourse, index) {
      await new Promise(resolve => setTimeout(() => resolve(), 100))

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

      dataStoreTicket = {
        ...dataStoreTicket,
        ...{ course_registered_user_id: userCourse.id }
      }
      const { success, message, _data } = await this.postTicket(dataStoreTicket)

      if (success) {
        if (this.statusDetailMasive) {
          const dataDetailTicket = {
            comment: this.observationMassive,
            ticket_id: _data.properties.id,
            status_detail_ticket_id: this.statusDetailMasive.id,
            user_created_id: this.userLog.id
          }

          await this.postDetailTicket(dataDetailTicket)
        }

        this.currentTicket = `${userCourse.registered_user.name} ${userCourse.registered_user.last_name} del ${userCourse.classroom.description}`

        console.log('true')

        this.indexCurrentSyncUser = `${index + 1} de ${
          this.selected.length
        } para`
        if (index === this.selected.length - 1) {
          this.overlay = false
        }
      } else {
        this.snackbar = true
        this.message = message
      }
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
          this.observationMassive === '' &&
          this.statusDetail === null
        ) {
          this.snackbar = true
          this.message =
            'Debe seleccionar un intento de contacto y agregar una observación'
          this.checkCloseStatus = false
          this.$v.observation.$touch()
          this.$v.statusDetail.$touch()
        } else {
          this.dialogMassive = false
          this.overlay = true
          this.selected.forEachAsyncCustom(this.showSyncTickets)
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
      this.user = null
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
    this.loading = true
    this.fetchSections()
    // this.fetchCourseRegisteredUserItems()
    this.fetchDataCourses()
    this.fetchDataCategories()
    //this.filterUsersByCategories()
    this.fetchMotiveTicket()
    this.fetchPriorityTicket()
    this.fetchSourceTicket()
    this.fetchTypeTicket()
    this.fetchUser()
    this.fetchStatusTicket()
    this.fetchClassroom()
    this.fetchStatusDetailTicket()
    this.fetchDetailTicket()
    //   this.fetchItems().then(() => (this.loading = false))
    this.loadingButton = false
  },
  watch: {
    async category() {
      await this.fetchCourseByCategory(this.category.courses.href)
      // if (this.category !== null) {
      //   this.filterUsersByCategories()
      // }
    },
    async openTicket() {
      this.loading = true

      // this.fetchItems().then(() => (this.loading = false))

      await this.findTicketByCourse()

      this.loading = false
    },
    async closeTicket() {
      this.loading = true

      // this.fetchItems().then(() => (this.loading = false))

      await this.findTicketByCourse()

      this.loading = false
    },
    courseRegisteredUserItems() {
      if (this.courseRegisteredUserItems.length === 0) {
        this.showTable = false
      } else {
        this.showTable = true
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
      isAdmin: 'auth/isAdmin',
      isDeveloper: 'auth/isDeveloper',
      sections: 'section/sections',
      ticketsByCourse: 'ticket/ticketsByCourse',
      courseByCategory: 'course/coursesByCategory',
      activityItems: 'activity/activities'
    }),
    filterActivities() {
      return this.activityItems.filter(
        activity =>
          activity.weighing > 0 && this.selectedCourse.id === activity.course.id
      )
    },
    arrayCourseByCategory() {
      return this.courseByCategory.map(({ properties }) => {
        return { id: properties.id, description: properties.description }
      })
    },
    filteredTickets() {
      if (this.category === null) {
        return this.tickets
      } else {
        return this.ticketsByCourse[this.category.id]
      }
    },
    sectionFiltered() {
      return this.sections.filter(
        section =>
          section.description !== 'Formativa' &&
          section.description !== 'Renuncia'
      )
    },
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
              if (vm.isAdmin || vm.isDeveloper) {
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
              if (vm.isAdmin || vm.isDeveloper) {
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

<style scoped>
.v-card--reveal {
  align-items: flex-start;
  bottom: 22%;
  padding: 0.2em;
  justify-content: left;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}
.title-section {
  width: 100px;
  text-align: left;
}
</style>
