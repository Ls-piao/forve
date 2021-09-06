<template>
  <div class=" bg-white">
    <div class="fc-unthemed">
      <FullCalendar
        ref="fullCalendar"
        defaultView="dayGridMonth"
        locale="zh-cn" :header="{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }"
        schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
        :firstDay="7"
        @eventClick="handleEventClick"
        :events="geCalendartEvents"
        :buttonText="buttonText"  :plugins="calendarPlugins"/>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <QbxxForm  ref="qbxxForm" @refreshDataList="refreshList"></QbxxForm>
  </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
import QbxxForm from '../pbxx/QbxxForm'
export default {
  data () {
    return {
      calendarData: [],
      start: new Date(),
      end: new Date(),
      editable: true,
      weekends: false,
      calendarPlugins: [dayGridPlugin, interactionPlugin, resourceTimelinePlugin, timeGridPlugin],
      buttonText: {
        today: '今天',
        month: '月',
        week: '周',
        day: '天',
        list: '列表'
      },
      calendarApi: null
    }
  },
  components: {
    FullCalendar,
    dayGridPlugin,
    interactionPlugin,
    QbxxForm
  },
  create () {
    // this.refreshList()
  },
  mounted () {
    this.calendarApi = this.$refs.fullCalendar.getApi()
  },
  methods: { // 选择日期
    handleEventClick (info) {
      // console.log(info.event.id)
      this.$refs.qbxxForm.init('view', info.event.id)
    },
    refreshList () {
      this.calendarData = [
      ]
      this.$http({
        url: `/kqgl/pbxx/qbxx/findListByPerson`,
        method: 'get'
      }).then(({data}) => {
        if (data && data.success) {
          let dataList = data.list
          console.log('dataList', dataList)
          for (let i of dataList) {
            let obj = {
              id: i.id,
              start: i.startDate,
              end: i.endDate,
              title: i.remarks
            }
            this.calendarData.push(obj)
          }
        }
      })
    },
    geCalendartEvents (info, successCallback, failureCallback) {
      // 初始化数据，不知道为何 this.refreshList 在这里会出现加载顺序不对
      if (this.calendarData.length === 0) {
        this.calendarData = [
        ]
        this.$http({
          url: `/kqgl/pbxx/qbxx/findListByPerson`,
          method: 'get'
        }).then(({data}) => {
          if (data && data.success) {
            let dataList = data.list
            for (let i of dataList) {
              let obj = {
                id: i.id,
                start: i.startDate,
                end: i.endDate,
                title: i.remarks
              }
              this.calendarData.push(obj)
            }
            const events = [
              ...this.calendarData
            ]
            successCallback(events)
          }
        })
      } else {
        const events = [
          ...this.calendarData
        ]
        successCallback(events)
      }
    }
  }
}
</script>
<style lang='less' scoped>
//用什么插件必须引入相应的样式表，否则不能正常显示
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import "~@fullcalendar/timegrid/main.css";
@import '~@fullcalendar/resource-timeline/main.css';
//
//
//#external-events {
//  padding: 0 10px;
//  background: #eee;
//  text-align: left;
//}
//
//#external-events h4 {
//  font-size: 16px;
//  margin-top: 0;
//  padding-top: 1em;
//}
//
//#external-events .fc-event {
//  margin: 10px 0;
//  cursor: pointer;
//}
//
//#external-events p {
//  margin: 1.5em 0;
//  font-size: 11px;
//  color: #666;
//}
//
//#external-events p input {
//  margin: 0;
//  vertical-align: middle;
//}

</style>
