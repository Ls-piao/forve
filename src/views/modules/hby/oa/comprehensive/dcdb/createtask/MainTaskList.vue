<template>
  <div class="page">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card" style="height: 40px">
      <el-tab-pane v-for="(val,index) in tabsList" :label="val.label" :name="val.name" :key="index" ref="tabs">
      </el-tab-pane>
    </el-tabs>
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
             @keyup.enter.native="refreshList()" @submit.native.prevent>
      <el-form-item prop="taskName" label="主任务名称">
        <el-input size="small" v-model="searchForm.taskName" placeholder="主任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item prop="keyWord" label="关键字">
        <el-input size="small" v-model="searchForm.keyWord" placeholder="关键字" clearable></el-input>
      </el-form-item>
      <el-form-item prop="distributedState" v-if="role === 'founder'" label="派发">
        <el-select v-model="searchForm.distributedState" placeholder="请选择派发状态">
          <el-option
            v-for="(item,key) in  options"
            :key="key"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="taskStatus" label="任务状态">
        <el-select v-model="searchForm.taskStatus" placeholder="请选择任务状态"
                   :disabled="(role != 'founder' && searchForm.distributedState === '') || searchForm.distributedState === '1' ? false : true">
          <el-option
            v-for="(item,key) in  $dictUtils.getDictList('RWZT')"
            :key="key"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 搜索框-->
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
        <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="bg-white top">
      <el-row>
        <el-button v-if=" hasPermission('maintask:mainTask:add')" type="primary" size="small" icon="el-icon-plus"
                   @click="add()">新增
        </el-button>
        <el-button-group class="pull-right">
          <el-button v-if="hasPermission('maintask:mainTask:import')" type="default" size="small"
                     icon="el-icon-upload2"
                     title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
          <el-button v-if="hasPermission('maintask:mainTask:export')" type="default" size="small"
                     icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
