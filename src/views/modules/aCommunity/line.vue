<template>
  <div class="barBox" :id="id"></div>
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
        title: {
          text: '社区商户数',
          top: '3%',
          textAlign: 'center',
          left: '7%',
          textStyle: {
            color: '#000',
            fontSize: 24,
            fontWeight: '550'
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
          show: false,
          itemGap: 50,
          textStyle: {
            color: '#000',
            borderColor: '#fff'
          }
        },
        xAxis: [
          {
            offset: 5,
            type: 'category',
            boundaryGap: false,
            axisLine: {
              // 坐标轴轴线相关设置。数学上的x轴
              show: false,
              lineStyle: {
                color: '#f9f9f9'
              }
            },
            axisLabel: {
              // 坐标轴刻度标签的相关设置
              textStyle: {
                color: '#000'
              },

              interval: 0
            },
            axisTick: {
              show: false
            },
            data: ['1', '2', '3', '4', '5', '6', '7', '8', 9, 10, 11, 12].map(
              (v) => v + '月'
            )
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            splitNumber: 7,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#rgba(0,0,0,.09)'
              }
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              margin: 20,
              textStyle: {
                color: '#000'
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '数量',
            type: 'line',
            smooth: false, // 是否平滑曲线显示
            // symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 6,
            lineStyle: {
              normal: {
                color: '#28ffb3' // 线条颜色
              },
              borderColor: '#f0f'
            },
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: '#fff'
              }
            },
            itemStyle: {
              normal: {
                color: '#28ffb3'
              }
            },
            tooltip: {
              show: true
            },
            areaStyle: {
              // 区域填充样式
              normal: {
                // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(71,214,166, 0.9)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(71,214,166, 0.01)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(61,234,255, 0)', // 阴影颜色
                shadowBlur: 30 // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              }
            },
            data: [10, 20, 10, 5, 17, 16, 25, 26, 11, 8, 7, 12]
          }
          //, {
          //     name: '最新注册量',
          //     type: 'bar',
          //     barWidth: 20,
          //     tooltip: {
          //         show: false
          //     },
          //      label: {
          //         show: true,
          //         position: 'top',
          //         textStyle: {
          //             color: '#fff',
          //         }
          //     },
          //     itemStyle: {
          //         normal: {
          //             // barBorderRadius: 5,
          //             // color: new echarts.graphic.LinearGradient(
          //             //     0, 0, 0, 1,
          //             //     [{
          //             //             offset: 0,
          //             //             color: '#14c8d4'
          //             //         },
          //             //         {
          //             //             offset: 1,
          //             //             color: '#43eec6'
          //             //         }
          //             //     ]
          //             // )
          //             color: function(params) {
          //                 var colorList = ['#0ec1ff', '#10cdff', '#12daff', '#15ebff', '#17f8ff', '#1cfffb', '#1dfff1'];
          //                 return colorList[params.dataIndex];
          //             }
          //         }
          //     },
          //     data: [200, 382, 102, 267, 186, 315, 316]
          // }
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
.barBox {
  height: 100%;
  width: 100%;
}
</style>
