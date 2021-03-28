<template>
  <figure>
    <figcaption>
      Prioridad Ticket
    </figcaption>
    <doughnut-chart
      v-if="loaded"
      :style="classHeight"
      :chart-data="chartData"
      :options="options"
    ></doughnut-chart>
  </figure>
</template>

<script>
import { mapActions } from 'vuex'
import DoughnutChart from '../chart/DoughnutChart'
export default {
  components: {
    DoughnutChart
  },
  data: () => ({
    chartData: {},
    options: null,
    loaded: false
  }),
  props: {
    render: Boolean,
    height: Number
  },
  async mounted() {
    await this.getChartPriorityTickets()
  },
  computed: {
    classHeight() {
      return `height: ${this.height}px;`
    }
  },
  methods: {
    ...mapActions({
      getPriorityDoughnutChart: 'dashboard/getPriorityDoughnutChart'
    }),
    async getChartPriorityTickets() {
      try {
        this.loaded = false
        const { chartData } = await this.getPriorityDoughnutChart(2)

        console.log('chartData ', chartData)

        this.chartData = chartData
        this.options = {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { right: 10 } },
          legend: {
            display: true
          }
        }

        this.loaded = true
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
