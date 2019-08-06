<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        color: ['#00B3A1', '#33B300', '#CC4141'],
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: true,
          axisLine: {
            onZero: false,
            lineStyle: {
              type: 'solid',
              color: '#CFDAE6',
              width: 2
            }
          },
          axisLabel: {
            color: '#777C82',
            margin: 15
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 40,
          containLabel: true
        },
        tooltip: {
          backgroundColor: 'rgba(14, 43, 68, .6)',
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          padding: [5, 10]
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#DAE6F2'
            }
          },
          splitArea: {
            areaStyle: {
              color: 'transparent'
            }
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#fff'
            }
          },
          axisLabel: {
            color: '#777C82'
          }
        },
        legend: {
          x: 'right',
          data: ['expected', 'actual']
        },
        series: [{
          name: 'expected',
          itemStyle: {
            normal: {
              areaStyle: {
                color: 'transparent'
              }
            }
          },
          smooth: true,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: 'actual',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              areaStyle: {
                color: 'transparent'
              }
            }
          },
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
