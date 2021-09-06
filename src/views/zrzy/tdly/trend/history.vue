<template>
  <div>
    <div style="padding: 5px 15px;background: #e8e8e8;margin-bottom: 20px;">
      <span>选择年份：</span>
      <el-date-picker
        v-model="value3"
        type="year"
        placeholder="选择年"
        size="small"
        style="width: 100px;">
      </el-date-picker>
       至 
      <el-date-picker
        v-model="value4"
        type="year"
        placeholder="选择年"
        size="small"
        style="width: 100px;">
      </el-date-picker>
    </div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div id="myEchar6" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="margin-top: 20px;">
        <el-card>
          <div>
            <el-table
              :data="tableData"
              border
              style="width: 100%">
              <el-table-column
                prop="date"
                label="年份">
              </el-table-column>
              <el-table-column
                prop="nongtian"
                label="农田（万亩）">
              </el-table-column>
              <el-table-column
                prop="lindi"
                label="林地（万亩）">
              </el-table-column>
              <el-table-column
                prop="jiansheyongdi"
                label="建设用地（万亩）">
              </el-table-column>
              <el-table-column
                prop="caodi"
                label="草地（万亩）">
              </el-table-column>
              <el-table-column
                prop="qita"
                label="其它（万亩）">
              </el-table-column>
            </el-table>
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
      return {
        value3: new Date('2015'),
        value4: new Date(),
        tableData: [{
          date: '2015',
          nongtian: 120,
          lindi: 220,
          jiansheyongdi: 150,
          caodi: 320,
          qita: 82

        }, {
          date: '2016',
          nongtian: 132,
          lindi: 182,
          jiansheyongdi: 232,
          caodi: 332,
          qita: 93
        }, {
          date: '2017',
          nongtian: 101,
          lindi: 191,
          jiansheyongdi: 201,
          caodi: 301,
          qita: 90
        }, {
          date: '2018',
          nongtian: 134,
          lindi: 234,
          jiansheyongdi: 154,
          caodi: 334,
          qita: 93
        }, {
          date: '2019',
          nongtian: 90,
          lindi: 290,
          jiansheyongdi: 190,
          caodi: 390,
          qita: 129
        }, {
          date: '2020',
          nongtian: 230,
          lindi: 330,
          jiansheyongdi: 330,
          caodi: 330,
          qita: 133
        }, {
          date: '2021',
          nongtian: 210,
          lindi: 310,
          jiansheyongdi: 410,
          caodi: 420,
          qita: 132
        }]
      }
    },
    mounted () {
      Echart.historybh()
    }
  }
</script>

<style scoped>

</style>