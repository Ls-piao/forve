<template>
  <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
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
                  :action="`${this.$http.BASE_URL}/fkgl/contractpayment/bgxtFkglBizContractPayment/import`"
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
        <el-button v-if="hasPermission('fkgl:contractpayment:bgxtFkglBizContractPayment:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('fkgl:contractpayment:bgxtFkglBizContractPayment:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('fkgl:contractpayment:bgxtFkglBizContractPayment:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('fkgl:contractpayment:bgxtFkglBizContractPayment:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('fkgl:contractpayment:bgxtFkglBizContractPayment:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
            <el-tab-pane label="办公系统费控管理合同付款明细列表">
                  <el-table
                  size="small"
                  :data="scope.row.bgxtFkglBizContractPaymentContentList"
                  style="width: 100%">
                <el-table-column
                    prop="payment"
                    show-overflow-tooltip
                    label="付款款项">
                  </el-table-column>
                <el-table-column
                    prop="termOfPayment"
                    show-overflow-tooltip
                    label="付款条件">
                  </el-table-column>
                <el-table-column
                    prop="fyzr"
                    show-overflow-tooltip
                    label="违约责任">
                  </el-table-column>
                <el-table-column
                    prop="copeWithDate"
                    show-overflow-tooltip
                    label="应付日期">
                  </el-table-column>
                <el-table-column
                    prop="copeWithMoney"
                    show-overflow-tooltip
                    label="应付金额">
                  </el-table-column>
                <el-table-column
                    prop="yseNo"
                    show-overflow-tooltip
                    label="是否已收发票">
                  </el-table-column>
                <el-table-column
                    prop="invoiceDate"
                    show-overflow-tooltip
                    label="开票日期">
                  </el-table-column>
                <el-table-column
                    prop="invoiceNo"
                    show-overflow-tooltip
                    label="发票号码">
                  </el-table-column>
                <el-table-column
                    prop="invoiceContent"
                    show-overflow-tooltip
                    label="备注">
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
              <el-link  type="primary" :underline="false" v-if="hasPermission('fkgl:contractpayment:bgxtFkglBizContractPayment:edit')" @click="edit(scope.row.id)">{{scope.row.handler}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('fkgl:contractpayment:bgxtFkglBizContractPayment:view')"  @click="view(scope.row.id)">{{scope.row.handler}}</el-link>
              <span v-else>{{scope.row.handler}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="contractName"
        show-overflow-tooltip
        sortable="custom"
        label="合同名称">
      </el-table-column>
    <el-table-column
        prop="contractNo"
        show-overflow-tooltip
        sortable="custom"
        label="合同编号">
      </el-table-column>
    <el-table-column
        prop="handlingDate"
        show-overflow-tooltip
        sortable="custom"
        label="经办日期">
      </el-table-column>
    <el-table-column
        prop="handlingDepartment"
        show-overflow-tooltip
        sortable="custom"
        label="经办部门">
      </el-table-column>
    <el-table-column
        prop="payyee"
        show-overflow-tooltip
        sortable="custom"
        label="收款单位">
      </el-table-column>
    <el-table-column
        prop="contacts"
        show-overflow-tooltip
        sortable="custom"
        label="联系人">
      </el-table-column>
    <el-table-column
        prop="contactsTel"
        show-overflow-tooltip
        sortable="custom"
        label="联系电话">
      </el-table-column>
    <el-table-column
        prop="copeWithMoney"
        show-overflow-tooltip
        sortable="custom"
        label="应付金额">
      </el-table-column>
    <el-table-column
        prop="copeWithDate"
        show-overflow-tooltip
        sortable="custom"
        label="应付日期">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('fkgl:contractpayment:bgxtFkglBizContractPayment:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('fkgl:contractpayment:bgxtFkglBizContractPayment:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('fkgl:contractpayment:bgxtFkglBizContractPayment:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <BgxtFkglBizContractPaymentForm  ref="bgxtFkglBizContractPaymentForm" @refreshDataList="refreshList"></BgxtFkglBizContractPaymentForm>
  </div>
</template>

<script>
  import BgxtFkglBizContractPaymentForm from './BgxtFkglBizContractPaymentForm'
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
      BgxtFkglBizContractPaymentForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/fkgl/contractpayment/bgxtFkglBizContractPayment/list',
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
        this.$refs.bgxtFkglBizContractPaymentForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.bgxtFkglBizContractPaymentForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.bgxtFkglBizContractPaymentForm.init('view', id)
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
            url: '/fkgl/contractpayment/bgxtFkglBizContractPayment/delete',
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
        this.$http.get(`/fkgl/contractpayment/bgxtFkglBizContractPayment/queryById?id=${row.id}`).then(({data}) => {
          this.dataList.forEach((item, index) => {
            if (item.id === row.id) {
              item.bgxtFkglBizContractPaymentContentList = data.bgxtFkglBizContractPayment.bgxtFkglBizContractPaymentContentList
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
        this.$utils.download('/fkgl/contractpayment/bgxtFkglBizContractPayment/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/fkgl/contractpayment/bgxtFkglBizContractPayment/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>