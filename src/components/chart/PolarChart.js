import { PolarArea, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  name: 'PolarChart',
  extends: PolarArea,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
