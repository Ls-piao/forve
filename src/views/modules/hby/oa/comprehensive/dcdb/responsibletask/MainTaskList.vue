<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
             @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="taskName" label="主任务名称">
        <el-input size="small" v-model="searchForm.taskName" placeholder="主任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item prop="taskStatus" label="状态">
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
            :action="`${this.$http.BASE_URL}/maintask/mainTask/import`"
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
       <!-- <el-button v-if="hasPermission('maintask:mainTask:add')" type="primary" size="small" icon="el-icon-plus"
                   @click="add()">新建
        </el-button>-->
        <!--<el-button v-if="hasPermission('maintask:mainTask:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('maintask:mainTask:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>-->
        <el-button-group class="pull-right">
          <el-button v-if="hasPermission('maintask:mainTask:import')" type="default" size="small" icon="el-icon-upload2"
                     title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
          <el-button v-if="hasPermission('maintask:mainTask:export')" type="default" size="small"
                     icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
        </el-button-group>
      </el-row>
      <el-table
        :data="dataList"
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
        v-loading="loading"
        size="small"
        height="calc(100% - 80px)"
        class="table">

        <el-table-column
          prop="taskName"
          show-overflow-tooltip
          sortable="custom"
          label="任务名称">
          <template slot-scope="scope">
            <i v-if="scope.row.importance === 1" :style="{color:'red'}" class="el-icon-warning"></i>
            <el-link type="primary" :underline="false" v-if="hasPermission('maintask:mainTask:edit')"
                     @click="view(scope.row.id)">{{ scope.row.taskName }}
            </el-link>
            <el-link type="primary" :underline="false" v-else-if="hasPermission('maintask:mainTask:view')"
                     @click="view(scope.row.id)">{{ scope.row.taskName }}
            </el-link>
            <span v-else>{{ scope.row.taskName }}</span>
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
          prop="overseeName"
          show-overflow-tooltip
          sortable="custom"
          label="督办人">
        </el-table-column>
        <el-table-column
          prop="managerName"
          show-overflow-tooltip
          sortable="custom"
          label="分管人">
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
          prop="taskStatus"
          show-overflow-tooltip
          sortable="custom"
          label="任务状态">
          <template slot-scope="scope">
            <el-tag effect="dark" size="small" type='danger' v-if="scope.row.taskStatus === '0' && scope.row.distributedState === '0'">{{"未派发"}}</el-tag>
            <el-tag effect="dark" size="small" type='danger' v-else-if="scope.row.taskStatus === '1' && Date.now()>new Date(scope.row.endDate).getTime()">{{ timeout[scope.$index] }}</el-tag>
            <el-tag effect="dark" size="small" :type="statusStyle[scope.row.taskStatus]" v-else>{{statusDescribe[scope.row.taskStatus]}}</el-tag>

            <!--            <span v-if="scope.row.taskStatus === '0'" style="color: red">
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
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="hasPermission('maintask:mainTask:view')" type="text" icon="el-icon-view" size="small"
                       @click="view(scope.row.id)">任务概览
            </el-button>
            <el-button v-if="hasPermission('maintask:mainTask:view')" type="text" icon="el-icon-s-data" size="small"
                       @click="sonTask(scope.row.id)">查看子任务
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
        style="margin-bottom: 10px"
        background
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <MainTaskForm ref="mainTaskForm" @refreshDataList="refreshList"></MainTaskForm>
    <XcDcdbMainTaskForm ref="xcDcdbMainTaskForm" @refreshDataList="refreshList"></XcDcdbMainTaskForm>

  </div>
</template>

<script>
import MainTaskForm from './MainTaskForm'
import XcDcdbMainTaskForm from '../createtask/XcDcdbMainTaskForm'

export default {
  data () {
    return {
      statusStyle: ['danger', 'info', 'warning', '', 'success'],
      statusDescribe: ['未领取', '进行中', '已拒绝', '待确认', '已完成'],
      searchForm: {},
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      orderBy: '',
      taskStatus: '',
      dataListSelections: [],
      isImportCollapse: false,
      loading: false,
      timeout: []
    }
  },
  components: {
    MainTaskForm,
    XcDcdbMainTaskForm
  },
  activated () {
    this.refreshList()
  },
  methods: {
    // 跳转子任务
    sonTask (mainTaskId) {
      this.$router.push({path: '/study/dcdb/createtask/SonTaskList', query: {mainTaskId: mainTaskId}})
    },
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/maintask/mainTask/findAllList',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy,
          ...this.searchForm
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.dataList = data.page.list
          this.total = data.page.count
          this.loading = false
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
      console.log(chaoshi)
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
      console.log(getDifference)
      if (getDifference <= 1) {
        this.timeout = this.timeout.concat('超时1个月以内')
      } else if (getDifference >= 12) {
        this.timeout = this.timeout.concat('超时' + parseFloat(getDifference / 12).toFixed(0) + '年')
      } else {
        this.timeout = this.timeout.concat('超时' + parseFloat(getDifference).toFixed(0) + '个月')
      }
      console.log(this.timeout)
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
    view (id, roleType) {
      let role = this.role
      this.$refs.xcDcdbMainTaskForm.init('view', id, role, roleType)
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
      this.refreshList()
    }
  }
}
</script>
