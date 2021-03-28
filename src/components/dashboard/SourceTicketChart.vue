<template>
  <figure>
    <figcaption>
      Origen Ticket
    </figcaption>
    <pie-chart
      v-if="loaded"
      :style="classHeight"
      :chart-data="chartData"
      :options="options"
    ></pie-chart>
  </figure>
</template>

<script>
import { mapActions } from 'vuex'
import PieChart from '../chart/PieChart'
export default {
  components: {
    PieChart
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
    await this.getChartSourceTickets()
  },
  computed: {
    classHeight() {
      return `height: ${this.height}px;`
    }
  },
  methods: {
    ...mapActions({
      getSourcePieChart: 'dashboard/getSourcePieChart'
    }),
    async getChartSourceTickets() {
      try {
        this.loaded = false
        const { chartData } = await this.getSourcePieChart(2)

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
