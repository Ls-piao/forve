<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
             @keyup.enter.native="init()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="year" label="年份">
        <el-date-picker
          v-model="searchForm.warehousingDate"
          value-format="yyyy"
          placeholder="请选择年份"
          type="year">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="init()" size="small">查询</el-button>
        <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="bg-white top">
      <div :style="{height:height,width:width}" :id="id" ref="myEchart"></div>
      <el-form style="text-align: center">
        <el-table
          :data="dataList"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          v-loading="loading"
          class="table">
          <el-table-column
            prop="month1"
            show-overflow-tooltip
            label="1月">
          </el-table-column>
          <el-table-column
            prop="month2"
            show-overflow-tooltip
            label="2月">
          </el-table-column>
          <el-table-column
            prop="month3"
            show-overflow-tooltip
            label="3月">
          </el-table-column>
          <el-table-column
            prop="month4"
            show-overflow-tooltip
            label="4月">
          </el-table-column>
          <el-table-column
            prop="month5"
            show-overflow-tooltip
            label="5月">
          </el-table-column>
          <el-table-column
            prop="month6"
            show-overflow-tooltip
            label="6月">
          </el-table-column>
          <el-table-column
            prop="month7"
            show-overflow-tooltip
            label="7月">
          </el-table-column>
          <el-table-column
            prop="month8"
            show-overflow-tooltip
            label="8月">
          </el-table-column>
          <el-table-column
            prop="month9"
            show-overflow-tooltip
            label="9月">
          </el-table-column>
          <el-table-column
            prop="month10"
            show-overflow-tooltip
            label="10月">
          </el-table-column>
          <el-table-column
            prop="month11"
            show-overflow-tooltip
            label="11月">
          </el-table-column>
          <el-table-column
            prop="month12"
            show-overflow-tooltip
            label="12月">
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
      default: '50%'
    }
  },
  data () {
    return {
      dataList: [],
      loading: false,
      searchForm: {
        warehousingDate: ''
      }
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
      // let series = []
      this.dataList = []
      this.$nextTick(() => {
        this.$http({
          url: `/zcfl/bgxtGdzcInfo/statisticsByMonth`,
          method: 'get',
          params: {
            ...this.searchForm
          }
        }).then(({data}) => {
          console.log(data)
          let arr = data.map
          let seriesData = []
          for (let arrKey in arr) {
            this.dataList.push(arr[arrKey])
            seriesData = [
              arr[arrKey].month1,
              arr[arrKey].month2,
              arr[arrKey].month3,
              arr[arrKey].month4,
              arr[arrKey].month5,
              arr[arrKey].month6,
              arr[arrKey].month7,
              arr[arrKey].month8,
              arr[arrKey].month9,
              arr[arrKey].month10,
              arr[arrKey].month11,
              arr[arrKey].month12
            ]
          }
          this.paintEchart(seriesData)
        })
      })
    },
    paintEchart (seriesData) {
      let month = ''
      let count = 0
      seriesData.forEach(item => {
        count += parseInt(item)
      })
      console.log(count)
      if (this.searchForm.warehousingDate === '') {
        month = new Date().getFullYear()
      } else {
        month = this.searchForm.warehousingDate
      }
      let chart = echarts.init(this.$refs.myEchart)
      let option
      option = {
        title: {
          text: month + '年入库数量统计',
          subtext: '资产总数' + count,
          subtextStyle: {
            fontStyle: 'normal',
            fontSize: 16,
            align: 'center'
          }
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: seriesData,
          type: 'bar',
          itemStyle: {
            color: 'rgba(112, 221, 255, 1)'
          }
        }]
      }
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
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
