<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
<!--         <el-form-item prop="bgxr">
                <el-input size="small" v-model="searchForm.bgxr" placeholder="被共享人" clearable></el-input>
         </el-form-item>-->
<!--         <el-form-item prop="gxsj">
                <el-date-picker
                  v-model="searchForm.gxsj"
                  type="datetime"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择共享时间">
                </el-date-picker>
         </el-form-item>-->
         <el-form-item prop="gxr">
                <el-input size="small" v-model="searchForm.gxr" placeholder="共享人" clearable></el-input>
         </el-form-item>
         <el-form-item prop="gxjb">
                <el-input size="small" v-model="searchForm.gxjb" placeholder="共享级别" clearable></el-input>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
<!--            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>-->
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
                  :action="`${this.$http.BASE_URL}/rcgx/rcgx/import`"
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
        <el-button  v-if="this.gxjb !='2'" type="primary" size="small" icon="el-icon-plus" @click="add(searchForm.rcId)">新建</el-button>
<!--        <el-button v-if="this.gxjb !='2'" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>-->
        <el-button v-if="this.gxjb !='2'" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('rcgx:rcgx:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
            <el-button v-if="hasPermission('rcgx:rcgx:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
       height="250"
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
        prop="bgxr"
        show-overflow-tooltip
        sortable="custom"
        label="被共享人">
      </el-table-column>
    <el-table-column
        prop="gxsj"
        show-overflow-tooltip
        sortable="custom"
        label="共享时间">
      </el-table-column>
    <el-table-column
        prop="gxr"
        show-overflow-tooltip
        sortable="custom"
        label="共享人">
      </el-table-column>
    <el-table-column
        prop="gxjb"
        show-overflow-tooltip
        sortable="custom"
        label="共享级别">
      <template slot-scope="scope">
        {{ $dictUtils.getDictLabel("RCGL_GXJB", scope.row.gxjb, '-') }}
      </template>
      </el-table-column>

<!--      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('rcgx:rcgx:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('rcgx:rcgx:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('rcgx:rcgx:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>-->
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
    <RcgxForm  ref="rcgxForm" @refreshDataList="refreshList"></RcgxForm>
  </div>
</template>

<script>
  import RcgxForm from './RcgxForm'
  export default {
    data () {
      return {
        gxjb: '',
        searchForm: {
          bgxr: '',
          gxsj: '',
          gxr: '',
          gxjb: '',
          rcId: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        rcId: '',
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false
      }
    },
    components: {
      RcgxForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/rcgx/rcgx/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            'rcId': this.searchForm.rcId,
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
      add (rcId) {
        this.$refs.rcgxForm.init('add', '', rcId)
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.rcgxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.rcgxForm.init('view', id)
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
            url: '/rcgx/rcgx/delete',
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
        this.$utils.download('/rcgx/rcgx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/rcgx/rcgx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
