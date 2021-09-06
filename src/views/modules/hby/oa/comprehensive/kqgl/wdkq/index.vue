<template>
  <div class=" bg-white">
    <div class="fc-unthemed">
      <FullCalendar ref="fullCalendar" defaultView="dayGridMonth" class="fc-diy fc fc-ltr fc-unthemed"  locale="zh-cn" :header="{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }"
                    schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
                    :firstDay="7"
                    @dateClick="handleDateClick"
                    :events="calendarData"
                    :buttonText="buttonText"  :plugins="calendarPlugins"
                    :editable="editable"/>
    </div>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" style="list-style: none" class="contextmenu">
      <li class="liStyle" @click="submitDate('normal')">普通节假日</li>
      <li class="liStyle" @click="submitDate('special')">法定节假日</li>
      <li class="liStyle" @click="submitDate('esc')">取消</li>
    </ul>
  </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import interactionPlugin from '@fullcalendar/interaction'
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
        day: '天'
      },
      visible: false,
      top: 0,
      left: 0,
      jjr: {
        jjr: '',
        state: ''
      },
      selectedDate: ''
    }
  },
  components: {
    FullCalendar,
    dayGridPlugin,
    interactionPlugin
  },
  // activated () {
  //   this.refreshList()
  // },
  watch: {
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  methods: { // 选择日期
    handleDateClick (arg) {
      // console.log(arg)
    },
    refreshList () {
      this.calendarData = []
      this.$http({
        url: '/kqgl/jjr/xcKqglJjr/list',
        method: 'get'
      }).then(({data}) => {
        if (data && data.success) {
          let dataList = data.page.list
          for (let i = 0; i < dataList.length; i++) {
            let obj = {}
            obj['date'] = dataList[i].jjr
            if (dataList[i].state === '0') {
              obj['title'] = '休'
            } else if (dataList[i].state === '1') {
              obj['title'] = '假'
            }
            this.calendarData.push(obj)
          }
        }
      })
    },
    closeMenu () {
      this.visible = false
    },
    submitDate (arg) {
      // console.log('fullCalendar', this.$refs.fullCalendar.getApi())
      if (arg === 'normal') {
        this.jjr.state = '0'
      } else if (arg === 'special') {
        this.jjr.state = '1'
      } else if (arg === 'esc') {
        this.jjr.state = 'esc'
      }
      this.jjr.jjr = this.selectedDate
      this.loading = true
      // this.$http({
      //   url: '/kqgl/jjr/xcKqglJjr/indexList',
      //   method: 'post',
      //   data: this.jjr
      // }).then(({data}) => {
      //   if (data && data.success) {
      //     this.$message.success(data.msg)
      //     this.refreshList()
      //     this.loading = false
      //   } else {
      //     this.$message.error(data.msg)
      //   }
      // })
    }
  }
}
</script>
<style lang='less'>
//用什么插件必须引入相应的样式表，否则不能正常显示
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/resource-timeline/main.css';


#external-events {
  padding: 0 10px;
  background: #eee;
  text-align: left;
}

#external-events h4 {
  font-size: 16px;
  margin-top: 0;
  padding-top: 1em;
}

#external-events .fc-event {
  margin: 10px 0;
  cursor: pointer;
}

#external-events p {
  margin: 1.5em 0;
  font-size: 11px;
  color: #666;
}

#external-events p input {
  margin: 0;
  vertical-align: middle;
}

</style>
<style scoped>
.contextmenu {
  list-style-type: circle;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 400;
  color: #333;
  position: absolute;
  z-index: 1001;
  border: 1px solid #E4E7ED;
  background-color: #FFF;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 5px 0;
}
.liStyle {
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 34px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
}

.fc-diy >>> .fc-event {
  width: 10%;
  margin-top: -20px;
  margin-left: 5px;
}

</style>
