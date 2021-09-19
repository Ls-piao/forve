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
      let data = []
      for (var i = 0; i < this.data.length; i++) {
        data.push(
          {
            value: this.data[i].value,
            name: this.data[i].title,
            itemStyle: {}
          },
          {
            value: 2,
            name: '',
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0
              }
            }
          }
        )
      }
      let that = this
      let options = {
        backgroundColor: '#fff',
        tooltip: {
          show: true
        },
        color: this.color,
        title: {
          text: this.title,
          top: '46%',
          textAlign: 'center',
          left: '48.5%',
          textStyle: {
            color: '#000',
            fontSize: 14,
            fontWeight: '550'
          }
        },
        legend: {
          icon: 'circle',
          orient: 'horizontal',
          // x: 'left',
          right: 320,
          bottom: 120,
          align: 'right',
          textStyle: {
            color: '#fff'
          },
          itemGap: 20
        },
        series: [
          {
            type: 'pie',
            radius: ['35%', '45%'],
            center: ['50%', '50%'],
            hoverAnimation: true,
            z: 10,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'outside',
                  color: '#000',
                  alignTo: 'edge',
                  margin: 10,
                  fontSize: 12,
                  formatter: function (params) {
                    var percent = 0
                    var total = 0
                    for (var i = 0; i < that.data.length; i++) {
                      total += that.data[i].value
                    }
                    percent = ((params.value / total) * 100).toFixed(0)
                    if (params.name !== '') {
                      return percent + '\r' + params.name
                    } else {
                      return ''
                    }
                  }
                },
                labelLine: {
                  length: 10,
                  length2: 20,
                  show: true,
                  color: '#00ffff'
                }
              }
            },
            label: {
              show: false
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
