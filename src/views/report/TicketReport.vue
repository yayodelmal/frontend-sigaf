<template>
  <div>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-clipboard-edit-outline"
      title="Reportes de ticket"
    >
      <v-card>
        <sigaf-category-course-toolbar
          @selectedCourse="selectedCourse = $event"
          source="Reports"
        ></sigaf-category-course-toolbar>
        <v-card-text>
          <v-row justify="center">
            <v-col cols="12" sm="4">
              <div class="d-flex">
                <v-dialog
                  ref="dialog"
                  v-model="modalDates"
                  :return-value.sync="dates"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText"
                      label="Rango de fechas"
                      prepend-inner-icon="mdi-calendar"
                      color="blueS"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="dates" range>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modalDates = false">
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(dates)"
                    >
                      Aceptar
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
                <v-btn
                  class="ml-2"
                  color="blueS"
                  dark
                  @click="handleFindByRangeOfDates"
                  :loading="loadingDates"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-sheet class="mx-auto" elevation="8">
            <v-slide-group
              v-model="model"
              class="pa-4"
              show-arrows
              center-active
            >
              <v-slide-item
                v-for="date in transformDates"
                :key="date"
                v-slot="{ active, toggle }"
              >
                <v-card
                  :color="active ? 'blueS' : 'grey lighten-2'"
                  class="ma-4"
                  height="50"
                  width="150"
                  outlined
                  @click="
                    toggle()
                    handleChart()
                  "
                >
                  <v-row class="fill-height" align="center" justify="center">
                    <v-scale-transition>
                      <v-icon
                        v-if="active"
                        color="white"
                        size="24"
                        v-text="'mdi-calendar-check'"
                      ></v-icon>
                    </v-scale-transition>
                  </v-row>
                  <div class="d-flex">
                    <span
                      :class="active ? 'white--text' : 'black--text'"
                      class="mx-auto"
                      >{{ date }}</span
                    >
                  </div>
                </v-card>
              </v-slide-item>
            </v-slide-group>

            <v-expand-transition>
              <v-sheet v-if="model != null" height="200" tile>
                <v-row>
                  <v-col cols="3">
                    <v-row>
                      <v-col cols="12">
                        <base-material-stats-card
                          color="warning"
                          icon="mdi-view-dashboard"
                          title="Tickets nuevos"
                          :value="'+' + '10'"
                        />
                      </v-col>
                      <v-col cols="12">
                        <base-material-stats-card
                          color="warning"
                          icon="mdi-view-dashboard"
                          title="Tickets totales"
                          :value="'+' + '10'"
                        />
                      </v-col>
                      <v-col cols="12">
                        <base-material-stats-card
                          color="warning"
                          icon="mdi-view-dashboard"
                          title="Tickets abiertos"
                          :value="'+' + '10'"
                        />
                      </v-col>
                      <v-col cols="12">
                        <base-material-stats-card
                          color="warning"
                          icon="mdi-view-dashboard"
                          title="Tickets cerrados"
                          :value="'+' + '10'"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="9">
                    <v-row class="fill-height" align="center" justify="center">
                      <v-col cols="12">
                        <v-simple-table dense>
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">
                                  Operador
                                </th>
                                <th class="text-left">
                                  Ticket trabajados
                                </th>
                                <th class="text-left">
                                  Ticket resueltos
                                </th>
                                <th class="text-left">
                                  Intentos realizados
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="item in tableOperator"
                                :key="item.operator"
                              >
                                <td>{{ item.operator }}</td>
                                <td>{{ item.tickets }}</td>
                                <td>{{ item.close }}</td>
                                <td>{{ item.attemps }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-col>

                      <v-col cols="12" sm="12" md="12" lg="4">
                        <v-hover v-slot:default="{ hover }">
                          <v-card
                            class="d-flex text-center ma-1"
                            color="grey lighten-4"
                            :elevation="hover ? '5' : '0'"
                            max-height="300"
                          >
                            <v-card-text>
                              <base-doughnut-chart
                                :render="renderChart"
                                :chartData="chart.priority.chartData"
                                title="Prioridad de ticket"
                                :height="200"
                            /></v-card-text> </v-card
                        ></v-hover>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" lg="4">
                        <v-hover v-slot:default="{ hover }">
                          <v-card
                            class="d-flex text-center ma-1"
                            color="grey lighten-4"
                            :elevation="hover ? '5' : '0'"
                            max-height="300"
                          >
                            <v-card-text>
                              <base-doughnut-chart
                                :render="renderChart"
                                :chartData="chart.source.chartData"
                                title="Origen de ticket"
                                :height="200"
                            /></v-card-text> </v-card
                        ></v-hover>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" lg="4">
                        <v-hover v-slot:default="{ hover }">
                          <v-card
                            class="d-flex text-center ma-1"
                            color="grey lighten-4"
                            :elevation="hover ? '5' : '0'"
                            max-height="300"
                          >
                            <v-card-text>
                              <base-doughnut-chart
                                :render="renderChart"
                                :chartData="chart.type.chartData"
                                title="Tipo de ticket"
                                :height="200"
                            /></v-card-text> </v-card
                        ></v-hover>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" lg="4">
                        <v-hover v-slot:default="{ hover }">
                          <v-card
                            class="d-flex text-center ma-1"
                            color="grey lighten-4"
                            :elevation="hover ? '5' : '0'"
                            max-height="300"
                          >
                            <v-card-text>
                              <base-doughnut-chart
                                :render="renderChart"
                                :chartData="chart.motive.chartData"
                                title="Motivo de ticket"
                                :height="200"
                            /></v-card-text> </v-card
                        ></v-hover>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" lg="4">
                        <v-hover v-slot:default="{ hover }">
                          <v-card
                            class="d-flex text-center ma-1"
                            color="grey lighten-4"
                            :elevation="hover ? '5' : '0'"
                            max-height="300"
                          >
                            <v-card-text>
                              <base-doughnut-chart
                                :render="renderChart"
                                :chartData="chart.status.chartData"
                                title="Estado de ticket"
                                :height="200"
                            /></v-card-text> </v-card
                        ></v-hover>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-expand-transition>
          </v-sheet>
        </v-card-text>
      </v-card>
    </base-card>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import SigafCategoryCourseToolbar from '../../components/utility/SigafCategoryCourseToolbar.vue'
import BaseDoughnutChart from '../../components/dashboard/base/BaseDoughnutChart.vue'
export default {
  components: { SigafCategoryCourseToolbar, BaseDoughnutChart },
  data: () => ({
    model: null,
    modalDates: false,
    dates: [],
    transformDates: [],
    loadingDates: false,
    selectedCourse: null,
    renderChart: false,
    desserts: [
      {
        name: 'Frozen Yogurt',
        calories: 159
      },
      {
        name: 'Ice cream sandwich',
        calories: 237
      },
      {
        name: 'Eclair',
        calories: 262
      },
      {
        name: 'Cupcake',
        calories: 305
      },
      {
        name: 'Gingerbread',
        calories: 356
      }
    ]
  }),
  computed: {
    ...mapGetters({
      chart: 'report/chartData',
      tableOperator: 'report/tableOperator'
    }),
    dateRangeText() {
      if (this.dates) {
        let array = [...this.dates]

        const mappedArray = array.map(date => {
          const split = date.split('-')

          return `${split[2]}-${split[1]}-${split[0]}`
        })
        return mappedArray.join(' a ')
      } else {
        return ''
      }
    }
  },
  methods: {
    ...mapActions({
      fetchChartByDate: 'report/fetchChartByDate',
      fetchTableOperatorByDate: 'report/fetchTableOperatorByDate'
    }),
    async handleChart() {
      await this.fetchChartByDate({
        course: this.selectedCourse.id,
        date: this.transformDates[this.model]
      })
      await this.fetchTableOperatorByDate({
        course: this.selectedCourse.id,
        date: this.transformDates[this.model]
      })
      this.$nextTick(() => {
        this.renderChart = true
      })
    },
    handleFindByRangeOfDates() {
      if (this.dates.length === 2) {
        const firstDay = moment(this.dates[0])
        const secondDay = moment(this.dates[1])

        const numberOfDays = secondDay.diff(firstDay, 'days')

        let dates = []
        let date = moment(this.dates[0])
        dates.push(date.format('DD-MM-YYYY'))
        for (let index = 0; index < numberOfDays; index++) {
          const newDate = date.add(1, 'days')
          dates.push(newDate.format('DD-MM-YYYY'))
        }

        this.transformDates = [...dates]
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
