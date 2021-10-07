<template>
  <div class="container" :id="id" :ref="id"></div>
</template>

<script>
import echarts from 'echarts'

import {EleResize} from './ele.resize.js'
export default {
  name: '',
  components: {},
  props: {
    id: {
      type: String,
      default: 'pie'
    },

    data: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '标题'
    },
    color: {
      type: Array,
      default: () => ['#ffe000', '#ffa800', '#ff5b00', '#ff3000']
    },
    tip: {
      type: Object,
      default: () => {
        return {
          tip1: '程度',
          tip2: '占比'
        }
      }
    }
  },

  data () {
    return {
      theEcharts: null
    }
  },
  computed: {
    BaseOptions () {
      let options = {
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '14%',
          top: '16%',
          containLabel: true
        },
        legend: {
          data: ['1', '2', '3'],
          right: 10,
          top: 12,
          textStyle: {
            color: '#fff'
          },
          itemWidth: 12,
          itemHeight: 10
          // itemGap: 35
        },
        xAxis: {
          type: 'category',
          data: this.data.map((v) => v.title),
          axisLine: {
            lineStyle: {
              color: '#000'
            }
          },
          axisLabel: {
            // interval: 0,
            // rotate: 40,
            textStyle: {
              fontFamily: 'Microsoft YaHei'
            }
          }
        },

        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#000'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0,0,0,0.09)'
            }
          },
          axisLabel: {}
        },
        dataZoom: [
          {
            show: true,
            height: 12,
            xAxisIndex: [0],
            bottom: '8%',
            start: 10,
            end: 90,
            handleIcon:
              'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#d3dee5'
            },
            textStyle: {
              color: '#fff'
            },
            borderColor: '#90979c'
          },
          {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35
          }
        ],
        series: [
          {
            name: '林业灾害',
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#fccb05'
                  },
                  {
                    offset: 1,
                    color: '#f5804d'
                  }
                ]),
                barBorderRadius: 12
              }
            },
            data: this.data.map((v) => v.value1)
          },
          {
            name: '森林火灾',
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#8bd46e'
                  },
                  {
                    offset: 1,
                    color: '#09bcb7'
                  }
                ]),
                barBorderRadius: 11
              }
            },
            data: this.data.map((v) => v.value2)
          },
          {
            name: '病虫害',
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#248ff7'
                  },
                  {
                    offset: 1,
                    color: '#6851f1'
                  }
                ]),
                barBorderRadius: 11
              }
            },
            data: this.data.map((v) => v.value3)
          }
        ]
      }
      this.drawChart(options)
      return options
    }
  },
  created () {},
  mounted () {
    this.theEcharts = echarts.init(document.getElementById(this.id))
    this.theEcharts.clear() // 适用于大数据量的切换时图表绘制错误,先清空在重绘
    this.drawChart(this.BaseOptions)
  },
  methods: {
    drawChart (options) {
      // 装载数据
      const dom = this.$refs.id
      this.theEcharts.setOption(options, true) // 设置为true可以使图表切换数据时重新渲染
      const cb = () => {
        this.theEcharts.resize()
      }
      EleResize.on(dom, cb)
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
}
</style>
