<template>
  <el-drawer
    :visible.sync="dialog"
    :title="title"
    :show-close="showClose"
    custom-class="demo-drawer"
    close-on-press-escape
    @close="closePage"
    ref="drawer"
    size="40%">
  <div class="el-calendar__header">
    <div class="el-calendar__button-group">
      <div class="el-button-group">
        <button
          type="button"
          class="el-button el-button--plain el-button--mini"
          @click="saveOnClick">
          <span>新增</span>
        </button>
      </div>
    </div>
  </div>
  <div class="calendar-info">
    <div v-if="show" class="ep-list-empty-text">暂无排班信息</div>
    <div style="padding: 15px;">
      <div role="alert" class="el-alert el-alert--success is-dark" v-for="item in dataList">
        <div @click="infoOnClick(item.id)">
        <i class="el-alert__icon el-icon-success is-big"></i>
        <div class="el-alert__content">
          <span class="el-alert__title is-bold">值班时间：{{ item.startDate }} ~ {{ item.endDate }}</span>
          <p class="el-alert__description">值班人员：{{ item.personName }}</p>
          <p class="el-alert__description">备注：{{ item.remarks }}</p>
          <i class="el-alert__closebtn el-icon-close" @click.stop="infoDel(item.id)"></i>
        </div>
        </div>
      </div>
    </div>
  </div>
    <!-- 弹窗, 新增 / 修改 -->
    <QbxxForm  ref="qbxxForm" @refreshDataList="refreshList"></QbxxForm>
  </el-drawer>
</template>

<script>
import QbxxForm from './QbxxForm'
export default {
  name: 'QbxxListDraw',
  data () {
    return {
      showClose: true,
      title: '排班设置',
      loading: false,
      dialog: false,
      dataList: [],
      dateParam: '',
      show: false
    }
  },
  components: {
    QbxxForm
  },
  methods: {
    // 初始化
    init (date) {
      this.dateParam = date
      this.dialog = true
      this.loading = true
      this.$http({
        url: `/kqgl/pbxx/qbxx/queryByDay`,
        methods: 'get',
        params: {
          startDate: date
        }
      }).then(({data}) => {
        // console.log('data', data)
        if (data.success) {
          this.dataList = data.list
          if (data.list.length === 0) {
            this.show = true
          } else {
            this.show = false
          }
        } else {
          this.show = true
        }
        this.loading = false
      })
    },
    // 刷新列表
    refreshList () {
      this.init(this.dateParam)
    },
    // 点击信息块
    infoOnClick (id) {
      this.$refs.qbxxForm.init('view', id)
    },
    // 新增排班
    saveOnClick () {
      this.$refs.qbxxForm.init('add', '', this.dateParam)
    },
    // 删除排班
    infoDel (id) {
      this.$confirm('此操作将永久删除该排班, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http({
          url: `/kqgl/pbxx/qbxx/delete`,
          method: 'delete',
          params: {'ids': id}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            this.init(this.dateParam)
          }
          this.loading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    closePage () {
      this.show = false
      this.dataList = []
      this.$emit('refreshDataList')
    }
  }
}
</script>

<style scoped>
.is-selected {
  color: #1989fa;
}
.p-popover {
  text-align: center;
}
._calendar {
  height: 99.5%;
  width: 100%;
}
.el-main {
  padding: 0px;
  overflow: hidden;
}
.calendar-info {
  height: 94%;
  overflow: auto;
}
.el-alert {
  margin: 15px 0px;
}
.el-alert:hover {
  transform: scale(1.02);
}
.el-alert:active {
  transform: scale(1.01);
}
</style>
<style>
._calendar .div-Calendar {
  height: 125px;
  box-sizing: border-box;
  padding: 8px;
}
._calendar .el-calendar-table .el-calendar-day {
  padding: 0px;
  height: 125px;
}
._calendar .el-container,
._calendar .el-calendar {
  height: 100%;
}
._calendar .el-card__body {
  padding: 0px;
}
</style>

