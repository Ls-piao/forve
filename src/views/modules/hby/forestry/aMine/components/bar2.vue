<template>
  <div class="chartcontainer" :id="id" :ref="id"></div>
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
      type: [String, Number],
      default: '标题'
    },
    subTitle: {
      type: String,
      default: '副标题'
    },
    color: {
      type: Array,
      default: () => ['#69AF4C', '#D5A75B', '#3F89E4', '#FD836C']
    },
    tip: {
      type: Object,
      default: () => {
        return {
          tip1: '程度',
          tip2: '占比'
        }
      }
    },
    axis: {
      type: String,
      default: '个'
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
        title: [
          {
            text: this.title.toString(),
            top: '6%',
            textAlign: 'center',
            left: '13%',
            textStyle: {
              color: '#fff',
              fontSize: 40,
              fontWeight: '550'
            }

          },
          {
            text: '单位:' + this.axis,
            textStyle: {
              color: '#fff',
              fontSize: 14,
              fontWeight: '400'
            },
            top: '18%',
            textAlign: 'center',
            right: '-6%'
          },
          {
            text: this.subTitle,
            top: '4%',
            textAlign: 'center',
            right: '-8%',
            textStyle: {
              color: '#fff',
              fontSize: 16,
              fontWeight: 'normal'
            }
          }
        ],
        backgroundColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: '#265A93' // 0% 处的颜色
          },
          {
            offset: 1,
            color: '#353D90' // 100% 处的颜色
          }
        ]),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '5%',
          top: '55%',
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
          data: this.data.map(v => v.title),
          axisLine: {
            lineStyle: {
              color: 'white'
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
          show: false,
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: 'white'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.3)'
            }
          },
          axisLabel: {}
        },
        series: [
          {
            type: 'bar',
            data: this.data.map(v => v.value),
            barWidth: '28px',
            itemStyle: {
              normal: {
                color: params => {
                  return this.color[params.dataIndex]
                }
              }
            },
            label: {
              normal: {
                show: true,
                lineHeight: 14,
                formatter: '{c}',
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 14
                }
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
.chartcontainer {
  height: 100%;
  width: 100%;
}
</style>
