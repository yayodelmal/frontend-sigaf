<template>
  <figure>
    <figcaption class="font-weight-bold">
      {{ title }}
    </figcaption>
    <bar-chart
      v-if="render"
      :chart-data="chartData"
      :options="options"
      :style="classHeight"
    ></bar-chart>
  </figure>
</template>

<script>
import BarChart from '../../chart/BarChart'
export default {
  components: {
    BarChart
  },
  data: () => ({
    options: {
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
        display: false,
        position: 'bottom'
      }
    },
    loaded: false
  }),
  props: {
    render: Boolean,
    height: Number,
    chartData: Object,
    title: {
      type: String,
      default: () => 'Title'
    }
  },
  computed: {
    classHeight() {
      return `height: ${this.height}px;`
    }
  },
  methods: {}
}
</script>

<style lang="scss"></style>
