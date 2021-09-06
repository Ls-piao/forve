<template>
  <div style="padding: 20px;">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div id="myEchar2" style="height: 300px;"></div>
          </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="myEchar1" style="height: 300px;">

          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;" :gutter="20">
      <el-col :span="12">
        <el-card>
          <div id="myEchar3" style="height: 300px;">

          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="myEchar4" style="height: 300px;">

          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as Echart from '../../js/zxzbjcEcharts'
  export default {
    data () {
      return {}
    },
    mounted () {
      Echart.numberPie()
      Echart.number()
      Echart.visitLine()
      Echart.dataTj()
    }
  }
</script>

<style scoped>

</style>