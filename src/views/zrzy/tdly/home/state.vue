<template>
  <div>
    <div style="padding: 5px 15px;background: #e8e8e8;margin-bottom: 20px;">
      <span>选择年份：</span>
      <el-date-picker
        v-model="value3"
        type="year"
        placeholder="选择年"
        size="small">
      </el-date-picker>
    </div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div id="myEchar5" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <el-table
            :data="tableData"
            :span-method="objectSpanMethod"
            border
            style="width: 100%;">
            <el-table-column
              prop="name"
              label="土地资源">
            </el-table-column>
            <el-table-column
              prop="amount1"
              label="类型">
            </el-table-column>
            <el-table-column
              prop="amount2"
              label="面积（万亩）">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as Echart from '../../js/echarts'
  export default {
    data () {
      return {
        value3: new Date(),
        tableData: [{
          id: '12987122',
          name: '农田',
          amount1: '类型1',
          amount2: '3.2',
          amount3: 10
        }, {
          id: '12987123',
          name: '林地',
          amount1: '类型2',
          amount2: '4.43',
          amount3: 12
        }, {
          id: '12987124',
          name: '建设用地',
          amount1: '类型3',
          amount2: '1.9',
          amount3: 9
        }, {
          id: '12987125',
          name: '草地',
          amount1: '类型4',
          amount2: '2.2',
          amount3: 17
        }, {
          id: '12987126',
          name: '其它',
          amount1: '类型5',
          amount2: '4.1',
          amount3: 15
        }]
      }
    },
    methods: {
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        console.log(row, column)
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    mounted () {
      Echart.stateTj()
    }
  }
</script>

<style scoped>

</style>