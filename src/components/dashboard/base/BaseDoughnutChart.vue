<template>
  <figure>
    <figcaption>
      {{ title }}
    </figcaption>
    <doughnut-chart
      v-if="render"
      :style="classHeight"
      :chart-data="chartData"
      :options="options"
    ></doughnut-chart>
  </figure>
</template>

<script>
import DoughnutChart from '../../chart/DoughnutChart'
export default {
  components: {
    DoughnutChart
  },
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 10 } },
      legend: {
        display: true,
        position: 'bottom'
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
