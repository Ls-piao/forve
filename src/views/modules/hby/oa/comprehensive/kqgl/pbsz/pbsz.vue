<template>
  <div class=" bg-white">
    <el-calendar v-model="timeValue" id="calendar" :first-day-of-week="firstDayOfWeek" class="font_size font_size1">
      <template slot="dateCell" slot-scope="{date, data}">
        <!--自定义内容-->
        <div @click="changeTime(date,data)" class="div-Calendar">
          <div style="width: 100%; height: 100%"> <div style="display: contents;z-index: 9"><img src="@/assets/img/kqgl/班.png" width="10%" alt="班"></div><label class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</label></div>
          <div v-for="item in calendarData">
            <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!==-1 && (item.days).indexOf(data.day.split('-').slice(2).join('-'))!==-1">
<!--              {{item.title}} ~ {{item.pbFlag}}-->
                <div class="img-show-999" v-if="item.title !== '' && item.title === '0'"><img src="@/assets/img/kqgl/休.png" width="10%" alt="休"></div>
                <div class="img-show-999" v-if="item.title !== '' && item.title === '1'" ><img src="@/assets/img/kqgl/假.png" width="10%" alt="假"></div>
                <div class="img-show-99"  v-if="item.pbFlag !== '' && item.title === ''"><img src="@/assets/img/kqgl/default.png" width="10%" alt=" "></div>
                <div class="pbFlag" v-if="item.pbFlag !== ''">{{item.pbFlag}}</div>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
<!--    <QbxxListDraw ref="qbxxList" @refreshDataList="refreshList"></QbxxListDraw>-->
    <el-drawer
      :title="`排班列表，日期:${this.formatTime}`"
      size="45%"
      :visible.sync="rightVisible"
      direction="rtl">
      <QbxxList ref="qbxxList" @refreshDataList="refreshList"></QbxxList>
    </el-drawer>
  </div>
</template>
<script>

import QbxxListDraw from '../pbxx/QbxxListDraw'
import QbxxList from '../pbxx/QbxxList'
export default {
  data () {
    return {
      firstDayOfWeek: 7,
      calendarData: [],
      timeValue: new Date(),
      rightVisible: false,
      formatTime: ''
    }
  },
  components: {
    QbxxListDraw,
    QbxxList
  },
  watch: {
    timeValue (val, oldVal) {
      let date = new Date(val)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      const time = y + '-' + m + '-' + d
      this.formatTime = time
    }
  },
  methods: {
    refreshList () {
      // 加载节假日数据
      this.calendarData = []
      // 加载排班信息数据
      this.$http({
        url: `/kqgl/pbxx/qbxx/findListGroupByStartDate`,
        method: 'get'
      }).then(({data}) => {
        let dataList2 = data.list
        for (let i = 0; i < dataList2.length; i++) {
          let strArray = dataList2[i].date.substr(0, 10).split('-')
          let obj = {
            'years': strArray[0],
            'months': strArray[1],
            'days': strArray[2],
            'title': dataList2[i].title,
            'pbFlag': dataList2[i].pbflag
          }
          this.calendarData.push(obj)
        }
      })
    },
    changeTime (date, data) {
      this.rightVisible = true
      this.$nextTick(() => {
        this.$refs.qbxxList.refreshList(data.day)
      })
    }
  }
}
</script>
<style scoped>
.font_size /deep/ .el-button--mini, .el-button--small {
  font-size: 16px;
}
.font_size1 /deep/ .el-calendar__title {
  font-size: 20px;
}

.div-Calendar {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: inline;
}

.calendar-day {
  text-align: right;
  color: #202535;
  line-height: 30px;
  font-size: 16px;
  margin-left: 80%;
}

.img-show-999 {
  margin-top: -31%;
  z-index: 999;
}

.img-show-99 {
  margin-top: -31%;
  z-index: 99;
}

.pbFlag {
  color: #F8A535;
  font-size: 16px;
  margin-top: 12%;
}
.el-calendar-table:not(.is-range) td.next div div div label, .el-calendar-table:not(.is-range) td.prev div div div label{
  color: #cccccc;
}

@media only screen and (max-width: 1800px) and (min-width: 1700px) {
  .img-show-999 {
    margin-top: -39%;
    z-index: 999;
  }
}
@media only screen and (max-width: 1600px) and (min-width: 1500px) {
  .img-show-999 {
    margin-top: -47%;
    z-index: 999;
  }
}
/*1920 -1280 (150%)*/
@media (max-width: 1300px) and (min-width: 1200px) {
  .img-show-999 {
    margin-top: -63%;
    z-index: 999;
  }
}
</style>
