<template>
  <figure>
    <figcaption>
      {{ title }}
    </figcaption>
    <pie-chart
      v-if="render"
      :style="classHeight"
      :chart-data="chartData"
      :options="options"
    ></pie-chart>
  </figure>
</template>

<script>
import PieChart from '../../chart/PieChart'
export default {
  components: {
    PieChart
  },
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 10 } },
      legend: {
        display: false
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
