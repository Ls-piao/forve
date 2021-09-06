<template>
  <div class="page">
    <div class="bg-white">
      <div :style="{height:height,width:width}" :id="id" ref="myEchart"></div>
      <el-form style="text-align: center">
        <el-table
          :data="dataList"
          v-loading="loading"
          show-summary
          border
          class="table">
          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="部门">
          </el-table-column>
          <el-table-column
            prop="num"
            show-overflow-tooltip
            label="数量">
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'statisticsByDept',
  props: {
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
      default: '300px'
    }
  },
  data () {
    return {
      dataList: [],
      loading: false
    }
  },
  components: {
    echarts
  },
  activated () {
    this.init()
  },
  methods: {
    init () {
      let series = []
      this.dataList = []
      this.$nextTick(() => {
        this.$http({
          url: `/zcfl/bgxtGdzcInfo/statisticsByDept`,
          method: 'get'
        }).then(({data}) => {
          console.log(data)
          if (data && data.success) {
            let mapVal = data.map
            // Table 表格数据
            for (let mapKey in mapVal) {
              this.dataList.push(mapVal[mapKey])
              series.push({ name: mapVal[mapKey].name, value: mapVal[mapKey].num })
            }
            console.log(this.dataList)
            console.log(series)
            this.paintEchart(series)
          }
        })
      })
    },
    paintEchart (seriesData) {
      let chart = echarts.init(this.$refs.myEchart)
      let option
      option = {
        title: {
          text: '各部门资产数量',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: '5%',
          left: 'center'
        },
        series: [
          {
            name: '资产数量',
            type: 'pie',
            radius: '60%',
            data: seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      chart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
