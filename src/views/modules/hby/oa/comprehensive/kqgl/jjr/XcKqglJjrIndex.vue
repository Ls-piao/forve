<template>
  <div class=" bg-white">
    <el-calendar v-model="timeValue" id="calendar" :first-day-of-week='firstDayOfWeek' class="font_size font_size1">
      <template slot="dateCell" slot-scope="{date, data}">
        <!--自定义内容-->
        <div @click="handleDateClick" slot="reference" class="div-Calendar">
          <div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div>
          <div v-for="item in calendarData">
            <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!==-1">
              <div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!==-1">
                <div class="is-selected" v-if="item.title === '休'"><img :src="require('@/assets/img/kqgl/休.png')" width="10%" alt="休"></div>
                <div class="is-selected" v-if="item.title === '假'" ><img :src="require('@/assets/img/kqgl/假.png')" width="10%" alt="假"></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" style="list-style: none;" class="contextmenu">
      <li class="liStyle" @click="submitDate('normal')">普通节假日</li>
      <li class="liStyle" @click="submitDate('special')">法定节假日</li>
      <li class="liStyle" @click="submitDate('esc')">取消</li>
    </ul>
  </div>
</template>
<script>

export default {
  data () {
    return {
      firstDayOfWeek: 7,
      calendarData: [],
      timeValue: new Date(),
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
  },
  // activated () {
  //   this.refreshList()
  // },
  watch: {
  },
  methods: { // 选择日期
    handleDateClick (data) {
      const menuMinWidth = 50
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = data.clientX - offsetLeft - 110 // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = data.clientY - 185 // fix 位置bug
      this.visible = true
    },
    refreshList () {
      // 加载节假日数据
      this.visible = false
      this.calendarData = []
      this.$http({
        url: '/kqgl/jjr/xcKqglJjr/list',
        method: 'get'
      }).then(({data}) => {
        if (data && data.success) {
          let dataList = data.page.list
          for (let i = 0; i < dataList.length; i++) {
            let obj = {}
            let strArray = dataList[i].jjr.split('-')
            obj['years'] = strArray[0]
            obj['months'] = strArray[1]
            obj['days'] = strArray[2]
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
      if (arg === 'normal') {
        this.jjr.state = '0'
      } else if (arg === 'special') {
        this.jjr.state = '1'
      } else if (arg === 'esc') {
        this.jjr.state = 'esc'
      }
      let date = new Date(this.timeValue)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      const time = y + '-' + m + '-' + d
      this.jjr.jjr = time
      this.loading = true
      this.$http({
        url: '/kqgl/jjr/xcKqglJjr/indexList',
        method: 'post',
        data: this.jjr
      }).then(({data}) => {
        if (data && data.success) {
          this.$message.success(data.msg)
          this.refreshList()
          this.loading = false
        } else {
          this.$message.error(data.msg)
        }
      })
      this.visible = false
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
}

.calendar-day {
  width: 100%;
  height: 100%;
  text-align: right;
  color: #202535;
  line-height: 30px;
  font-size: 16px;
}

.is-selected {
  color: #F8A535;
  font-size: 16px;
  margin-top: -31%;
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

.el-calendar-table:not(.is-range) td.next, .el-calendar-table:not(.is-range) td.prev{
  pointer-events: none;
}

</style>
<style>
.el-calendar-table:not(.is-range) td.next, .el-calendar-table:not(.is-range) td.prev{
  pointer-events: none;
}
.el-calendar-table:not(.is-range) td.next div div div, .el-calendar-table:not(.is-range) td.prev div div div{
   color: #cccccc;
 }
</style>

