<template>
  <div class="container" :id="id"></div>
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
      // let that = this
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
              color: ['rgba(250,250,250,0.0)', 'rgba(0,0,0,0.05)']
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
            type: 'bar',
            data: this.data.map(
              (v) => Number(v.value1) + Number(v.value2) + Number(v.value3)
            ),
            barWidth: '14px',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#0081ff' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#1cbbb4' // 100% 处的颜色
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0,160,221,1)',
                shadowBlur: 4
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
.container {
  height: 100%;
  width: 100%;
}
</style>
