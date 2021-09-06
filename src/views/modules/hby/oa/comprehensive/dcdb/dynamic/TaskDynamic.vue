<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
             @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="taskName">
        <el-input size="small" v-model="searchForm.taskName" placeholder="任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
        <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="bg-white top">
      <el-table
        :data="dataList"
        size="small"
        height="calc(100% - 80px)"
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
        v-loading="loading"
        class="table">
        <el-table-column
          prop="operation"
          show-overflow-tooltip
          sortable="custom"
          label="操作类型">
          <template slot-scope="scope">
            <el-tag effect="dark" size="small" type='warning' v-if="scope.row.operation === 'ggztTask'">{{$dictUtils.getDictLabel('RWDT', scope.row.operation, '-')}}</el-tag>
            <el-tag effect="dark" size="small" type='success' v-else-if="scope.row.operation === 'addTask'">{{$dictUtils.getDictLabel('RWDT', scope.row.operation, '-')}}</el-tag>
            <el-tag effect="dark" size="small" type='' v-else-if="scope.row.operation === 'updateTask'">{{$dictUtils.getDictLabel('RWDT', scope.row.operation, '-')}}</el-tag>
            <el-tag effect="dark" size="small" type='success' v-else-if="scope.row.operation === 'addSonTask'">{{$dictUtils.getDictLabel('RWDT', scope.row.operation, '-')}}</el-tag>
            <el-tag effect="dark" size="small" type='warning' v-else-if="scope.row.operation === 'ggztSonTask'">{{$dictUtils.getDictLabel('RWDT', scope.row.operation, '-')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="mainTaskName"
          show-overflow-tooltip
          sortable="custom"
          label="主任务">
        </el-table-column>
        <el-table-column
          prop="user.name"
          show-overflow-tooltip
          sortable="custom"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="createDate"
          show-overflow-tooltip
          sortable="custom"
          label="操作时间">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          fixed="right"
          :key="Math.random()"
          width="200"
          label="操作">
          <!--|| this.mainPrincipal === this.userId-->
          <!--v-if="scope.row.isPrincipal === 1 || mainPrincipal === userId"-->
          <template slot-scope="scope"  >
            <el-button v-if="hasPermission('sontask:sonTask:view')" type="text" icon="el-icon-view" size="small"
                       @click="view(scope.row.id, scope.row.operation)">变更详情
            </el-button>
            <!--<el-button v-if="hasPermission('sontask:sonTask:edit')" type="text" icon="el-icon-edit" size="small"
                       @click="edit(scope.row.id)" :disabled = "scope.row.taskStatus === '1' ? false : true">修改
            </el-button>-->
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
        style="margin-bottom: 10px"
        background
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <TaskDynamicForm ref="taskDynamicForm" @refreshDataList="refreshList"></TaskDynamicForm>
    <SonTaskDynamicForm ref="sonTaskDynamicForm"  @refreshDataList="refreshList"></SonTaskDynamicForm>
  </div>
</template>

<script>
import TaskDynamicForm from './TaskDynamicForm'
import SonTaskDynamicForm from './SonTaskDynamicForm'

export default {
  data () {
    return {
      mainTaskStatus: '',
      mainPrincipal: '',
      userId: '',
      searchForm: {
        taskName: '',
        mainTaskName: '',
        taskStatus: ''
      },
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      orderBy: '',
      operation: '',
      dataListSelections: [],
      mainTaskId: '',
      mainEndDate: '',
      isImportCollapse: false,
      loading: false,
      distributedState: ''
    }
  },
  computed: {
  },
  components: {
    TaskDynamicForm,
    SonTaskDynamicForm
  },
  activated () {
    this.refreshList()
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      this.$http({
        url: '/sys/user/info',
        method: 'get'
      }).then(({data}) => {
        if (data.success) {
          this.userId = data.user.id
        }
      })
    },
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '//taskDynamic/taskDynamic/list',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy,
          'mainTaskId': this.mainTaskId
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.dataList = data.page.list
          this.total = data.page.count
          this.loading = false
        }
      })
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
    // 查看
    view (id, operation) {
      if (operation === 'addTask' || operation === 'updateTask' || operation === 'ggztTask') {
        this.$refs.taskDynamicForm.init('view', id)
      } else if (operation === 'addSonTask' || operation === 'updateSonTask' || operation === 'ggztSonTask') {
        this.$refs.sonTaskDynamicForm.init('view', id)
      }
    },
    // 删除tab
    removeTabHandle (tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          this.$router.push({name: this.mainTabs[this.mainTabs.length - 1].name}, () => {
            this.mainTabsActiveName = this.$route.name
          })
        }
      } else {
        this.$router.push('/')
      }
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
          url: '/sontask/sonTask/delete',
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
      this.$utils.download('/sontask/sonTask/import/template')
    },
    exportExcel () {
      let params = {
        ...this.searchForm
      }
      this.$utils.download('/sontask/sonTask/export', params)
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    }
  }
}
</script>