<!--          刷新按钮-->
          <el-button
            type="default"
            size="small"
            icon="el-icon-refresh"
            @click="role === 'participant' ? getByParticipant() : refreshList()">
          </el-button>
        </el-button-group>
      </el-row>
      <el-table
        :data="dataList"
        size="small"
        height="calc(100% - 150px)"
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
        v-loading="loading"
        ref="tables"
        class="table">
        <el-table-column
          prop="taskName"
          show-overflow-tooltip
          sortable="custom"
          label="任务名称">
          <template slot-scope="scope">
            <!--            当任务勾选重要字段时显示小图标-->
            <i v-if="scope.row.importance === 1" :style="{color:'red'}" class="el-icon-warning" title="重要的"></i>
            <!--            当任务状态为待确认时显示小图标-->
            <i v-if="role === 'manager' && scope.row.taskStatus === '3'" :style="{color:'#ff9e0d'}"
               class="el-icon-info" title="待确认"></i>
            <!--            当任务没有负责人时显示小图标-->
            <i v-if="role === 'manager' && scope.row.principal === ''" :style="{color:'#ff9e0d'}"
               class="el-icon-question" title="待分配"></i>
            <!--            当提交延期申请但还没被处理时显示小图标-->
            <i v-if="role === 'manager' && scope.row.turnover !== undefined" :style="{color:'#ff9e0d'}"
               class="el-icon-success" title="延期申请未处理"></i>
            <el-link type="primary" :underline="false"
                     @click="view1(scope.row.id,scope.row.taskStatus)">{{ scope.row.taskName }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="principalName"
          show-overflow-tooltip
          sortable="custom"
          label="负责人">
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === '2'" style="color: red">
            {{"暂未分配"}}
            </span>
            <span v-else >
              {{scope.row.principalName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="startDate"
          show-overflow-tooltip
          sortable="custom"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="endDate"
          show-overflow-tooltip
          sortable="custom"
          label="结束时间">
        </el-table-column>
        <el-table-column
          prop="taskType"
          show-overflow-tooltip
          sortable="custom"
          label="任务类型">
          <template slot-scope="scope">
            {{ $dictUtils.getDictLabel('TASK_TYPE', scope.row.taskType, '-') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="taskStatus"
          show-overflow-tooltip
          sortable="custom"
          label="任务状态">
          <template slot-scope="scope">
            <el-tag effect="dark" size="small" type='danger' v-if="scope.row.taskStatus === '0' && scope.row.distributedState === '0'">{{"未派发"}}</el-tag>
            <el-tag effect="dark" size="small" type='danger' v-else-if="scope.row.taskStatus === '1' && Date.now()>new Date(scope.row.endDate).getTime()">{{ timeout[scope.$index] }}</el-tag>
            <el-tag effect="dark" size="small" :type="statusStyle[scope.row.taskStatus]" v-else>{{statusDescribe[scope.row.taskStatus]}}</el-tag>
<!--            <span v-if="scope.row.taskStatus === '0' && scope.row.distributed === '0'" style="color: red">
              未派发
            </span>
            <span v-else-if="scope.row.taskStatus === '0'" style="color: red">
              {{ $dictUtils.getDictLabel('RWZT', scope.row.taskStatus, '-') }}
            </span>
            <span v-else-if="scope.row.taskStatus === '1' && Date.now()>new Date(scope.row.endDate).getTime()"
                  style="color: red">
              {{ timeout[scope.$index] }}
            </span>
            <span v-else>
              {{ $dictUtils.getDictLabel('RWZT', scope.row.taskStatus, '-') }}
            </span>-->
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          :key="Math.random()"
          width="260"
          label="操作">
          <template slot-scope="scope">
            <!-- <el-button v-if="hasPermission('maintask:mainTask:view')" type="text" icon="el-icon-view" size="small"
                       @click="view1(scope.row.id)">查看
            </el-button>-->
            <el-button type="text" icon="el-icon-s-data" size="small"
                       @click="Milestone(scope.row.id, scope.row.endDate)">里程碑
            </el-button>
            <el-button v-if="hasPermission('sontask:sonTask:view')" type="text" icon="el-icon-s-data" size="small"
                       @click="sonTask(scope.row.id,scope.row.principal,scope.row.taskStatus,scope.row.endDate)">子任务
            </el-button>
            <el-button v-if="hasPermission('sontask:sonTask:view')" type="text" icon="el-icon-s-data" size="small"
                       @click="accessory(scope.row.fileUrl)">附件下载
            </el-button>
            <el-button v-if="hasPermission('maintask:mainTask:edit') && role === 'founder'" type="text" icon="el-icon-edit" size="small"
                       @click="edit(scope.row.id)"
                       :style="role === 'participant' ? {display: 'none'} : {display: ''}"
                       :disabled="!(scope.row.distributedState === '0' && (scope.row.taskStatus === '0' || scope.row.taskStatus === '2'))"
            >修改
            </el-button>
            <el-button v-if="role === 'founder'" type="text" icon="el-icon-paperclip" size="small" @click="confirm(scope.row.id)"
            :disabled="!(scope.row.distributedState === '0' && role === 'founder')">
              派发
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <MainTaskForm ref="mainTaskForm" @refreshDataList="refreshList"></MainTaskForm>
    <XcDcdbMainTaskForm ref="xcDcdbMainTaskForm" @refreshDataList="refreshPage" ></XcDcdbMainTaskForm>

    <!-- 附件下载-->
    <el-dialog
      :title="accessoryTitle"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="accessoryDialog">
      <el-form  size="small"  v-loading="loading" :model="scheduleForm" ref="scheduleForm"
               label-width="120px">
        <el-row :gutter="24">
          <el-upload ref="fileUrl"
                     :disabled="true"
                     :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/sontask/sonTask`"
                     :headers="{token: $cookie.get('token')}"
                     :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                     :file-list="fileUrlArra">
          </el-upload>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="accessoryDialog = false"
      >关闭</el-button>
    </span>
    </el-dialog>

    <el-drawer
      size = "900px"
      title="子任务"
      :visible.sync="rightVisible"
      direction="rtl">
      <son-task-list ref="sonTaskList" @closeRight="closeRight"></son-task-list>
    </el-drawer>
    <el-drawer
      size = "900px"
      title="里程碑"
      :visible.sync="rightVisibleMilestone"
      direction="rtl">
      <milestone-list ref="milestoneList" @closeRight="closeRight"></milestone-list>
    </el-drawer>

  </div>


</template>

<script>
import MainTaskForm from './MainTaskForm'
import XcDcdbMainTaskForm from './XcDcdbMainTaskForm'
import SonTaskList from './SonTaskList'
import MilestoneList from '../milestone/MilestoneList'

export default {
  data () {
    return {
      scheduleForm: {
        id: ''
      },
      fileUrl: '',
      accessoryDialog: false,
      accessoryTitle: '附件下载',
      fileUrlArra: [],
      statusStyle: ['danger', 'info', 'warning', '', 'success'],
      statusDescribe: ['未领取', '进行中', '已拒绝', '待确认', '已完成'],
      options: [{
        value: '0',
        label: '未派发'
      }, {
        value: '1',
        label: '已派发'
      }],
      rightVisible: false,
      rightVisibleMilestone: false,
      visible: false,
      flag: '',
      tabsList: [{label: '我负责的', name: 'principal'}, {label: '我分管的', name: 'manager'},
        {label: '我督办的', name: 'oversee'}, {label: '我参与的', name: 'participant'}, {label: '我创建的', name: 'founder'}],
      activeName: 'principal',
      searchForm: {
        taskName: '',
        taskStatus: '',
        distributedState: '',
        keyWord: ''
      },
      role: 'principal',
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      orderBy: '',
      dataListSelections: [],
      isImportCollapse: false,
      loading: false,
      timeout: []
    }
  },
  components: {
    MainTaskForm,
    XcDcdbMainTaskForm,
    SonTaskList,
    MilestoneList
  },
  activated () {
    if (this.role === 'participant') {
      this.getByParticipant()
    } else {
      this.refreshList()
    }
  },
  methods: {
    accessory (url) {
      this.accessoryDialog = true
      // 获取附件url
      this.fileUrlArra = []
      url.split('|').forEach((item) => {
        if (item.trim().length > 0) {
          this.fileUrlArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
        }
      })
    },
    // 跳转到子任务页面
    sonTask (mainTaskId, principal, taskStatus, endDate) {
      this.rightVisible = true
      this.$nextTick(() => {
        this.$refs.sonTaskList.getSonTaskList(mainTaskId, principal, taskStatus, endDate)
      })
    },
    // 跳转到里程碑页面
    Milestone (mainTaskId, endDate) {
      this.rightVisibleMilestone = true
      this.$nextTick(() => {
        this.$refs.milestoneList.getMilestoneList(mainTaskId, endDate, this.role)
      })
    },
    // 显示右侧抽屉
    showRight (row) {
      this.rightVisible = true
      this.$nextTick(() => {
        this.$refs.courseChapterList.refreshList(row.id)
      })
    },
    // 关闭抽屉
    closeRight () {
      this.rightVisible = false
    },
    confirm (id) {
      this.$confirm('是否派发这条任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updateDistributed(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消派发'
        })
      })
    },
    updateDistributed (id) {             // 修改派发状态
      this.$http({
        url: `/maintask/mainTask/updateDistributed`,
        method: 'post',
        data: {
          id: id,
          distributedState: '1'
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.$message.success(data.msg)
          this.refreshList()
        }
      })
    },
    refreshPage () {
      if (this.role === 'participant') {
        this.getByParticipant()
      } else {
        this.refreshList()
      }
    },
    // 详情
    view1 (id, roleType) {
      let role = this.role
      this.$refs.xcDcdbMainTaskForm.init('view', id, role, roleType)
    },
    // tabs 点击触发数据刷新
    handleClick (tab, event) {
      // this.dataList = []
      this.pageNo = 1
      this.total = 0
      this.$refs.searchForm.resetFields()
      // 获取tabs的name
      let beforeTabId = event.target.getAttribute('id')
      let tabId = beforeTabId.split('-')[1]
      this.role = tabId
      // 条件查寻重置
      if (this.role === 'participant') {
        this.getByParticipant()
      } else {
        this.refreshList()
      }
      this.$forceUpdate()
    },
    /* milestone () {
      this.$router.push('/study/dcdb/milestone/MilestoneList')
    }, */
    // 角色为执行者获取数据列表
    getByParticipant () {
      this.loading = true
      this.$http({
        url: '/maintask/mainTask/getByParticipant',
        method: 'get',
        async: true,
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy,
          'taskName': this.searchForm.taskName,
          'taskStatus': this.searchForm.taskStatus,
          'keyWord': this.searchForm.keyWord
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.dataList = data.page.list
          this.total = data.page.count
          this.loading = false
          this.$refs.tables.doLayout()
        }
      }).then(() => {
        // 状态为未领取是将数据置顶显示
        for (var j = 0; j < this.dataList.length; j++) {
          if (this.dataList[j].taskStatus === '0') {
            var arr = this.dataList.splice(j, 1)// 当状态为未领取时，根据下标值删除一条数据
            this.dataList.unshift(arr[0])// 把删除的数据根据下标取出在写到dataList里
          }
        }
        for (var i in this.dataList) { // 遍历dataList
          this.chaoshi(this.dataList[i].endDate)// 根据下标取到dataList里的结束时间，调用chaoshi()方法
        }
      })
    },
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/maintask/mainTask/mainTaskList',
        method: 'get',
        async: true,
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy,
          'taskName': this.searchForm.taskName,
          'taskStatus': this.searchForm.taskStatus,
          'distributedState': this.searchForm.distributedState,
          'keyWord': this.searchForm.keyWord,
          'role': this.role
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.dataList = data.page.list
          this.total = data.page.count
          this.loading = false
          this.$refs.tables.doLayout()
        }
      }).then(() => {
        this.timeout = []
        // 状态为未领取是将数据置顶显示
        for (var j = 0; j < this.dataList.length; j++) {
          if (this.dataList[j].taskStatus === '0') {
            var arr = this.dataList.splice(j, 1)// 当状态为未领取时，根据下标值删除一条数据
            this.dataList.unshift(arr[0])// 把删除的数据根据下标取出在写到dataList里
          }
        }
        for (var i in this.dataList) { // 遍历dataList
          this.chaoshi(this.dataList[i].endDate)// 根据下标取到dataList里的结束时间，调用chaoshi()方法
        }
      })
    },
    //  当前时间超过结束时间提示超时几个小时
    chaoshi (chaoshi) {
      let getYeardata = chaoshi.split(' ')[0]
      const beforeYear = getYeardata.split('-')[0]
      const beforeMonth = getYeardata.split('-')[1]
      const beforeDate = getYeardata.split('-')[2]
      const myDate = new Date()
      myDate.getFullYear()
      myDate.getMonth()
      myDate.getDate()
      var getDifference = (myDate.getFullYear() - beforeYear) * 12 +
        (myDate.getMonth() - beforeMonth + 1) +
        (myDate.getDate() - beforeDate) / 30
      if (getDifference <= 1) {
        this.timeout = this.timeout.concat('超时1个月以内')
      } else if (getDifference >= 12) {
        this.timeout = this.timeout.concat('超时' + parseFloat(getDifference / 12).toFixed(0) + '年')
      } else {
        this.timeout = this.timeout.concat('超时' + parseFloat(getDifference).toFixed(0) + '个月')
      }
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      if (this.role === 'participant') {
        this.getByParticipant()
      } else {
        this.refreshList()
      }
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
      if (this.role === 'participant') {
        this.getByParticipant()
      } else {
        this.refreshList()
      }
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 排序
    sortChangeHandle (obj) {
      if (obj.order === 'ascending') {
        this.orderBy = obj.prop + ' asc'
      } else if (obj.order === 'descending') {
        this.orderBy = obj.prop + ' desc'
      } else {
        this.orderBy = ''
      }
      if (this.role === 'participant') {
        this.getByParticipant()
      } else {
        this.refreshList()
      }
    },
    // 新增
    add () {
      this.$refs.mainTaskForm.init('add', '')
    },
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.mainTaskForm.init('edit', id)
    },
    // 查看
    view (id) {
      this.$refs.mainTaskForm.init('view', id)
    },
    // 删除
    del (id) {
      let ids = id || this.dataListSelections.map(item => {
        return item.id
      }).join(',')
      this.$confirm(`确定删除所选项吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http({
          url: '/maintask/mainTask/delete',
          method: 'delete',
          params: {'ids': ids}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            if (this.role === 'participant') {
              this.getByParticipant()
            } else {
              this.refreshList()
            }
          }
          this.loading = false
        })
      })
    },
    // 导入成功
    uploadSuccess (res, file) {
      if (res.success) {
        this.$message.success({
          dangerouslyUseHTMLString: true,
          message: res.msg
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    // 下载模板
    downloadTpl () {
      this.$utils.download('/maintask/mainTask/import/template')
    },
    exportExcel () {
      let params = {
        ...this.searchForm
      }
      this.$utils.download('/maintask/mainTask/export', params)
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      if (this.role === 'participant') {
        this.getByParticipant()
      } else {
        this.refreshList()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  }
}
</script>
<style>
/*.el-tabs__item.is-active {
  background-color: #c8ebfb;
}*/

</style>
