<template>
  <div class="BarContiner" :id="id"></div>
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
      default: () => ['#FB6F3C', '#02BAE0', '#FF6D60', '#1EBFAF', '#79A2ED', '#FFB53E', '#8642CB']
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
      // let that = this
      let options = {
        backgroundColor: '#fbfbfb',
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            console.log(params)
            return params[0].marker + params[0].name + '<br>' + params[0].value + '吨'
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
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
            color: '#000'
          },
          itemWidth: 12,
          itemHeight: 10
          // itemGap: 35
        },
        xAxis: {
          type: 'category',
          data: this.data.map((v) => v.title),
          axisLine: {
            show: false,
            lineStyle: {
              color: '#000'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(0,0,0,0.3)'
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
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(250,250,250,1)', 'rgba(255,255,255,.5)']
            }
          },
          axisLabel: {}
        },
        series: [
          {
            type: 'bar',
            data: this.data.map(
              (v) => v.value
            ),
            barWidth: '14px',
            itemStyle: {
              normal: {
                color: params => {
                  return this.color[params.dataIndex]
                }
              }
            },
            label: {
              normal: {
                show: false,
                lineHeight: 30,
                formatter: '{c}',
                position: 'top',
                textStyle: {
                  color: '#00D6F9',
                  fontSize: 20
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
.BarContiner {
  height: 100%;
  width: 100%;
}
</style>
