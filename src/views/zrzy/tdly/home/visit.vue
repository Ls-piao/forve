<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <div id="myEchar3" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="margin-top: 20px">
        <el-card>
          <div style="height: 120px;">
            <el-row style="text-align: center;margin-top: 20px;">
              <el-col :span="8">
                <span>今日访问量</span>
                <div style="font-size: 30px;margin-top: 10px;">9</div>
              </el-col>
              <el-col :span="8">
                <span>当月访问量</span>
                <div style="font-size: 30px;margin-top: 10px;">320</div>
              </el-col>
              <el-col :span="8">
                <span>总访问量</span>
                <div style="font-size: 30px;margin-top: 10px;">12471</div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as Echart from '../../js/echarts'
  export default {
    data () {
      return {}
    },
    mounted () {
      Echart.visitLine()
    }
  }
</script>

<style scoped>

</style>