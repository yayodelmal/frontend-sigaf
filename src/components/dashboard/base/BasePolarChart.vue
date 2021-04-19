<template>
  <figure>
    <figcaption>
      {{ title }}
    </figcaption>
    <polar-chart
      v-if="render"
      :style="classHeight"
      :chart-data="chartData"
      :options="options"
    ></polar-chart>
  </figure>
</template>

<script>
import PolarChart from '../../chart/PolarChart'
export default {
  components: {
    PolarChart
  },
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 10 } },
      legend: {
        display: true,
        position: 'right'
      },
      scales: {
        y: {
          min: 0,
          max: 100
        }
      }
    }
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
