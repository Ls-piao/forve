<template>
  <div class="pieContainer" :id="id" :ref="id"></div>
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
      default: () => [
        { title: '近危', value: 55 },
        { title: '易危', value: 15 },
        { title: '濒危', value: 30 }
      ]
    },
    title: {
      type: String,
      default: '标题'
    },
    color: {
      type: Array,
      default: () => ['#AF79F4', '#12CAEA', '#F3A3C4', '#528EF5']
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
      let data = []
      for (var i = 0; i < this.data.length; i++) {
        data.push(
          {
            value: this.data[i].value || 0,
            name: this.data[i].title,
            itemStyle: {
              borderWidth: 3,
              borderColor: '#fff'
            }
          }
        )
      }
      let that = this
      let options = {
        backgroundColor: '#fdfbfb',
        tooltip: {
          show: true
        },
        color: this.color,
        legend: {
          icon: 'circle',
          orient: 'vertical',
          // x: 'left',
          right: 20,
          bottom: 80,
          align: 'left',
          textStyle: {
            color: '#000'
          },
          itemGap: 20
        },

        series: [
          {

            type: 'pie',
            center: ['30%', '50%'],
            hoverAnimation: true,
            z: 10,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  margin: 10,
                  fontSize: 12,
                  formatter: function (params) {
                    var percent = 0
                    var total = 0
                    for (var i = 0; i < that.data.length; i++) {
                      total += Number(that.data[i].value)
                    }
                    percent = ((params.value / total) * 100).toFixed(0)
                    if (params.name !== '') {
                      let p = 0
                      if (percent !== 'NaN') {
                        p = percent
                      }
                      return p + '%' + '\r' + params.name
                    } else {
                      return ''
                    }
                  }
                },
                labelLine: {
                  normal: {
                    length: 5
                  }
                }
              }
            },
            label: {
              show: true

            },
            data,
            labelLine: {
              show: false
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
.pieContainer {
  height: 100%;
  width: 100%;
}
</style>
