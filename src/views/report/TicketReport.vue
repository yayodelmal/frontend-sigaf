<template>
  <base-card
    color="blueS"
    class="px-5 py-3"
    icon="mdi-clipboard-edit-outline"
    title="Reportes de ticket"
  >
    <sigaf-category-course-toolbar
      @selectedCourse="selectedCourse = $event"
      source="Reports"
    >
    </sigaf-category-course-toolbar>

    <v-card v-if="selectedCourse" class="mt-3">
      <v-card-text>
        <div class="d-flex">
          <v-tooltip top color="blueS">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-auto"
                color="blueS"
                dark
                v-bind="attrs"
                v-on="on"
                @click="handleDownloadReport"
              >
                <v-icon left> mdi-file-excel</v-icon>
                Descargar reporte
              </v-btn>
            </template>
            <span>Descargar reporte</span>
          </v-tooltip>
        </div>
        <v-row justify="center" align="center" no-gutters>
          <v-col cols="12" sm="4" class="mt-8">
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
                  <v-btn text color="primary" @click="$refs.dialog.save(dates)">
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
          <v-col cols="12" sm="7">
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
                  class="mx-4"
                  height="50"
                  width="125"
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
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-6" elevation="0">
      <v-expand-transition>
        <v-sheet v-if="model != null" tile>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-title>Producción del día:</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="8">
                      <v-card outlined>
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
                                  Intentos de contacto
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
                      </v-card>
                    </v-col>
                    <v-col cols="4" class="mt-n10">
                      <v-hover v-slot:default="{ hover }">
                        <v-card
                          class="d-flex text-center ma-1"
                          color="grey lighten-4"
                          :elevation="hover ? '5' : '0'"
                        >
                          <v-card-text>
                            <base-polar-chart
                              :render="renderChart"
                              :chartData="operatorChart"
                              title="Intentos según estado"
                              :height="150"
                          /></v-card-text> </v-card
                      ></v-hover>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card>
                <v-card-title>Actualización del día:</v-card-title>
                <v-card-text class="mt-5">
                  <v-row>
                    <v-col cols="12">
                      <v-row v-if="dataCard">
                        <v-col cols="3">
                          <base-material-stats-card
                            color="warning"
                            icon="mdi-view-dashboard"
                            title="Tickets nuevos"
                            :value="'+' + dataCard.newTicket"
                          />
                        </v-col>
                        <v-col cols="3">
                          <base-material-stats-card
                            color="warning"
                            icon="mdi-view-dashboard"
                            title="Tickets totales"
                            :value="'' + dataCard.total"
                          />
                        </v-col>
                        <v-col cols="3">
                          <base-material-stats-card
                            color="warning"
                            icon="mdi-view-dashboard"
                            title="Tickets abiertos"
                            :value="'' + dataCard.open"
                          />
                        </v-col>
                        <v-col cols="3">
                          <base-material-stats-card
                            color="warning"
                            icon="mdi-view-dashboard"
                            title="Tickets cerrados"
                            :value="'' + dataCard.close"
                          />
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col v-if="renderChart" cols="12">
                      <v-row>
                        <v-col cols="4">
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
                                  title="Ticket según estado"
                                  :height="200"
                              /></v-card-text> </v-card
                          ></v-hover>
                        </v-col>
                        <v-col cols="4">
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
                                  title="Ticket según origen"
                                  :height="200"
                              /></v-card-text> </v-card
                          ></v-hover>
                        </v-col>
                        <v-col cols="4">
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
                                  title="Ticket según tipo"
                                  :height="200"
                              /></v-card-text> </v-card
                          ></v-hover>
                        </v-col>
                        <v-col cols="4">
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
                                  title="Ticket según prioridad"
                                  :height="200"
                              /></v-card-text> </v-card
                          ></v-hover>
                        </v-col>

                        <v-col cols="4">
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
                                  title="Ticket según motivo"
                                  :height="200"
                              /></v-card-text> </v-card
                          ></v-hover>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-sheet>
      </v-expand-transition>
    </v-card>
  </base-card>
</template>

<script>
import moment from 'moment'
import axios from '../../services/axios'
import { mapActions, mapGetters } from 'vuex'
import SigafCategoryCourseToolbar from '../../components/utility/SigafCategoryCourseToolbar.vue'
import BaseDoughnutChart from '../../components/dashboard/base/BaseDoughnutChart.vue'
import BasePolarChart from '../../components/dashboard/base/BasePolarChart.vue'
export default {
  components: { SigafCategoryCourseToolbar, BaseDoughnutChart, BasePolarChart },
  data: () => ({
    model: null,
    modalDates: false,
    dates: [],
    transformDates: [],
    loadingDates: false,
    selectedCourse: null,
    renderChart: false
  }),
  computed: {
    ...mapGetters({
      chart: 'report/chartData',
      tableOperator: 'report/tableOperator',
      dataCard: 'report/dataCard',
      operatorChart: 'report/operatorChart'
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
      fetchTableOperatorByDate: 'report/fetchTableOperatorByDate',
      fetchSideCardReportData: 'report/fetchSideCardReportData'
    }),
    async handleDownloadReport() {
      const { data } = await axios.get(
        `/api/v2/reports/courses/${this.selectedCourse.id}/excel`
      )

      if (data.success) {
        const config = {
          responseType: 'blob' // o blob o arraybuffer
        }

        const response = await axios.get(
          `/api/v2/reports/courses/${this.selectedCourse.id}/excel-download`,
          config
        )

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'file.xlsx')
        document.body.appendChild(link)
        link.click()
      }
    },
    async handleChart() {
      await this.fetchChartByDate({
        course: this.selectedCourse.id,
        date: this.transformDates[this.model]
      })
      await this.fetchTableOperatorByDate({
        course: this.selectedCourse.id,
        date: this.transformDates[this.model]
      })
      await this.fetchSideCardReportData({
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
