<template>
  <v-container>
    <base-card
      color="blueS"
      class="px-5 py-3"
      icon="mdi-view-dashboard"
      title="Dashboard"
    >
      <v-row>
        <v-col cols="12">
          <v-toolbar dark color="blueS darken-1" class="mb-1">
            <v-select
              v-model="category"
              :items="categoryItems"
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
          </v-toolbar>
        </v-col>
      </v-row>
      <v-row v-if="loaded">
        <v-col cols="12" sm="6" md="6" lg="3">
          <base-material-stats-card
            color="info"
            icon="mdi-view-dashboard"
            title="Total tickets"
            value="245"
            sub-icon="mdi-clock"
            sub-text="Just Updated"
          />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="3">
          <base-material-stats-card
            color="warning"
            icon="mdi-view-dashboard"
            title="Nuevos tickets"
            value="+24"
            sub-icon="mdi-clock"
            sub-text="Just Updated"
          />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="3">
          <base-material-stats-card
            color="redS"
            icon="mdi-view-dashboard"
            title="Ticket abiertos"
            value="45"
            sub-icon="mdi-clock"
            sub-text="Just Updated"
          />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="3">
          <base-material-stats-card
            color="success"
            icon="mdi-view-dashboard"
            title="Ticket cerrados"
            value="200"
            sub-icon="mdi-clock"
            sub-text="Just Updated"
          />
        </v-col>
      </v-row>
      <v-row v-if="loaded">
        <v-col cols="12" sm="12" md="12" lg="4">
          <v-hover v-slot:default="{ hover }">
            <v-expand-transition>
              <v-card class="d-flex flex-column text-center">
                <div class="spacer-chart">
                  <v-btn>Actualizar</v-btn>
                </div>
                <v-card
                  color="white"
                  class="first v-sheet--offset transition-fast-in-fast-out mx-auto"
                  :class="{ 'v-card--reveal': hover }"
                  width="95%"
                >
                  <doughnut-chart
                    v-if="loaded"
                    :chartData="chartData"
                    :options="options"
                  >
                  </doughnut-chart>
                </v-card>
                <div class="title font-weight-light margin-custom">
                  Estado Tickets
                </div>
              </v-card>
            </v-expand-transition>
          </v-hover>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="4">
          <v-hover v-slot:default="{ hover }">
            <v-expand-transition>
              <v-card class="d-flex flex-column text-center">
                <div class="spacer-chart">
                  <v-btn>Actualizar</v-btn>
                </div>
                <v-card
                  class="first v-sheet--offset transition-fast-in-fast-out mx-auto"
                  color="whiteS"
                  :class="{ 'v-card--reveal': hover }"
                  width="95%"
                >
                  <bar-chart
                    v-if="loaded"
                    :chartData="chartDataBar"
                    :options="optionsBar"
                  >
                  </bar-chart>
                </v-card>
                <div class="title font-weight-light margin-custom">
                  Estado Ticket por Operador
                </div>
              </v-card>
            </v-expand-transition>
          </v-hover>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="4">
          <v-hover v-slot:default="{ hover }">
            <v-expand-transition>
              <v-card class="d-flex flex-column text-center">
                <div class="spacer-chart">
                  <v-btn>Actualizar</v-btn>
                </div>
                <v-card
                  class="first v-sheet--offset transition-fast-in-fast-out mx-auto"
                  color="whiteS"
                  :class="{ 'v-card--reveal': hover }"
                  width="95%"
                >
                  <doughnut-chart
                    v-if="loaded"
                    :chartData="chartDataPriority"
                    :options="optionsPriority"
                  >
                  </doughnut-chart>
                </v-card>
                <div class="title font-weight-light margin-custom">
                  Prioridad Ticket
                </div>
              </v-card>
            </v-expand-transition>
          </v-hover>
        </v-col>
      </v-row>
    </base-card>
  </v-container>
</template>

<script>
import DoughnutChart from '../components/chart/DoughnutChart'
import BarChart from '../components/chart/BarChart'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: {
    DoughnutChart,
    BarChart
  },
  data: () => ({
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
          backgroundColor: ['#F9A825', '#F9A825'],
          stack: 'Stack 0',
          data: []
        },
        {
          label: '',
          backgroundColor: ['#2E7D32', '#2E7D32'],
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
  mounted() {
    this.loaded = false
    this.fetchPriorityticket().then(() => {
      this.fillChartPriorityTicket()
    })

    this.fetchStatusTicket().then(() => {
      this.fillChartStatusTicket()
      this.fillChartStatusByOperator()
      this.loaded = true
    })
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
      courseByCategory: 'course/coursesByCategory'
    })
  },
  methods: {
    ...mapActions({
      fetchTicket: 'ticket/fetchTickets',
      fetchStatusTicket: 'statusTicket/fetchStatusTickets',
      fetchPriorityticket: 'priorityTicket/fetchPriorityTickets',
      fetchUsers: 'user/fetchUsers',
      fetchCourseItems: 'course/fetchCourses',
      fetchCategoryItems: 'category/fetchCategories',
      fetchCourseByCategory: 'course/getCoursesByCategory'
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
  top: -60px;
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
