<template>
  <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="borrower">
                <el-input size="small" v-model="searchForm.borrower" placeholder="借款人" clearable></el-input>
         </el-form-item>
         <el-form-item prop="department">
                <el-input size="small" v-model="searchForm.department" placeholder="所属部门" clearable></el-input>
         </el-form-item>
         <el-form-item prop="debitDate">
               <el-date-picker
                    v-model="searchForm.debitDate"
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
         <el-form-item prop="returnDate">
               <el-date-picker
                    v-model="searchForm.returnDate"
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
         <el-form-item prop="handlingCashier">
                <el-input size="small" v-model="searchForm.handlingCashier" placeholder="经办出纳" clearable></el-input>
         </el-form-item>
         <el-form-item prop="clearDate">
               <el-date-picker
                    v-model="searchForm.clearDate"
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
          <el-form :inline="true" v-show="isImportCollapse"  class="query-form" ref="importForm">
             <el-form-item>
              <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
             </el-form-item>
             <el-form-item prop="loginName">
                <el-upload
                  class="upload-demo"
                  :action="`${this.$http.BASE_URL}/fkgl/sqjk/bgxtFkglBizSqjk/import`"
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
        <el-button v-if="hasPermission('fkgl:sqjk:bgxtFkglBizSqjk:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('fkgl:sqjk:bgxtFkglBizSqjk:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('fkgl:sqjk:bgxtFkglBizSqjk:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('fkgl:sqjk:bgxtFkglBizSqjk:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('fkgl:sqjk:bgxtFkglBizSqjk:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      v-loading="loading"
      size="small"
      height="calc(100% - 80px)"
      @expand-change="detail"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
    <el-table-column
        prop="department"
        show-overflow-tooltip
        sortable="custom"
        label="所属部门">
      </el-table-column>
    <el-table-column
        prop="borrowingMethod"
        show-overflow-tooltip
        sortable="custom"
        label="借支方式">
      </el-table-column>
    <el-table-column
        prop="debitAmout"
        show-overflow-tooltip
        sortable="custom"
        label="借支金额">
      </el-table-column>
    <el-table-column
        prop="debitDate"
        show-overflow-tooltip
        sortable="custom"
        label="借支日期">
      </el-table-column>
    <el-table-column
        prop="returnDate"
        show-overflow-tooltip
        sortable="custom"
        label="归还日期">
      </el-table-column>
    <el-table-column
        prop="handlingCashier"
        show-overflow-tooltip
        sortable="custom"
        label="经办出纳">
      </el-table-column>
    <el-table-column
        prop="clearDate"
        show-overflow-tooltip
        sortable="custom"
        label="结清日期">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('fkgl:sqjk:bgxtFkglBizSqjk:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('fkgl:sqjk:bgxtFkglBizSqjk:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('fkgl:sqjk:bgxtFkglBizSqjk:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <BgxtFkglBizSqjkForm  ref="bgxtFkglBizSqjkForm" @refreshDataList="refreshList"></BgxtFkglBizSqjkForm>
  </div>
</template>

<script>
  import BgxtFkglBizSqjkForm from './BgxtFkglBizSqjkForm'
  export default {
    data () {
      return {
        searchForm: {
          borrower: '',
          department: '',
          debitDate: '',
          returnDate: '',
          handlingCashier: '',
          clearDate: ''
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
      BgxtFkglBizSqjkForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/fkgl/sqjk/bgxtFkglBizSqjk/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginDebitDate: this.searchForm.debitDate[0],
            endDebitDate: this.searchForm.debitDate[1],
            beginReturnDate: this.searchForm.returnDate[0],
            endReturnDate: this.searchForm.returnDate[1],
            beginClearDate: this.searchForm.clearDate[0],
            endClearDate: this.searchForm.clearDate[1],
            ...this.lodash.omit(this.searchForm, 'debitDate', 'returnDate', 'clearDate')
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
        this.$refs.bgxtFkglBizSqjkForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.bgxtFkglBizSqjkForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.bgxtFkglBizSqjkForm.init('view', id)
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
            url: '/fkgl/sqjk/bgxtFkglBizSqjk/delete',
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
     // 查看详情
      detail (row) {
        this.$http.get(`/fkgl/sqjk/bgxtFkglBizSqjk/queryById?id=${row.id}`).then(({data}) => {
          this.dataList.forEach((item, index) => {
            if (item.id === row.id) {
            }
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
        this.$utils.download('/fkgl/sqjk/bgxtFkglBizSqjk/import/template')
      },
      exportExcel () {
        let params = {
          beginDebitDate: this.searchForm.debitDate[0],
          endDebitDate: this.searchForm.debitDate[1],
          beginReturnDate: this.searchForm.returnDate[0],
          endReturnDate: this.searchForm.returnDate[1],
          beginClearDate: this.searchForm.clearDate[0],
          endClearDate: this.searchForm.clearDate[1],
          ...this.lodash.omit(this.searchForm, 'debitDate', 'returnDate', 'clearDate')
        }
        this.$utils.download('/fkgl/sqjk/bgxtFkglBizSqjk/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>