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
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
              label="土地资源">
            </el-table-column>
            <el-table-column
              prop="name"
              label="面积（万亩）">
            </el-table-column>
            <!-- <el-table-column
              prop="address"
              label="占比（%）">
            </el-table-column> -->
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div id="myEchar4" style="height: 300px;"></div>
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
      Echart.dataTj()
    }
  }
</script>

<style scoped>

</style>