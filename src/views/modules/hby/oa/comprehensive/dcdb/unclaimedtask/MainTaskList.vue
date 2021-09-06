<template>
  <div class="page">
    <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm"
             @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="taskName" label="主任务名称">
        <el-input size="small" v-model="searchForm.taskName" placeholder="主任务名称" clearable></el-input>
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
            prop="object"
            show-overflow-tooltip
            sortable="custom"
            label="任务目标">
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
            prop="taskStatus"
            show-overflow-tooltip
            sortable="custom"
            label="任务状态">
            <template slot-scope="scope">
              <el-tag effect="dark" size="small" type='danger'>{{ $dictUtils.getDictLabel('RWZT', scope.row.taskStatus, '-') }}</el-tag>
              <!--            <span v-if="scope.row.taskStatus === '0'" style="color: red">
                          {{ $dictUtils.getDictLabel('RWZT', scope.row.taskStatus, '-') }}
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
              <el-button v-if="hasPermission('maintask:mainTask:edit')" type="text" icon="el-icon-edit" size="small"
                         @click="accept(scope.row.id)">接受
              </el-button>
              <el-button v-if="hasPermission('maintask:mainTask:edit')" type="text" icon="el-icon-edit" size="small"
                         @click="juJueReason(scope.row.id)">拒绝
              </el-button>
            </template>
          </el-table-column>
      </el-table>

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
      searchForm: {},
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      orderBy: '',
      reason: '',
      dataListSelections: [],
      isImportCollapse: false,
      loading: false
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
    // 接受
    accept (id) {
      this.$confirm(`确定领取该任务吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.acceptActive(id, '1')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消领取任务'
        })
      })
    },
    // 获取数据列表
    acceptActive (id, accept) {
      this.$http({
        url: `/maintask/mainTask/accept`,
        method: 'post',
        data: {
          'id': id,
          'taskStatus': accept
        }
      }).then(({data}) => {
        this.loading = false
        if (data && data.success) {
          this.visible = false
          this.$message.success('操作成功')
          this.$emit('refreshDataList')
          this.refreshList()
        }
      })
    },
    juJueReason (id) {
      this.$prompt('请输入拒绝原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (val) => {
          if (val === null || val.trim().length < 1) {
            return '拒绝原因不能为空'
          }
        }
      }).then(({value}) => {
        this.reason = value
        this.juJue(id)
      }).catch(() => {
      })
    },
    // 拒绝任务
    juJue (id) {
      this.$http({
        url: `/maintask/mainTask/jujue`,
        method: 'post',
        data: {
          id: id,
          reason: this.reason
        }
      }).then(({data}) => {
        this.loading = false
        if (data && data.success) {
          this.visible = false
          this.$message.success('操作成功')
          this.$emit('refreshDataList')
          this.refreshList()
        }
      })
    },
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/maintask/mainTask/mainTaskList',
        method: 'get',
        params: {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy,
          'role': 'manager',
          'taskName': this.searchForm.taskName,
          'taskStatus': '0'
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
      this.$refs.xcDcdbMainTaskForm.init('view', id)
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
