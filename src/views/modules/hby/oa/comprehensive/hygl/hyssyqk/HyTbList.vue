<template>
  <div class="fc-unthemed">
    <FullCalendar
      ref="fullCalendar"
      defaultView="timeGridWeek"
      locale="zh-cn" :header="{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }"
      schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
      :firstDay="7"
      @eventClick="handleEventClick"
      :events="calendarData"
      :buttonText="buttonText"  :plugins="calendarPlugins"/>
  </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
export default {
  name: 'timeGridWeek',
  components: {
    FullCalendar
  },
  data () {
    return {
      calendarData: [],
      calendarPlugins: [
        dayGridPlugin,
        interactionPlugin, // needed for dateClick
        timeGridPlugin
      ],
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth, dayGridWeek, dayGridDay'
      },
      evnetTime: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false
      },
      calendarEvents: [ // initial event data
      ],
      buttonText: {
        today: '今天',
        month: '月',
        week: '周',
        day: '天'
      }
    }
  },
  mounted () {

  },
  created () {

  },
  methods: {
    handleDateClick (arg) {
    },
    handleEventClick (info) {
      this.$http({
        url: '/hygl/hygl/queryById',
        method: 'get',
        params: {
          'id': info.event.id
        }
      }).then(({data}) => {
        if (data && data.success) {
          // eslint-disable-next-line no-unused-vars
          var contents = '<table >'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">开始时间：</th>'
          contents += '<td style="width: 80%">'
          contents += data.hygl.kssj + '<br>'
          contents += '</td>'
          contents += '</tr>'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">结束时间：</th>'
          contents += '<td style="width: 80%">'
          contents += data.hygl.jssj + '<br>'
          contents += '</td>'
          contents += '</tr>'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">申请人员：</th>'
          contents += '<td style="width: 80%">'
          contents += data.hygl.cjr + '<br>'
          contents += '</td>'
          contents += '</tr>'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">会议主题：</th>'
          contents += '<td style="width: 80%">'
          contents += data.hygl.hyzt + '<br>'
          contents += '</td>'
          contents += '</tr>'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">会议类型：</th>'
          contents += '<td style="width: 80%">'
          contents += data.hygl.xcBgzxLjfl.name + '<br>'
          contents += '</td>'
          contents += '</tr>'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">参加人员：</th>'
          contents += '<td style="width: 80%;">'
          contents += data.hygl.user.name + '<br>'
          contents += '</td>'
          contents += '</tr>'
          if (data.hygl.chkhz !== null && data.hygl.chkhz !== undefined) {
            contents += '<tr>'
            contents += '<th valign="top" style="width: 20%">参加客户：</th>'
            contents += '<td style="width: 80%">'
            contents += data.hygl.chkhz.name + '<br>'
            contents += '</td>'
            contents += '</tr>'
          }
          contents += '</table>'

          this.$alert(contents, '会议室使用情况', {
            dangerouslyUseHTMLString: true
          })
        }
      })
    },
    refreshList () {
      this.$http({
        url: '/hygl/hygl/selectShtgAfter',
        method: 'get',
        params: {
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.calendarData = []
          data.list.forEach((item, index) => {
            this.calendarData.push(
              {
                title: item.hysgl.hysmc,
                start: item.kssj,
                end: item.jssj,
                color: '#3788d8',
                id: item.id
              }
            )
          })
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
// you must include each plugins' css
// paths prefixed with ~ signify node_modules
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
</style>
