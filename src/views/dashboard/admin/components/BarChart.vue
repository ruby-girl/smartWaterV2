<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

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
    }
  },
  data() {
    return {
      chart: null
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

      this.chart.setOption({
        color: ['#00B3A1', '#33B300', '#CC4141'],
        legend: {
          x: 'right',
          data: ['pageA', 'pageB', 'pageC']
        },
        tooltip: {
          backgroundColor: 'rgba(14, 43, 68, .6)',
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 40,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: true,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
        }],
        yAxis: [{
          type: 'value',
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
        }],
        series: [{
          name: 'pageA',
          type: 'bar',
          tiled: 'vistors',
          barWidth: '20',
          data: [79, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: 'pageB',
          type: 'bar',
          tiled: 'vistors',
          barWidth: '20',
          data: [80, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: 'pageC',
          type: 'bar',
          tiled: 'vistors',
          barWidth: '20',
          data: [30, 52, 200, 334, 390, 330, 220],
          animationDuration
        }]
      })
    }
  }
}
</script>
