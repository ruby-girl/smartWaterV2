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
    },
    barData: {
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
    barData: {
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
      this.setOptions(this.barData)
    },
    setOptions({ TodayPayment, TodayOpenAccount, TodayCancelAccount } = {}) {
      this.chart.setOption({
        color: ['#00B3A1', '#33B300', '#CC4141'],
        legend: {
          x: 'right',
          data: ['缴费统计', '开户统计','销户统计']
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
          data: [this.getNowFormatDate()],
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
          name: '缴费统计',
          type: 'bar',
          tiled: 'vistors',
          barWidth: '20',
          data: [TodayPayment],
          animationDuration
        }, {
          name: '开户统计',
          type: 'bar',
          tiled: 'vistors',
          barWidth: '20',
          data: [TodayOpenAccount],
          animationDuration
        }, {
          name: '销户统计',
          type: 'bar',
          tiled: 'vistors',
          barWidth: '20',
          data: [TodayCancelAccount],
          animationDuration
        }]
      })
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + '00' + seperator2 + '00'
        + seperator2 + '00';
      return currentdate;
    }
  }
}
</script>
