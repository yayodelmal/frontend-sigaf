<template>
  <base-card
    color="blueS"
    class="px-5 py-3"
    icon="mdi-view-dashboard"
    title="Estadística"
  >
    <v-container>
      <v-row>
        <v-col cols="12">
          <sigaf-category-course-toolbar
            @selectedCourse="selectedCourse = $event"
            source="Dashboard"
          />
        </v-col>
      </v-row>
      <v-card v-if="selectedCourse" class="mt-3">
        <v-card-title class="mb-2">
          <span
            class="font-weight-bold  blueS--text overline d-flex justify-start ml-5"
          >
            Tickets
          </span></v-card-title
        >
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="3">
                <base-material-stats-card
                  color="warning"
                  icon="mdi-view-dashboard"
                  title="Tickets nuevos"
                  :value="'+' + lastDayTicket"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="3">
                <base-material-stats-card
                  color="info"
                  icon="mdi-view-dashboard"
                  title="Tickets totales"
                  :value="'' + totalTicket"
                />
              </v-col>

              <v-col cols="12" sm="6" md="6" lg="3">
                <base-material-stats-card
                  color="redS"
                  icon="mdi-view-dashboard"
                  title="Ticket abiertos"
                  :value="'' + openTickets"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="3">
                <base-material-stats-card
                  color="success"
                  icon="mdi-view-dashboard"
                  title="Ticket cerrados"
                  :value="'' + closeTickets"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" sm="12" md="4" lg="6">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                    max-height="300"
                  >
                    <v-card-text>
                      <base-doughnut-chart
                        :render="isLoadedSourceChart"
                        :chartData="sourcePieChart"
                        title="Ticket según origen"
                        :height="200"
                      />
                    </v-card-text> </v-card
                ></v-hover>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="6">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                    max-height="300"
                  >
                    <v-card-text>
                      <base-doughnut-chart
                        :render="isLoadedTypeChart"
                        :chartData="typePieChart"
                        title="Tipo según tipo"
                        :height="200"
                    /></v-card-text> </v-card
                ></v-hover>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="4">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                    outlined
                  >
                    <v-card-text>
                      <base-doughnut-chart
                        :render="isLoadedStatusChart"
                        :chartData="statusPieChart"
                        title="Ticket según estado"
                        :height="250"
                      />
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="8">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                  >
                    <v-card-text>
                      <base-horizontal-bar-chart
                        :render="isLoadedStatusTicketByOperator"
                        :chartData="statusTicketByOperatorChart"
                        title="Estado de ticket según operador"
                        :height="250"
                      />
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="8">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                    outlined
                    max-height="300"
                  >
                    <v-card-text>
                      <base-horizontal-bar-chart
                        :render="isLoadedStatusMotive"
                        :chartData="statusTicketByMotiveChart"
                        title="Estado de ticket según motivo"
                        :height="250"
                      />
                    </v-card-text> </v-card
                ></v-hover>
              </v-col>

              <v-col cols="12" sm="12" md="4" lg="4">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                    outlined
                  >
                    <v-card-text>
                      <base-polar-chart
                        :render="isLoadedTypeChart"
                        :chartData="motivePieChart"
                        title="Ticket según motivo"
                        :height="250"
                      />
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>

              <v-col cols="12" sm="12" md="4" lg="4">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                    outlined
                  >
                    <v-card-text>
                      <base-doughnut-chart
                        :render="isLoadedPriorityChart"
                        :chartData="priorityPieChart"
                        title="Ticket según prioridad"
                        :height="250"
                      />
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="8">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                    outlined
                  >
                    <v-card-text>
                      <base-bar-chart
                        :render="isLoadedAgeChart"
                        :chartData="agePieChart"
                        title="Ticket según antigüedad"
                        :height="250"
                      />
                    </v-card-text> </v-card
                ></v-hover>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
      <v-card v-if="selectedCourse" class="mt-5">
        <v-card-title class="mb-2">
          <span
            class="font-weight-bold  blueS--text overline d-flex justify-start ml-5"
          >
            Seguimiento de alumnos
          </span></v-card-title
        >
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="6" md="6" lg="3">
                <base-material-stats-card
                  color="warning"
                  icon="mdi-view-dashboard"
                  title="Matrícula inicial"
                  :value="'' + total"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="3">
                <base-material-stats-card
                  color="info"
                  icon="mdi-view-dashboard"
                  title="Renuncias"
                  :value="'' + resign"
                />
              </v-col>

              <v-col cols="12" sm="6" md="6" lg="3">
                <base-material-stats-card
                  color="redS"
                  icon="mdi-view-dashboard"
                  title="Activos"
                  :value="'' + active"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="3">
                <base-material-stats-card
                  color="success"
                  icon="mdi-view-dashboard"
                  title="Inactivos"
                  :value="'' + inactive"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" sm="12" md="4" lg="4">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                    max-height="300"
                  >
                    <v-card-text>
                      <base-doughnut-chart
                        :render="isLoadedStatusUserChart"
                        :chartData="statusUserChart"
                        title="Alumnos según estado"
                        :height="250"
                      />
                    </v-card-text> </v-card
                ></v-hover>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="8">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                  >
                    <v-card-text>
                      <base-horizontal-bar-chart
                        :render="isLoadedProgressStudentSection"
                        :chartData="progressStudentSection"
                        title="Progreso de actividades calificadas según unidad (%)"
                        :height="250"
                      />
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="8">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                  >
                    <v-card-text>
                      <base-horizontal-bar-chart
                        :render="isLoadedAvanceProgressStudentSection"
                        :chartData="avanceProgressStudentSection"
                        title="Progreso de actividades realizadas según unidad (%)"
                        :height="250"
                      />
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
              <v-col cols="12" sm="12" md="4" lg="4">
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="d-flex text-center ma-1"
                    color="grey lighten-4"
                    :elevation="hover ? '5' : '0'"
                    max-height="300"
                  >
                    <v-card-text>
                      <base-doughnut-chart
                        :render="isLoadedTimeLoggedUserChart"
                        :chartData="timeLoggedUserChart"
                        title="Alumnos según último acceso"
                        :height="250"
                      />
                    </v-card-text> </v-card
                ></v-hover>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-container>
  </base-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SigafCategoryCourseToolbar from '../components/utility/SigafCategoryCourseToolbar.vue'
