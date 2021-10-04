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
      let options = {
        backgroundColor: 'transparent',
        series: [
          {
            type: 'liquidFill',
            radius: '80%',
            data: [0.9, 0.7],
            backgroundStyle: {
              color: {
                type: 'linear',
                x: 1,
                y: 0,
                x2: 0.5,
                y2: 1,
                colorStops: [{
                  offset: 1,
                  color: 'rgba(4,33,77, 0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(4,33,77, .5)'
                }, {
                  offset: 0,
                  color: 'rgba(4,33,77, 1)'
                }],
                globalCoord: false
              }
            },
            outline: {
              borderDistance: 5,
              itemStyle: {
                borderWidth: 5,
                borderColor: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(50,115,233, 1)'
                  }, {
                    offset: 0.5,
                    color: 'rgba(50,115,233, .5)'
                  }, {
                    offset: 1,
                    color: 'rgba(50,115,233, 1)'
                  }],
                  globalCoord: false
                },
                shadowBlur: 10,
                shadowColor: '#000'
              }
            },

            label: {
              normal: { // 此处没有生效，本地生效
                textStyle: {
                  fontSize: 20,
                  color: '#e6e6e6'
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
