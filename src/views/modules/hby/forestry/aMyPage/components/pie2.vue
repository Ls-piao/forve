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
      default: () => [
        '#73DDFF',
        '#73ACFF',
        '#FDD56A',
        '#FDB36A',
        '#FD866A',
        '#9E87FF',
        '#58D5FF'
      ]
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
      let legendData = []
      for (var i = 0; i < this.data.length; i++) {
        legendData.push({
          icon: 'circle',
          textStyle: {
            fontSize: 18,
            color: this.color[i]
          }
        })
        data.push({
          value: this.data[i].value,
          name: this.data[i].title,
          label: {
            color: this.color[i]
          }
        })
      }
      let options = {
        backgroundColor: '#fff',
        legend: {
          // orient: 'vertical',
          top: 'bottom',
          left: 'center',
          itemGap: 30,
          data: legendData,
          formatter: function (name) {
            return `{title|${name}}`
          },
          textStyle: {
            rich: {
              value: {
                color: '#82baff',
                fontSize: 24,
                fontWeight: 600,
                fontFamily: 'HuaKang',
                padding: [0, 10, 0, 30]
              },
              unit: {
                color: '#82baff',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'HuaKang',
                padding: [0, 50, 0, 0]
              },
              percent: {
                color: '#82baff',
                fontSize: 24,
                fontWeight: 600,
                fontFamily: 'HuaKang',
                padding: [0, 10, 0, 0]
              }
            }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: this.color,
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            label: {
              fontSize: 18
            },
            data: data,
            roseType: 'radius',
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200
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
