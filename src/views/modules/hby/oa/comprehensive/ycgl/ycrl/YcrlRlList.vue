<template>
  <FullCalendar defaultView="dayGridMonth" locale="zh-cn" firstDay="1"
                weekNumberCalculation="ISO"
                :eventTimeFormat="evnetTime"
                :header="header"
                :buttonText="buttonText"
                @dateClick="handleDateClick"
                :plugins="calendarPlugins"
                :events="calendarData"
                @eventClick="handleEventClick"
  />
</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
export default {
  name: 'dayGridMonth',
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
      this.loading = true
      this.$http({
        url: '/ycgl/clsq/findByCphAndDate',
        method: 'get',
        params: {
          'id': info.event.id
        }
      }).then(({data}) => {
        if (data && data.success) {
          // eslint-disable-next-line no-unused-vars
          var contents = '<table >'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">使用时间：</th>'
          contents += '<td style="width: 80%">'
          contents += data.clsq.kssj + ' 至 ' + data.clsq.jssj + '<br>'
          contents += '</td>'
          contents += '</tr>'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">使用车辆：</th>'
          contents += '<td style="width: 80%">'
          contents += data.clsq.clxx.cph + '<br>'
          contents += '</td>'
          contents += '</tr>'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">用车人员：</th>'
          contents += '<td style="width: 80%">'
          contents += data.clsq.user.name + '<br>'
          contents += '</td>'
          contents += '</tr>'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">用车事由：</th>'
          contents += '<td style="width: 80%">'
          contents += data.clsq.ycsy + '<br>'
          contents += '</td>'
          contents += '</tr>'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">出发地：</th>'
          contents += '<td style="width: 80%;">'
          contents += data.clsq.cfd + '<br>'
          contents += '</td>'
          contents += '</tr>'
          contents += '<tr>'
          contents += '<th valign="top" style="width: 20%">目的地：</th>'
          contents += '<td style="width: 80%">'
          contents += data.clsq.mdd + '<br>'
          contents += '</td>'
          contents += '</tr>'
          contents += '</table>'

          this.$alert(contents, '车辆使用情况', {
            dangerouslyUseHTMLString: true
          })
          // this.$alert(data.clsq.kssj + '\u3000-\u3000' + data.clsq.jssj, '用车时间', {
          //   confirmButtonText: '关闭',
          //   callback: action => {
          //   }
          // })
          this.loading = false
        }
      })
    },
    refreshList () {
      this.loading = true
      this.$http({
        url: '/ycgl/clsq/ycrlList',
        method: 'get',
        params: {
          'sqzt': '3'
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.calendarData = []
          data.page.list.forEach((item, index) => {
            this.calendarData.push(
              {title: item.clxx.cph, start: item.kssj.substring(0, 10), id: item.id}
            )
          })
          this.loading = false
        }
      })
    }
  }
}
</script>
<style>
</style>
