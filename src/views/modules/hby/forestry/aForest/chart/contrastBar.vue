<template>
  <div class="container" :id="id" :ref="id"></div>
</template>

<script>
import echarts from 'echarts'
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
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              show: true,
              backgroundColor: '#fff',
              color: '#556677',
              borderColor: 'rgba(0,0,0,0)',
              shadowColor: 'rgba(0,0,0,0)',
              shadowOffsetY: 0
            },
            lineStyle: {
              width: 0
            }
          },
          backgroundColor: '#fff',
          textStyle: {
            color: '#5c6c7c'
          },
          padding: [10, 10],
          extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '4%',
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
          data: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
          axisLine: {
            lineStyle: {
              color: '#DCE2E8'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#556677'
            },
            // 默认x轴字体大小
            fontSize: 12,
            // margin:文字到x轴的距离
            margin: 15
          },
          axisPointer: {
            label: {
                // padding: [11, 5, 7],
              padding: [0, 0, 10, 0],
              margin: 15,
              fontSize: 12,
              backgroundColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: '#fff' // 0% 处的颜色
                }, {
                        // offset: 0.9,
                  offset: 0.86,

                  color: '#fff' // 0% 处的颜色
                }, {
                  offset: 0.86,
                  color: '#33c0cd' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#33c0cd' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }
        },

        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#DCE2E8'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#556677'
            }
          },
          splitLine: {
            show: true
          }
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
            name: '乔木面积',
            type: 'bar',
            data: [55, 112, 35, 68, 78, 91, 54, 111, 101, 132, 99, 100],
            barWidth: '16px',
            itemStyle: {
              normal: {
                color: ' #fda085',
                shadowColor: 'rgba(158,135,255, 0.3)'
              }
            }
          },
          {
            name: '灌木面积',
            type: 'bar',
            data: [33, 44, 55, 66, 77, 11, 22, 33, 55, 66, 11, 55],
            barWidth: '16px',
            itemStyle: {
              normal: {
                color: ' rgba(0, 129, 255,1)',
                shadowColor: 'rgba(0, 129, 255,.1)'
              }
            }
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
      this.theEcharts.setOption(options, true) // 设置为true可以使图表切换数据时重新渲染
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
