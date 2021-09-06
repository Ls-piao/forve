<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
             @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="taskName">
        <el-input size="small" v-model="searchForm.taskName" placeholder="子任务名称" clearable></el-input>
      </el-form-item>
      <!--<el-form-item prop="mainTaskName">
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
            :action="`${this.$http.BASE_URL}/sontask/sonTask/import`"
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
        <el-button type="primary" size="small" icon="el-icon-plus"
                   @click="add()"
        :disabled="this.mainTaskStatus !== '1'">新建
        </el-button>
<!--        <el-button v-if="hasPermission('sontask:sonTask:edit')" type="warning" size="small" icon="el-icon-edit-outline"-->
<!--                   @click="edit()"-->
<!--                   :disabled="dataListSelections.length != 1" plain>修改-->
<!--        </el-button>-->
        <el-button-group class="pull-right">
          <el-button v-if="hasPermission('sontask:sonTask:import')" type="default" size="small" icon="el-icon-upload2"
                     title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
          <el-button v-if="hasPermission('sontask:sonTask:export')" type="default" size="small" icon="el-icon-download"
                     title="导出" @click="exportExcel()"></el-button>
          <el-button
            type="default"
            size="small"
            icon="el-icon-refresh"
            @click="refreshList">
          </el-button>
        </el-button-group>
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
          prop="taskName"
          show-overflow-tooltip
          sortable="custom"
          label="子任务名称">
          <template slot-scope="scope">
            <i v-if ="scope.row.importance === 1" :style="{color:'red'}" class = "el-icon-warning"></i>
            <el-link type="primary" :underline="false"
                     @click="view(scope.row.id,scope.row.taskStatus)"
                     :disabled="scope.row.principal !== userId">{{scope.row.taskName}}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="mainTaskName"
          show-overflow-tooltip
          sortable="custom"
          label="主任务">
        </el-table-column>
        <el-table-column
          prop="principalName"
          show-overflow-tooltip
          sortable="custom"
          label="负责人">
        </el-table-column>
       <!-- <el-table-column
          prop="object"
          show-overflow-tooltip
          sortable="custom"
          label="任务目标">
        </el-table-column>-->
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
          prop="taskStatus"
          show-overflow-tooltip
          sortable="custom"
          label="任务状态">
          <template slot-scope="scope">
            {{ $dictUtils.getDictLabel('RWZT', scope.row.taskStatus, '-') }}
          </template>
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
            <el-button v-if="hasPermission('sontask:sonTask:view')  " type="text" icon="el-icon-view" size="small"
                       @click="view(scope.row.id)">查看
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
        background
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <SonTaskForm ref="sonTaskForm" @refreshDataList="refreshList"></SonTaskForm>
    <XcDcdbSonTaskForm ref="xcDcdbSonTaskForm" @refreshDataList="refreshList"></XcDcdbSonTaskForm>

  </div>
</template>

<script>
  import SonTaskForm from './SonTaskForm'
  import XcDcdbSonTaskForm from './XcDcdbSonTaskForm'

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
        dataListSelections: [],
        isImportCollapse: false,
        loading: false,
        mainTaskId: '',
        mainEndDate: '',
        distributedState: ''
      }
    },
    computed: {
      visitedViews () {
        return this.$store.state.tagsView.visitedViews
      }
    },
    components: {
      SonTaskForm,
      XcDcdbSonTaskForm
    },
    activated () {
      this.refreshList()
      this.getUserInfo()
    },
    watch: {
      $route (to, from) {
        if (to.path !== '/study/dcdb/createtask/SonTaskList') {
          this.closeSelectedTag()
        }
      }
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
      // 关闭
      closeSelectedTag () {
        let view = []
        let views = this.$store.state.tagsView.visitedViews
        views.forEach(function (element) {
          if (element.title === '子任务') {
            view = element
          }
        })
        // 关闭页面
        this.$store.dispatch('tagsView/delView', view)
      },
      // 主任务调用方法
      getSonTaskList (mainTaskId, principal, taskStatus, endDate) {
        this.mainPrincipal = principal
        this.mainTaskStatus = taskStatus
        this.mainTaskId = mainTaskId
        this.mainEndDate = endDate
        this.refreshList()
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/sontask/sonTask/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            'mainTaskId': this.mainTaskId,
            'taskStatus': this.searchForm.taskStatus,
            'mainTaskName': this.searchForm.mainTaskName,
            'taskName': this.searchForm.taskName
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
      // 新增
      add () {
        if (Date.now() > new Date(this.mainEndDate).getTime()) {
          this.$alert(`当前主任务已超时，请先延期申请`, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        } else {
          this.$refs.sonTaskForm.init('add', this.mainTaskId, this.mainEndDate)
        }
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.sonTaskForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.xcDcdbSonTaskForm.init('view', id, this.$route.query.role)
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
