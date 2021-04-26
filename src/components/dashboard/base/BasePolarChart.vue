<template>
  <figure>
    <figcaption class="font-weight-bold">
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
  data: () => ({}),
  props: {
    render: Boolean,
    height: Number,
    chartData: Object,
    title: {
      type: String,
      default: () => 'Title'
    },
    legendPosition: {
      type: String,
      default: () => 'right'
    }
  },
  computed: {
    classHeight() {
      return `height: ${this.height}px;`
    },
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 10 } },
        legend: {
          display: false,
          position: this.legendPosition
        },
        scales: {
          y: {
            min: 0,
            max: 100
          }
        }
      }
    }
  },
  methods: {}
}
</script>
