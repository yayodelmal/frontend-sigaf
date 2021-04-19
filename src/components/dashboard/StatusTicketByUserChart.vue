<template>
  <horizontal-bar-chart
    v-if="loaded"
    :chart-data="chartData"
    :options="options"
    :style="classHeight"
  ></horizontal-bar-chart>
</template>

<script>
import { mapActions } from 'vuex'
import HorizontalBarChart from '../chart/HorizontalBarChart'
export default {
  components: {
    HorizontalBarChart
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
    await this.getChartStatusTicketbyOperator()
  },
  computed: {
    classHeight() {
      return `height: ${this.height}px;`
    }
  },
  methods: {
    ...mapActions({
      getStatusTicketByOperatorChart: 'dashboard/getStatusTicketByOperatorChart'
    }),
    async getChartStatusTicketbyOperator() {
      try {
        this.loaded = false
        const { chartData } = await this.getStatusTicketByOperatorChart(2)

        console.log('chartData ', chartData)

        this.chartData = chartData
        this.options = {
          tooltips: {
            mode: 'index',
            intersect: false
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                stacked: true,
                ticks: {
                  begintAtZero: true
                }
              }
            ],
            yAxes: [
              {
                stacked: true
              }
            ]
          },
          legend: {
            position: 'bottom'
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

<style lang="scss"></style>
