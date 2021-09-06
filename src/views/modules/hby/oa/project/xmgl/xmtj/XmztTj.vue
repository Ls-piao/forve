<template>
    <div style="background-color:white">
        <!-- <el-row  :gutter="15" style="padding-top: 20px;margin-left: 50px;font-size: 24px;text-align:center">
            项目状态统计
        </el-row>  -->
        <el-row  :gutter="15" style="padding-top: 20px">
            <el-col :span="12">
                <ve-pie :data="chartData"></ve-pie>
            </el-col>
            <el-col :span="12">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%;margin-top: 10px">
                    <el-table-column
                    prop="name"
                    label="项目状态">
                    </el-table-column>
                    <el-table-column
                    prop="num"
                    label="项目数">
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>            
    </div>
</template>
<script>
    export default {
      data () {
        return {
          chartData: {},
          tableData: []
        }
      },
      activated () {
        this.$http.get('/xmgl/xmxx/xmjbxx/xmztTjChartData').then(({data}) => {
          console.log(data.res)
          this.chartData = data.res
        })
        this.$http.get('/xmgl/xmxx/xmjbxx/xmztTjTableData').then(({data}) => {
          console.log(data.res)
          this.tableData = data.res
        })
      }
    }
</script>