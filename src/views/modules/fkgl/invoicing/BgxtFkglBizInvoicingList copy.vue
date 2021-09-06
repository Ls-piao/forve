<template>
  <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="handler">
                <el-input size="small" v-model="searchForm.handler" placeholder="经办人" clearable></el-input>
         </el-form-item>
         <el-form-item prop="handlingDepartment">
                <el-input size="small" v-model="searchForm.handlingDepartment" placeholder="经办部门" clearable></el-input>
         </el-form-item>
         <el-form-item prop="handlingDate">
               <el-date-picker
                    v-model="searchForm.handlingDate"
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
         <el-form-item prop="contractName">
                <el-input size="small" v-model="searchForm.contractName" placeholder="合同名称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="issuingOffice">
                <el-input size="small" v-model="searchForm.issuingOffice" placeholder="开票单位" clearable></el-input>
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
                  :action="`${this.$http.BASE_URL}/fkgl/invoicing/bgxtFkglBizInvoicing/import`"
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
        <el-button v-if="hasPermission('fkgl:invoicing:bgxtFkglBizInvoicing:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('fkgl:invoicing:bgxtFkglBizInvoicing:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('fkgl:invoicing:bgxtFkglBizInvoicing:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('fkgl:invoicing:bgxtFkglBizInvoicing:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('fkgl:invoicing:bgxtFkglBizInvoicing:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
      <el-table-column type="expand">
      <template slot-scope="scope">
      <el-tabs>
            <el-tab-pane label="办公系统费控管理开票申请发票信息">
                  <el-table
                  size="small"
                  :data="scope.row.bgxtFkglBizInvoicingContentList"
                  style="width: 100%">
                <el-table-column
                    prop="invoiceNo"
                    show-overflow-tooltip
                    label="发票号码">
                  </el-table-column>
                <el-table-column
                    prop="invoiceMoney"
                    show-overflow-tooltip
                    label="发票金额">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
      </template>
      </el-table-column>
    <el-table-column
        prop="handler"
        show-overflow-tooltip
        sortable="custom"
        label="经办人">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('fkgl:invoicing:bgxtFkglBizInvoicing:edit')" @click="edit(scope.row.id)">{{scope.row.handler}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('fkgl:invoicing:bgxtFkglBizInvoicing:view')"  @click="view(scope.row.id)">{{scope.row.handler}}</el-link>
              <span v-else>{{scope.row.handler}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="handlingDepartment"
        show-overflow-tooltip
        sortable="custom"
        label="经办部门">
      </el-table-column>
    <el-table-column
        prop="handlingDate"
        show-overflow-tooltip
        sortable="custom"
        label="经办日期">
      </el-table-column>
    <el-table-column
        prop="contractName"
        show-overflow-tooltip
        sortable="custom"
        label="合同名称">
      </el-table-column>
    <el-table-column
        prop="issuingOffice"
        show-overflow-tooltip
        sortable="custom"
        label="开票单位">
      </el-table-column>
    <el-table-column
        prop="taxpayerNo"
        show-overflow-tooltip
        sortable="custom"
        label="纳税人识别号">
      </el-table-column>
    <el-table-column
        prop="invoicingMoney"
        show-overflow-tooltip
        sortable="custom"
        label="申请开票金额">
      </el-table-column>
    <el-table-column
        prop="invoicingType"
        show-overflow-tooltip
        sortable="custom"
        label="发票类型">
        <template slot-scope="scope">
             {{ $dictUtils.getDictLabel("invoicingType", scope.row.invoicingType, '-') }}
        </template>
      </el-table-column>
    <el-table-column
        prop="actualInvoicingMoney"
        show-overflow-tooltip
        sortable="custom"
        label="实际开票金额">
      </el-table-column>
    <el-table-column
        prop="actualInvoicingDate"
        show-overflow-tooltip
        sortable="custom"
        label="开票日期">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('fkgl:invoicing:bgxtFkglBizInvoicing:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('fkgl:invoicing:bgxtFkglBizInvoicing:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('fkgl:invoicing:bgxtFkglBizInvoicing:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <BgxtFkglBizInvoicingForm  ref="bgxtFkglBizInvoicingForm" @refreshDataList="refreshList"></BgxtFkglBizInvoicingForm>
  </div>
</template>

<script>
  import BgxtFkglBizInvoicingForm from './BgxtFkglBizInvoicingForm'
  export default {
    data () {
      return {
        searchForm: {
          handler: '',
          handlingDepartment: '',
          handlingDate: '',
          contractName: '',
          issuingOffice: ''
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
      BgxtFkglBizInvoicingForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/fkgl/invoicing/bgxtFkglBizInvoicing/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginHandlingDate: this.searchForm.handlingDate[0],
            endHandlingDate: this.searchForm.handlingDate[1],
            ...this.lodash.omit(this.searchForm, 'handlingDate')
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
        this.$refs.bgxtFkglBizInvoicingForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.bgxtFkglBizInvoicingForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.bgxtFkglBizInvoicingForm.init('view', id)
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
            url: '/fkgl/invoicing/bgxtFkglBizInvoicing/delete',
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
        this.$http.get(`/fkgl/invoicing/bgxtFkglBizInvoicing/queryById?id=${row.id}`).then(({data}) => {
          this.dataList.forEach((item, index) => {
            if (item.id === row.id) {
              item.bgxtFkglBizInvoicingContentList = data.bgxtFkglBizInvoicing.bgxtFkglBizInvoicingContentList
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
        this.$utils.download('/fkgl/invoicing/bgxtFkglBizInvoicing/import/template')
      },
      exportExcel () {
        let params = {
          beginHandlingDate: this.searchForm.handlingDate[0],
          endHandlingDate: this.searchForm.handlingDate[1],
          ...this.lodash.omit(this.searchForm, 'handlingDate')
        }
        this.$utils.download('/fkgl/invoicing/bgxtFkglBizInvoicing/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>