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
    }
  },

  data () {
    return {
      theEcharts: null
    }
  },
  computed: {
    BaseOptions () {
      const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
      let options = {
        backgroundColor: '#fff',
        title: {
          show: false,
          textStyle: {
            fontSize: 12,
            fontWeight: 400
          },
          left: 'center',
          top: '5%'
        },
        grid: {
          top: '10%',
          left: '6%',
          right: '6%',
          bottom: '16%'
        },
        legend: {
          show: false,
          icon: 'circle',
          top: '5%',
          right: '5%',
          itemWidth: 6,
          itemGap: 20,
          textStyle: {
            color: '#556677'
          }
        },
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

        xAxis: [{
          type: 'category',
          data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
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
          },
          boundaryGap: false
        }],
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
        yAxis: [{
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
        }],
        series: [
          {
            name: 'NDVI',
            type: 'line',
            data: [15, 5, 22, 12, 15, 3, 7, 14, 5, 13, 12, 12, 14],
            symbolSize: 1,
            symbol: 'circle',
            smooth: true,
            yAxisIndex: 0,
            showSymbol: false,
            lineStyle: {
              width: 5,
              color: ' #fda085',
              shadowColor: 'rgba(158,135,255, 0.3)',
              shadowBlur: 10,
              shadowOffsetY: 20
            },
            itemStyle: {
              normal: {
                color: colorList[0],
                borderColor: colorList[0]
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
