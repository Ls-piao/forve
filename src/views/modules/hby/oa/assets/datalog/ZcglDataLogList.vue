<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="method">
                <el-input size="small" v-model="searchForm.method" placeholder="提交方式" clearable></el-input>
         </el-form-item>
         <el-form-item prop="createDate">
               <el-date-picker
                    v-model="searchForm.createDate"
                    type="daterange"
                    size="small"
                    align="right"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                 </el-date-picker>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
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
                  :action="`${this.$http.BASE_URL}/datalog/zcglDataLog/import`"
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
        <el-button v-if="hasPermission('datalog:zcglDataLog:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('datalog:zcglDataLog:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('datalog:zcglDataLog:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('datalog:zcglDataLog:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
            <el-button v-if="hasPermission('datalog:zcglDataLog:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
    <el-table-column
        prop="remoteAddress"
        show-overflow-tooltip
        sortable="custom"
        label="远程地址">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('datalog:zcglDataLog:edit')" @click="edit(scope.row.id)">{{scope.row.remoteAddress}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('datalog:zcglDataLog:view')"  @click="view(scope.row.id)">{{scope.row.remoteAddress}}</el-link>
              <span v-else>{{scope.row.remoteAddress}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="requestUri"
        show-overflow-tooltip
        sortable="custom"
        label="请求路径">
      </el-table-column>
    <el-table-column
        prop="method"
        show-overflow-tooltip
        sortable="custom"
        label="提交方式">
      </el-table-column>
    <el-table-column
        prop="userId"
        show-overflow-tooltip
        sortable="custom"
        label="操作用户">
      </el-table-column>
    <el-table-column
        prop="dataTable"
        show-overflow-tooltip
        sortable="custom"
        label="数据表名">
      </el-table-column>
    <el-table-column
        prop="dataId"
        show-overflow-tooltip
        sortable="custom"
        label="数据ID">
      </el-table-column>
    <el-table-column
        prop="dataContent"
        show-overflow-tooltip
        sortable="custom"
        label="数据内容">
      </el-table-column>
    <el-table-column
        prop="dataVersion"
        show-overflow-tooltip
        sortable="custom"
        label="版本">
      </el-table-column>
    <el-table-column
        prop="createDate"
        show-overflow-tooltip
        sortable="custom"
        label="创建时间">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('datalog:zcglDataLog:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('datalog:zcglDataLog:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('datalog:zcglDataLog:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <ZcglDataLogForm  ref="zcglDataLogForm" @refreshDataList="refreshList"></ZcglDataLogForm>
  </div>
</template>

<script>
  import ZcglDataLogForm from './ZcglDataLogForm'
  export default {
    data () {
      return {
        searchForm: {
          method: '',
          createDate: ''
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
      ZcglDataLogForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/datalog/zcglDataLog/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginCreateDate: this.searchForm.createDate[0],
            endCreateDate: this.searchForm.createDate[1],
            ...this.lodash.omit(this.searchForm, 'createDate')
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
        this.$refs.zcglDataLogForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.zcglDataLogForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.zcglDataLogForm.init('view', id)
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
            url: '/datalog/zcglDataLog/delete',
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
        this.$utils.download('/datalog/zcglDataLog/import/template')
      },
      exportExcel () {
        let params = {
          beginCreateDate: this.searchForm.createDate[0],
          endCreateDate: this.searchForm.createDate[1],
          ...this.lodash.omit(this.searchForm, 'createDate')
        }
        this.$utils.download('/datalog/zcglDataLog/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>