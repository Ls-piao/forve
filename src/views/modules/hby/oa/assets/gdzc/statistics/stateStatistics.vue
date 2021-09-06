<template>
<div class="page">
  <div class="bg-white">
    <div :style="{height:height,width:width}" :id="id" ref="myEchart"></div>
    <el-form style="text-align: center" v-if="type !== 1">
      <el-table
        :data="dataList"
        v-loading="loading"
        show-summary
        border
        class="table">
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="状态">
        </el-table-column>
        <el-table-column
          prop="value"
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
  name: 'stateStatistics',
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
      default: '280px'
    },
    // 控制列表是否显示，‘1’为显示
    type: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      seriesData: [],
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
      this.$nextTick(() => {
        this.$http({
          url: `/zcfl/bgxtGdzcInfo/stateStatistics`,
          method: 'get'
        }).then(({data}) => {
          if (data && data.success) {
            let array = data.map.state
            delete array['id']
            let state1 = { name: '闲置', value: array.state1 }
            let state2 = { name: '占用', value: array.state2 }
            let state3 = { name: '维修中', value: array.state3 }
            let state4 = { name: '报废', value: array.state4 }
            let state5 = { name: '待提交', value: array.state5 }
            let state6 = { name: '审批中', value: array.state6 }
            series.push(state1)
            series.push(state2)
            series.push(state3)
            series.push(state4)
            series.push(state5)
            series.push(state6)
            this.dataList = this.seriesData = series
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
          text: '各状态资产数量',
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
