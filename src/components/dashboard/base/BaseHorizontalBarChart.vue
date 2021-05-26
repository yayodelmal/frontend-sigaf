<template>
  <figure>
    <figcaption class="font-weight-bold">
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
    loaded: false
  }),
  props: {
    render: Boolean,
    height: Number,
    chartData: Object,
    title: {
      type: String,
      default: () => 'Title'
    },
    xLabel: {
      type: String,
      default: () => ''
    },
    yLabel: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    classHeight() {
      return `height: ${this.height}px;`
    },
    options() {
      return {
        tooltips: {
          mode: 'label',
          callbacks: {
            // We'll edit the `title` string
            title: function(tooltipItem) {
              // `tooltipItem` is an object containing properties such as
              // the dataset and the index of the current item

              // Here, `this` is the char instance

              // The following returns the full string
              return this._data.labels[tooltipItem[0].index]
            }
          }
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true,
              scaleLabel: {
                display: true,
                labelString: this.xLabel
              },
              ticks: {
                begintAtZero: true
              }
            }
          ],
          yAxes: [
            {
              stacked: true,
              scaleLabel: {
                display: true,
                labelString: this.yLabel
              },
              ticks: {
                callback: function(tick) {
                  var characterLimit = 30
                  if (tick.length >= characterLimit) {
                    return (
                      tick
                        .slice(0, tick.length)
                        .substring(0, characterLimit - 1)
                        .trim() + '...'
                    )
                  }
                  return tick
                }
              }
            }
          ]
        },
        legend: {
          display: false,
          position: 'bottom'
        }
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss"></style>