import BaseHorizontalBarChart from '../components/dashboard/base/BaseHorizontalBarChart.vue'
import BaseDoughnutChart from '../components/dashboard/base/BaseDoughnutChart.vue'
import BasePolarChart from '../components/dashboard/base/BasePolarChart.vue'
import BaseBarChart from '../components/dashboard/base/BaseBarChart.vue'

export default {
  name: 'Dashboard',
  components: {
    SigafCategoryCourseToolbar,
    BaseHorizontalBarChart,
    BaseDoughnutChart,
    BasePolarChart,
    BaseBarChart
  },
  data: () => ({
    selectedCourse: null,
    motiveStatusChartData: null,
    loaded: false,
    category: null,
    chartData: {
      labels: [],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: ['#027087', '#404040'],
          data: []
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateScale: true,
        animateRotate: true
      }
    },
    chartDataPriority: {
      labels: [],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: ['#2E7D32 ', '#F9A825', '#D32F2F'],
          data: []
        }
      ]
    },
    optionsPriority: {
      responsive: true,
      maintainAspectRatio: false
    },
    chartDataBar: {
      labels: [],
      datasets: [
        {
          label: '',
          backgroundColor: [
            '#F9A825',
            '#F9A825',
            '#F9A825',
            '#F9A825',
            '#F9A825'
          ],
          stack: 'Stack 0',
          data: []
        },
        {
          label: '',
          backgroundColor: [
            '#2E7D32',
            '#2E7D32',
            '#2E7D32',
            '#2E7D32',
            '#2E7D32'
          ],
          stack: 'Stack 0',
          data: []
        }
      ]
    },
    optionsBar: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: 'index',
        intersect: false
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    }
  }),
  async created() {
    this.fetchTicket()
    this.fetchUsers()
    this.fetchDataCategoryItems()
  },
  async mounted() {
    this.loaded = false
    this.fetchPriorityticket().then(() => {
      this.fillChartPriorityTicket()
    })

    await this.getSourcePieChart(2)
    await this.fetchTotalTicket(2)
    this.fetchStatusTicket().then(() => {
      this.fillChartStatusTicket()
      this.fillChartStatusByOperator()
      this.loaded = true
    })
  },
  watch: {
    async selectedCourse() {
      await this.getLastDayTicket(this.selectedCourse.id)
      await this.getOpenTicket(this.selectedCourse.id)
      await this.getCloseTicket(this.selectedCourse.id)
      await this.fetchTotalTicket(this.selectedCourse.id)
      await this.getStatusTicketMotiveChart(this.selectedCourse.id)
      await this.getTypePieChart(this.selectedCourse.id)
      await this.getMotivePieChart(this.selectedCourse.id)
      await this.getAgeTicketPieChart(this.selectedCourse.id)
      await this.getSourcePieChart(this.selectedCourse.id)
      await this.getPriorityPieChart(this.selectedCourse.id)
      await this.getStatusPieChart(this.selectedCourse.id)
      await this.getStatusUserChart(this.selectedCourse.id)
      await this.getTimeLoggedUserChart(this.selectedCourse.id)
      await this.getStatusTicketByOperatorChart(this.selectedCourse.id)
      await this.getDataCardFollowStudent(this.selectedCourse.id)
      await this.getProgressStudentBySection(this.selectedCourse.id)
      await this.getAvanceProgressStudentBySection(this.selectedCourse.id)
    }
  },
  computed: {
    ...mapGetters({
      ticketsByStatus: 'ticket/getStatusTicket',
      statusTicket: 'statusTicket/statusTickets',
      priorityTicket: 'priorityTicket/priorityTickets',
      statusByOperator: 'statusTicket/statusTicketByOperator',
      users: 'user/users',
      courseItems: 'course/courses',
      categoryItems: 'category/categories',
      courseByCategory: 'course/coursesByCategory',
      totalTicket: 'dashboard/totalTicket',
      lastDayTicket: 'dashboard/lastDayTicket',
      openTickets: 'dashboard/openTickets',
      closeTickets: 'dashboard/closeTickets',
      statusTicketByMotiveChart: 'dashboard/statusTicketByMotiveChart',
      isLoadedStatusMotive: 'dashboard/isLoadedStatusMotive',
      isLoadedTypeChart: 'dashboard/isLoadedTypeChart',
      isLoadedSourceChart: 'dashboard/isLoadedSourceChart',
      isLoadedAgeChart: 'dashboard/isLoadedAgeChart',
      isLoadedStatusChart: 'dashboard/isLoadedStatusChart',
      isLoadedPriorityChart: 'dashboard/isLoadedPriorityChart',
      isLoadedStatusUserChart: 'dashboard/isLoadedStatusUserChart',
      isLoadedTimeLoggedUserChart: 'dashboard/isLoadedStatusUserChart',
      typePieChart: 'dashboard/typePieChart',
      motivePieChart: 'dashboard/motivePieChart',
      agePieChart: 'dashboard/agePieChart',
      sourcePieChart: 'dashboard/sourcePieChart',
      statusPieChart: 'dashboard/statusPieChart',
      priorityPieChart: 'dashboard/priorityPieChart',
      statusUserChart: 'dashboard/statusUserChart',
      timeLoggedUserChart: 'dashboard/timeLoggedUserChart',
      statusTicketByOperatorChart: 'dashboard/statusTicketByOperatorChart',
      isLoadedStatusTicketByOperator:
        'dashboard/isLoadedStatusTicketByOperator',
      dataCardFollowStudent: 'dashboard/dataCardFollowStudent',
      isDataCardFollowStudent: 'dashboard/isDataCardFollowStudent',
      progressStudentSection: 'dashboard/progressStudentSection',
      isLoadedProgressStudentSection:
        'dashboard/isLoadedProgressStudentSection',
      avanceProgressStudentSection: 'dashboard/avanceProgressStudentSection',
      isLoadedAvanceProgressStudentSection:
        'dashboard/isLoadedAvanceProgressStudentSection'
    }),
    resign() {
      if (!this.dataCardFollowStudent) return ''
      return this.dataCardFollowStudent.resign
    },
    active() {
      if (!this.dataCardFollowStudent) return ''
      return this.dataCardFollowStudent.active
    },
    inactive() {
      if (!this.dataCardFollowStudent) return ''
      return this.dataCardFollowStudent.inactive
    },
    total() {
      if (!this.dataCardFollowStudent) return ''
      return this.dataCardFollowStudent.total
    }
  },
  methods: {
    ...mapActions({
      fetchTicket: 'ticket/fetchTickets',
      fetchStatusTicket: 'statusTicket/fetchStatusTickets',
      fetchPriorityticket: 'priorityTicket/fetchPriorityTickets',
      fetchUsers: 'user/fetchUsers',
      fetchCourseItems: 'course/fetchCourses',
      fetchCategoryItems: 'category/fetchCategories',
      fetchCourseByCategory: 'course/getCoursesByCategory',
      getSourcePieChart: 'dashboard/getSourcePieChart',
      fetchTotalTicket: 'dashboard/getTotalTicket',
      getLastDayTicket: 'dashboard/getLastDayTicket',
      getOpenTicket: 'dashboard/getOpenTicket',
      getCloseTicket: 'dashboard/getCloseTicket',
      getStatusTicketMotiveChart: 'dashboard/getStatusTicketMotiveChart',
      getTypePieChart: 'dashboard/getTypePieChart',
      getMotivePieChart: 'dashboard/getMotivePieChart',
      getAgeTicketPieChart: 'dashboard/getAgeTicketPieChart',
      getStatusPieChart: 'dashboard/getStatusPieChart',
      getPriorityPieChart: 'dashboard/getPriorityPieChart',
      getStatusUserChart: 'dashboard/getStatusUserChart',
      getTimeLoggedUserChart: 'dashboard/getTimeLoggedUserChart',
      getStatusTicketByOperatorChart:
        'dashboard/getStatusTicketByOperatorChart',
      getDataCardFollowStudent: 'dashboard/getDataCardFollowStudent',
      getProgressStudentBySection: 'dashboard/getProgressStudentBySection',
      getAvanceProgressStudentBySection:
        'dashboard/getAvanceProgressStudentBySection'
    }),
    fillChartStatusTicket() {
      this.statusTicket.forEach(status => {
        this.chartData.labels.push(status.description)
        this.chartData.datasets[0].data.push(status.tickets.numberOfElements)
      })
    },
    fillChartPriorityTicket() {
      this.priorityTicket.forEach(priority => {
        if (priority.description === 'Baja') {
          this.chartDataPriority.labels[0] = priority.description
          this.chartDataPriority.datasets[0].data[0] =
            priority.tickets.numberOfElements
        }

        if (priority.description === 'Media') {
          this.chartDataPriority.labels[1] = priority.description
          this.chartDataPriority.datasets[0].data[1] =
            priority.tickets.numberOfElements
        }

        if (priority.description === 'Alta') {
          this.chartDataPriority.labels[2] = priority.description
          this.chartDataPriority.datasets[0].data[2] =
            priority.tickets.numberOfElements
        }
      })
    },
    fillChartStatusByOperator() {
      this.statusByOperator.forEach((status, index) => {
        const names = Object.keys(status.array)
        if (this.chartDataBar.labels.length === 0) {
          this.chartDataBar.labels = names
        }
        this.chartDataBar.datasets[index].label = status.status.description
        const arrayData = Object.values(status.array)
        arrayData.forEach(data => {
          this.chartDataBar.datasets[index].data.push(data.length)
        })
      })
    },
    async fetchDataCategoryItems() {
      const { success, message } = await this.fetchCategoryItems()
      if (!success) {
        this.snackbar = true
        this.message = message
      }
    }
  }
}
</script>
<style scoped>
.v-sheet--offset {
  top: -15px;
  position: relative;
}
.v-card--reveal {
  top: -30px;
  position: relative;
}

.first {
  padding: 16px 0;
  position: relative;
}

.spacer-chart {
  top: 410px;
  position: relative;
}

.margin-custom {
  top: -7px;
  position: relative;
}

canvas {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
