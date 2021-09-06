<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
        <el-form-item prop="taskName">
          <el-input size="small" v-model="searchForm.taskName" placeholder="主任务名称" clearable></el-input>
        </el-form-item>
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
      <el-dialog  title="导入Excel" :visible.sync="isImportCollapse">
          <el-form size="small" :inline="true" v-show="isImportCollapse"  ref="importForm">
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
        <el-button v-if="hasPermission('maintask:mainTask:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">催办</el-button>
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
        prop="taskName"
        show-overflow-tooltip
        sortable="custom"
        label="任务名称">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('maintask:mainTask:edit')" @click="edit(scope.row.id)">{{scope.row.taskName}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('maintask:mainTask:view')"  @click="view(scope.row.id)">{{scope.row.taskName}}</el-link>
              <span v-else>{{scope.row.taskName}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="principalName"
        show-overflow-tooltip
        sortable="custom"
        label="负责人">
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
        {{ $dictUtils.getDictLabel("RWZT", scope.row.taskStatus, '-') }}
      </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('maintask:mainTask:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">任务概览</el-button>
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
    <MainTaskForm  ref="mainTaskForm" @refreshDataList="refreshList"></MainTaskForm>
  </div>
</template>

<script>
  import MainTaskForm from './MainTaskForm'
  export default {
    data () {
      return {
        searchForm: {
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false
      }
    },
    components: {
      MainTaskForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/maintask/mainTask/list',
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
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
      // 导入成功
      uploadSuccess (res, file) {
        if (res.success) {
          this.$message.success({dangerouslyUseHTMLString: true,
            message: res.msg})
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
