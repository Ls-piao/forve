<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="milestoneName">
        <el-input size="small" v-model="searchForm.milestoneName" placeholder="里程碑名称" clearable></el-input>
      </el-form-item>
      <!--<el-form-item prop="taskName">
        <el-input size="small" v-model="searchForm.mainTaskName" placeholder="主任务名称" clearable></el-input>
      </el-form-item>-->
      <el-form-item prop="taskStatus">
        <el-select v-model="searchForm.taskStatus" placeholder="请选择状态">
          <el-option
            v-for="(item,key) in  $dictUtils.getDictList('RWZT')"
            :key="key"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
        <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 导入导出-->
    <el-dialog title="导入Excel" :visible.sync="isImportCollapse">
      <el-form size="small" :inline="true" v-show="isImportCollapse" ref="importForm">
        <el-form-item>
          <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
        </el-form-item>
        <el-form-item prop="loginName">
          <el-upload
            class="upload-demo"
            :action="`${this.$http.BASE_URL}/milestone/milestone/import`"
            :on-success="uploadSuccess"
            :show-file-list="true">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="bg-white top">
      <el-row>
        <el-button v-if="hasPermission('milestone:milestone:add') && (role === 'principal'|| role === 'founder')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
      </el-row>
      <el-table
        :data="dataList"
        size="small"
        height="calc(100% - 80px)"
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
        v-loading="loading"
        class="table">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="milestoneName"
          show-overflow-tooltip
          sortable="custom"
          label="里程碑名称">
        </el-table-column>
        <el-table-column
          prop="isEnd"
          show-overflow-tooltip
          sortable="custom"
          label="任务状态">
          <template slot-scope="scope">
            <el-tag effect="dark" size="small" :type="isEndStyle[scope.row.isEnd]">{{isEndDescribe[scope.row.isEnd]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="remarks"
          show-overflow-tooltip
          sortable="custom"
          label="备注信息">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          :key="Math.random()"
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
            <el-button v-if="(role === 'principal'|| role === 'founder')&& scope.row.isEnd ==='0' " type="text" icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <MilestoneForm ref="milestoneForm" @refreshDataList="refreshList"></MilestoneForm>
  </div>
</template>

<script>
import MilestoneForm from './MilestoneForm'

export default {
  data () {
    return {
      role: '',
      statusStyle: ['danger', 'info', 'warning', '', 'success'],
      statusDescribe: ['未领取', '进行中', '已拒绝', '待确认', '已完成'],
      isEndStyle: ['danger', 'success'],
      isEndDescribe: ['未完成', '已完成'],
      taskList: [],
      roleType: 'principal',
      searchForm: {
        milestoneName: '',
        mainTaskName: '',
        taskStatus: ''
      },
      dataList: [],
      percentage: 0,
      pageNo: 1,
      endDate: '',
      pageSize: 10,
      mainTaskId: '',
      total: 0,
      orderBy: '',
      dataListSelections: [],
      isImportCollapse: false,
      loading: false,
      timeout: []
    }
  },
  components: {
    MilestoneForm
  },
  activated () {
    this.refreshList()
  },
  methods: {
    getMilestoneList (mainTaskId, endDate, role) {
      this.role = role
      this.endDate = endDate
      this.mainTaskId = mainTaskId
      this.loading = true
      this.$http({
        url: '/milestone/milestone/list',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy,
          'milestoneName': this.searchForm.milestoneName,
          'taskStatus': this.searchForm.taskStatus,
          'mainTaskName': this.searchForm.mainTaskName,
          'mainTaskId': this.mainTaskId
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.dataList = data.page.list
          this.total = data.page.count
          this.loading = false
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
        url: '/milestone/milestone/list',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy,
          'milestoneName': this.searchForm.milestoneName,
          'taskStatus': this.searchForm.taskStatus,
          'mainTaskName': this.searchForm.mainTaskName,
          'mainTaskId': this.mainTaskId
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.dataList = data.page.list
          this.total = data.page.count
          this.loading = false
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
        this.timeout = this.timeout.concat('超时一个月以内')
      } else if (getDifference >= 12) {
        this.timeout = this.timeout.concat('超时' + parseFloat(getDifference / 12).toFixed(0) + '年')
      } else {
        this.aaaa = this.timeout.concat('超时' + parseFloat(getDifference).toFixed(0) + '月')
      }
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.refreshList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
      this.refreshList()
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
      this.refreshList()
    },
    // 新增
    add () {
      if (Date.now() > new Date(this.endDate).getTime()) {
        this.$alert(`当前主任务已超时，请先延期申请`, '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      } else {
        this.$refs.milestoneForm.init('add', '', this.roleType, this.mainTaskId, 'main', this.percentage)
      }
    },
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.milestoneForm.init('edit', id)
    },
    // 查看
    view (id) {
      this.$refs.milestoneForm.init('view', id)
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
          url: '/milestone/milestone/delete',
          method: 'delete',
          params: {'ids': ids}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            this.refreshList()
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
      this.$utils.download('/milestone/milestone/import/template')
    },
    exportExcel () {
      let params = {
        ...this.searchForm
      }
      this.$utils.download('/milestone/milestone/export', params)
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    },
    // 获取主任务
    getMainTaskList () {
      this.loading = true
      this.$http({
        url: '/maintask/mainTask/getList',
        method: 'get'
      }).then(({data}) => {
        if (data) {
          console.log(data)
          this.taskList = data
        }
      })
    }
  },
  mounted () {
    this.getMainTaskList()
  }
}
</script>
