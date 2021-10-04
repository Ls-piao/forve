<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <div :class="$style.date">检测时间: {{ date }}</div>
      <DvDecoration10 :class="$style.border" />
      <div :class="$style.title">
        <DvBorderBox12>资源资产概况</DvBorderBox12>
      </div>
      <DvDecoration10 :class="$style.border" />
    </div>
    <div :class="$style.content">
      <div :class="$style.left">
        <div :class="$style.top">
          <DvBorderBox11 title="林权统计">
            <DvCharts :option="option1" />
          </DvBorderBox11>
        </div>
        <div :class="$style.center">
          <DvBorderBox11 title="确权数目">
            <DvCharts :option="option2" />
          </DvBorderBox11>
        </div>
        <div :class="$style.bottom">
          <DvBorderBox11 title="确权面积">
            <DvCharts :option="option3" />
          </DvBorderBox11>
        </div>
      </div>
      <div :class="$style.center">
        <div :class="$style.top">
          <div :class="$style.item">
            <DvBorderBox8
              style=" 
              padding: 10px;
              text-align: center;
              font-size: 20px;
              line-height:1.8
           "
            >
              <div>管理面积</div>
              <div>24000㎡</div>
            </DvBorderBox8>
          </div>
          <div :class="$style.item">
            <DvBorderBox8
              style=" 
              padding: 10px;
              text-align: center;
              font-size: 20px;
              line-height:1.8
           "
            >
              <div>管理斑块数目</div>
              <div>351</div>
            </DvBorderBox8>
          </div>
          <div :class="$style.item">
            <DvBorderBox8
              style=" 
              padding: 10px;
              text-align: center;
              font-size: 20px;
              line-height:1.8
           "
            >
              <div>林地占比</div>
              <div>56%</div>
            </DvBorderBox8>
          </div>
        </div>
        <div :class="$style.center">
          <DvBorderBox13 />
        </div>
      </div>
      <div :class="$style.right">
        <div :class="$style.top">
          <DvBorderBox11 title="面积直方图">
            <DvCharts :option="option4" />
          </DvBorderBox11>
        </div>
        <div :class="$style.center">
          
          <DvBorderBox11 title="植被覆盖度">
            <DvCharts :option="option5" />
          </DvBorderBox11>
        </div>
        <div :class="$style.bottom">
          
           <DvBorderBox11 title="面积变化">
            <DvCharts :option="option6" />
          </DvBorderBox11>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import {
  loading,
  scrollBoard,
  borderBox12,
  borderBox8,
  decoration10,
  borderBox11,
  borderBox13,
  charts
} from '@jiaminghi/data-view'
Vue.use(scrollBoard)
  .use(loading)
  .use(borderBox12)
  .use(borderBox8)
  .use(decoration10)
  .use(borderBox11)
  .use(borderBox13)
  .use(charts)
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      date: '',
      option1: {
        series: [
          {
            type: 'pie',
            data: [
              { name: '申请表数', value: 93 },
              { name: '打印证书数', value: 32 },
              { name: '注销证书数', value: 65 }
            ],
            radius: ['40%', '50%'],
            insideLabel: {
              show: true,
              style: {
                fontSize: 16,
                fill: '#fff',
                textAlign: 'center',
                textBaseline: 'middle'
              }
            }
          }
        ]
      },
      option2: {
        grid: {
          left: 20,
          right: 20,
          top: '25%',
          bottom: '15%'
        },
        xAxis: {
          data: [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12'
          ],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            style: {
              fill: '#fff'
            }
          }
        },
        yAxis: {
          data: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            type: 'bar',
            data: [120, 230, 190, 210, 350, 420, 398, 361, 342, 445, 224, 377],
            label: {
              show: true,
              position: 'center',
              offset: [0, 0],
              style: {
                fill: '#fff'
              }
            },
            backgroundBar: {
              show: true
            },
            animationCurve: 'easeOutBounce'
          }
        ]
      },
      option3: {
        grid: {
          left: '10%',
          right: 20,
          top: '25%',
          bottom: '15%'
        },
        xAxis: {
          data: [
            '2010',
            '2011',
            '2012',
            '2013',
            '2014',
            '2015',
            '2016',
            '2017',
            '2018',
            '2019',
            '2020'
          ],
          axisLabel: {
            show: true,
            style: {
              fill: '#fff'
            }
          }
        },
        yAxis: {
          data: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            style: {
              fill: '#fff'
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            data: [120, 223, 190, 200, 300, 420, 385, 222, 251, 534, 231],
            type: 'line',
            lineArea: {
              show: true,
              gradient: ['rgba(55, 162, 218, 0.6)', 'rgba(55, 162, 218, 0)']
            },
            label: {
              show: true,
              position: 'top',
              offset: [0, -20],
              style: {
                fill: '#fff'
              }
            }
          }
        ]
      },

      option4: {
        grid: {
          left: '15%',
          right: '15%',
          top: '25%',
          bottom: '15%'
        },
        xAxis: {
          data: 'value',
          axisLabel: {
            show: true,
            style: {
              fill: '#fff'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },

          splitLine: {
            show: false
          }
        },
        yAxis: {
          data: ['乔木林地', '灌木林地', '沼泽林地', '其他林地'],
          axisLabel: {
            show: true,
            style: {
              fill: '#fff'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },

          splitLine: {
            show: false
          }
        },
        series: [
          {
            data: [1200, 2230, 1900, 2100],
            type: 'bar',
            animationCurve: 'easeOutBack',
            label: {
              show: true,
              position: 'right',
              offset: [20, 0],
              style: {
                fill: '#fff',
                size: 14
              }
            }
          }
        ]
      },
      option5: {
        grid: {
          left: 20,
          right: 20,
          top: '25%',
          bottom: '15%'
        },
        xAxis: {
          data: [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12'
          ],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            style: {
              fill: '#fff'
            }
          }
        },
        yAxis: {
          data: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            smooth: true,
            data: [60, 70, 44, 67, 57, 47, 52, 52, 34, 44, 55, 41],
            type: 'line',
            lineArea: {
              show: true,
              gradient: ['rgba(55, 162, 218, 0.6)', 'rgba(55, 162, 218, 0)']
            },
            label: {
              show: true,
              position: 'top',
              offset: [0, -20],
              style: {
                fill: '#fff'
              }
            }
          }
        ]
      },
      option6: {
        legend: {
          show: true,
          data: [
            {
              name: '乔木',
              color: '#67e0e3'
            },
            {
              name: '灌木',
              color: '#fda085'
            },
            {
              name: '沼泽',
              color: '#8dc63f'
            }
          ],
          orient: 'vertical',
          top: '25%',
          right: '90%',
          textStyle: {
            fill: '#fff'
          }

        },
        grid: {
          left: '10%',
          right: 20,
          top: '25%',
          bottom: '15%'
        },
        xAxis: {
          data: [
            '2010',
            '2011',
            '2012',
            '2013',
            '2014',
            '2015',
            '2016',
            '2017',
            '2018',
            '2019',
            '2020'
          ],
          axisLabel: {
            show: true,
            style: {
              fill: '#fff'
            }
          }
        },
        yAxis: {
          data: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            style: {
              fill: '#fff'
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '乔木',
            data: [1200, 2230, 1900, 2100, 3500, 4200, 3985, 4567, 4234, 3546, 3212],
            type: 'bar',
            gradient: {
              color: ['#37a2da', '#67e0e3']
            }
          },
          {
            name: '灌木',
            data: [800, 1230, 900, 1200, 1500, 1200, 1985, 1567, 1234, 1546, 1132],
            type: 'bar',
            gradient: {
              color: ['#f6d365', '#fda085']
            }
          },
          {
            name: '沼泽',
            data: [2200, 4230, 3900, 4100, 3500, 2200, 5985, 3567, 1234, 3546, 2222],
            type: 'bar',
            gradient: {
              color: ['#39b54a', '#8dc63f']
            }
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.date = moment().format('YYYY-MM-DD')
  },
  methods: {}
}
</script>

<style module lang="scss">
.container {
  height: 100%;
  width: 100%;
  display: flex;
  background: #141a30;
  flex-direction: column;
  padding: 8px;
  color: #fff;
  .header {
    height: 60px;
    line-height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .date {
      position: absolute;
      left: 0;
      top: 0;
      line-height: 30px;
    }
    .title {
    font-size: 16px;
      height: 100%;
      text-align: center;
      margin: 0 auto;
      flex: 1;
    }
    .border {
      flex: 1;
    }
  }
  .content {
    flex: 1;
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    > div {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .right,
    .left {
      > div {
        flex: 1;
      }
    }
    .center {
      display: flex;
      flex-direction: column;
      .top {
        display: flex;
        justify-content: space-between;
        padding: 0 24px;
        .item {
        }
      }
      .center {
        flex: 1;
        margin-top: 16px;
      }
    }
  }
}
</style>
