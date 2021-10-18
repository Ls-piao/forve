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
    //   const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
      let options = {
        backgroundColor: '#fff',
        title: {
          show: false,
          text: '全国6月销售统计',
          textStyle: {
            fontSize: 12,
            fontWeight: 400
          },
          left: 'center',
          top: '5%'
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '3%',
          bottom: '20%'
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
          data: this.data.map((v) => v.title),
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
            margin: 27
          },
          axisPointer: {
            label: {
                // padding: [11, 5, 7],
              padding: [0, 0, 0, 0],
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
        series: [{
          name: '乔木林地',
          type: 'line',

          showSymbol: false,
          data: this.data.map((v) => v.value1),
          smooth: true,
          symbolSize: 6,
          lineStyle: {
            normal: {
              color: '#0081ff',
              shadowColor: ' rgba(0, 129, 255,1)',
              shadowBlur: 3,
              shadowOffsetY: 8
            }
          },
          areaStyle: {
            normal: {
              color: 'rgba(0, 129, 255)',
              shadowColor: 'rgba(0, 129, 255,1)',
              shadowBlur: 10
            }
          }
        },
        {
          name: '灌木林地',
          type: 'line',

          showSymbol: false,
          data: this.data.map((v) => v.value2),
          smooth: true,
          symbolSize: 6,
          lineStyle: {
            normal: {
              color: 'rgb(57, 181, 74)',
              shadowColor: 'rgba(57, 181, 74,1)',
              shadowBlur: 3,
              shadowOffsetY: 8
            }
          },
          areaStyle: {
            normal: {
              color: 'rgb(57, 181, 74)',
              shadowColor: 'rgba(57, 181, 74,1)',
              shadowBlur: 10
            }
          }
        },
        {
          name: '沼泽林地',
          type: 'line',

          showSymbol: false,
          data: this.data.map((v) => v.value3),
          smooth: true,
          symbolSize: 6,
          lineStyle: {
            normal: {
              color: 'rgb(246, 211, 101)',
              shadowColor: 'rgba(246, 211, 101,1)',
              shadowBlur: 3,
              shadowOffsetY: 8
            }
          },
          areaStyle: {
            normal: {
              color: 'rgb(246, 211, 101)',
              shadowColor: 'rgba(246, 211, 101,1)',
              shadowBlur: 10
            }
          }
        },
        {
          name: '其他林地',
          type: 'line',

          showSymbol: false,
          data: this.data.map((v) => v.value4),
          smooth: true,
          symbolSize: 6,
          lineStyle: {
            normal: {
              color: ' rgb(48, 207, 208)',
              shadowColor: ' rgba(48, 207, 208,1)',
              shadowBlur: 3,
              shadowOffsetY: 8
            }
          },
          areaStyle: {
            normal: {
              color: ' rgb(48, 207, 208)',
              shadowColor: ' rgba(48, 207, 208,1)',
              shadowBlur: 10
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
