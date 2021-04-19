<template>
  <figure>
    <figcaption>
      {{ title }}
    </figcaption>
    <horizontal-bar-chart
      v-if="render"
      :chart-data="chartData"
      :options="options"
      :style="classHeight"
    ></horizontal-bar-chart>
  </figure>
</template>

<script>
import HorizontalBarChart from '../../chart/HorizontalBarChart'
export default {
  components: {
    HorizontalBarChart
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
