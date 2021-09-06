<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div id="myEchar1" style="height: 300px;">

          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div id="myEchar2" style="height: 300px;"></div>
          </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-col :span="24">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="面积（万亩）"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="占比（%）">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as Echart from '../../js/echarts'
  export default {
    data () {
      return {
        tableData: [{
          date: '农田',
          name: '40',
          address: '23.81'
        }, {
          date: '林地',
          name: '38',
          address: '22.62'
        }, {
          date: '建设用地',
          name: '32',
          address: '19.05'
        }, {
          date: '草地',
          name: '30',
          address: '17.86'
        }, {
          date: '其它',
          name: '28',
          address: '16.66'
        }]
      }
    },
    mounted () {
      Echart.areaPie()
      Echart.areaBar()
    }
  }
</script>

<style scoped>

</style>