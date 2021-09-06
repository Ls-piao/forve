<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
             @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="by2" label="月份">
        <el-date-picker
          v-model="searchForm.by2"
          value-format="yyyy-MM"
          placeholder="请选择月份"
          type="month">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
        <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="bg-white top">
      <div :class="className" :id="id" :style="{height:height,width:width}" ref="myEchart"></div>
      <el-form style="text-align: center">
        <el-table
          :data="dataList"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          v-loading="loading"
          class="table">
          <el-table-column
            prop="normal"
            show-overflow-tooltip
            label="正常">
          </el-table-column>
          <el-table-column
            prop="zt"
            show-overflow-tooltip
            label="早退">
          </el-table-column>
          <el-table-column
            prop="cd"
            show-overflow-tooltip
            label="迟到">
          </el-table-column>
          <el-table-column
            prop="yc"
            show-overflow-tooltip
            label="异常">
          </el-table-column>
          <el-table-column
            prop="qk"
            show-overflow-tooltip
            label="缺卡">
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'cqtj',
  props: {
    className: {
      type: String,
      default: 'yourClassName'
    },
    id: {
      type: String,
      default: 'yourID'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '50%'
    }
  },
  data () {
    return {
      searchForm: {
        by2: ''
      },
      loading: false,
      dataList: [],
      topData: {
        normal: '',
        zt: '',
        cd: '',
        yc: '',
        qk: ''
      },
      array0: [],
      array1: [],
      array2: [],
      array3: [],
      array5: []
    }
  },
  components: {
    echarts
  },
  activated () {
    this.refreshList()
    // this.initChart()
  },
  methods: {
    refreshList () {
      // 获取数据
      this.loading = true
      let normal = 0
      let zt = 0
      let cd = 0
      let yc = 0
      let qk = 0
      this.array0 = ['正常']
      this.array1 = ['早退']
      this.array2 = ['迟到']
      this.array3 = ['异常']
      this.array5 = ['缺卡']
      this.$http({
        url: `/kqgl/kqjl/xcKqglKqjl/getNumByDay`,
        method: 'get',
        params: {
          ...this.searchForm
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.dataList = []
          let dataList = data.list
          // console.log(dataList)
          dataList.forEach((item) => {
            this.array0.push(item[0])
            normal += item[0]
            this.array1.push(item[1])
            zt += item[1]
            this.array2.push(item[2])
            cd += item[3]
            this.array3.push(item[3])
            qk += item[4]
            this.array5.push(item[4])
          })
          this.initChart() // 加载echarts图
          // 计算总和
          this.topData.normal = normal
          this.topData.zt = zt
          this.topData.cd = cd
          this.topData.yc = yc
          this.topData.qk = qk
          // console.log(this.topData)
          this.dataList.push(this.topData)
          this.loading = false
        }
      })
    },
    initChart () {
      // console.log(this.array2)
      // 加载echarts图
      let month = ''
      if (this.searchForm.by2 === '') {
        month = new Date().getMonth() + 1
      } else {
        month = this.searchForm.by2.substring(5)
      }
      let chart = echarts.init(this.$refs.myEchart)
      let days = this.mGetMonth()
      let xData = (function () {
        let data = ['product']
        for (let i = 1; i <= days; i++) {
          data.push(i + '日')
        }
        return data
      }())
      let option = {
        title: {
          text: month + '月份考勤统计',
          left: 'auto',
          textStyle: {
            fontSize: 20
          }
        },
        legend: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }

          }
        },
        dataset: {
          source: [
            xData,
            this.array0,
            this.array1,
            this.array2,
            this.array3,
            this.array5
          ]
        },
        xAxis: {type: 'category', nameTextStyle: {fontSize: 30}},
        yAxis: {gridIndex: 0},
        dataZoom: [{
          show: true,
          height: 20,
          xAxisIndex: [0],
          bottom: 30,

          'start': 0,
          'end': 50,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#5B3AAE'
          },
          textStyle: {
            color: 'rgba(204,187,225,0.5)'
          },
          fillerColor: 'rgba(67,55,160,0.4)',
          borderColor: 'rgba(204,187,225,0.5)'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1, // 开始位置的百分比，0 - 100
          end: 20   // 结束位置的百分比，0 - 100
        }],
        grid: {top: '55%'},
        series: [
          {type: 'line', smooth: true, symbolSize: 4, symbol: 'circle', seriesLayoutBy: 'row'},
          {type: 'line', smooth: true, symbolSize: 4, symbol: 'circle', seriesLayoutBy: 'row'},
          {type: 'line', smooth: true, symbolSize: 4, symbol: 'circle', seriesLayoutBy: 'row'},
          {type: 'line', smooth: true, symbolSize: 4, symbol: 'circle', seriesLayoutBy: 'row'},
          {type: 'line', smooth: true, symbolSize: 4, symbol: 'circle', seriesLayoutBy: 'row'},
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      }
      chart.on('updateAxisPointer', function (event) {
        let xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          let dimension = xAxisInfo.value + 1
          chart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          })
        }
      })

      // 把配置和数据放这里
      chart.setOption(option)
    },
    // 获取当前月份天数
    mGetMonth () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let d = new Date(year, month, 0)
      return d.getDate()
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    }
  }
}
</script>

<style scoped>

</style>
