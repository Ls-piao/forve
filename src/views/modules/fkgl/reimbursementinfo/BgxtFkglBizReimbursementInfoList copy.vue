<template>
  <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="applicant">
                <el-input size="small" v-model="searchForm.applicant" placeholder="申请人" clearable></el-input>
         </el-form-item>
         <el-form-item prop="department">
                <el-input size="small" v-model="searchForm.department" placeholder="所属部门" clearable></el-input>
         </el-form-item>
         <el-form-item prop="affiliatedUnit">
                <el-input size="small" v-model="searchForm.affiliatedUnit" placeholder="所属单位" clearable></el-input>
         </el-form-item>
         <el-form-item prop="reimbursementDate">
               <el-date-picker
                    v-model="searchForm.reimbursementDate"
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
         <el-form-item prop="affiliatedType">
                  <el-radio-group v-model="searchForm.affiliatedType">
                    <el-radio v-for="item in $dictUtils.getDictList('')" :label="item.value" :key="item.id">{{item.label}}</el-radio>
                  </el-radio-group>
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
                  :action="`${this.$http.BASE_URL}/fkgl/reimbursementinfo/bgxtFkglBizReimbursementInfo/import`"
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
        <el-button v-if="hasPermission('fkgl:reimbursementinfo:bgxtFkglBizReimbursementInfo:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('fkgl:reimbursementinfo:bgxtFkglBizReimbursementInfo:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('fkgl:reimbursementinfo:bgxtFkglBizReimbursementInfo:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('fkgl:reimbursementinfo:bgxtFkglBizReimbursementInfo:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>
            <el-button v-if="hasPermission('fkgl:reimbursementinfo:bgxtFkglBizReimbursementInfo:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
            <el-tab-pane label="办公系统费控管理报销-日常及采购报销内容">
                  <el-table
                  size="small"
                  :data="scope.row.bgxtFkglBizReimbursementDailyProcurementList"
                  style="width: 100%">
                <el-table-column
                    prop="reimbursementAmount"
                    show-overflow-tooltip
                    label="报销金额">
                  </el-table-column>
                <el-table-column
                    prop="totalNumber"
                    show-overflow-tooltip
                    label="单据总数">
                  </el-table-column>
                <el-table-column
                    prop="loanAmount"
                    show-overflow-tooltip
                    label="借款金额">
                  </el-table-column>
                <el-table-column
                    prop="offsetLoanAmount"
                    show-overflow-tooltip
                    label="冲抵借款金额">
                  </el-table-column>
                <el-table-column
                    prop="bankAccount"
                    show-overflow-tooltip
                    label="银行账户">
                  </el-table-column>
                <el-table-column
                    prop="bankOfDeposit"
                    show-overflow-tooltip
                    label="开户银行">
                  </el-table-column>
                <el-table-column
                    prop="bankNo"
                    show-overflow-tooltip
                    label="银行账号">
                  </el-table-column>
                <el-table-column
                    prop="content"
                    show-overflow-tooltip
                    label="备注">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            <el-tab-pane label="办公系统费控管理报销-日常及采购报销内容">
                  <el-table
                  size="small"
                  :data="scope.row.bgxtFkglBizReimbursementDailyProcurementDetailList"
                  style="width: 100%">
                <el-table-column
                    prop="costContent"
                    show-overflow-tooltip
                    label="费用内容">
                  </el-table-column>
                <el-table-column
                    prop="costType"
                    show-overflow-tooltip
                    label="费用类别">
                  </el-table-column>
                <el-table-column
                    prop="totalNumber"
                    show-overflow-tooltip
                    label="单据总数">
                  </el-table-column>
                <el-table-column
                    prop="amount"
                    show-overflow-tooltip
                    label="金额">
                  </el-table-column>
                <el-table-column
                    prop="taxRate"
                    show-overflow-tooltip
                    label="税率">
                  </el-table-column>
      <el-table-column
            prop="filePath"
            show-overflow-tooltip
            sortable="custom"
            label="附件">
            <template slot-scope="scope" v-if="scope.row.filePath">
                <a :href="item" target="_blank" :key="index" v-for="(item, index) in scope.row.filePath.split('|')">
                    {{decodeURIComponent(item.substring(item.lastIndexOf("/")+1))}}
                </a>
            </template>
      </el-table-column>
                </el-table>
              </el-tab-pane>
            <el-tab-pane label="办公系统费控管理报销-差旅费明细">
                  <el-table
                  size="small"
                  :data="scope.row.bgxtFkglBizReimbursementTravlDetailList"
                  style="width: 100%">
                <el-table-column
                    prop="departureTime"
                    show-overflow-tooltip
                    label="出发时间">
                  </el-table-column>
                <el-table-column
                    prop="arrivalTime"
                    show-overflow-tooltip
                    label="到达时间">
                  </el-table-column>
                <el-table-column
                    prop="departureAddress"
                    show-overflow-tooltip
                    label="出发地">
                  </el-table-column>
                <el-table-column
                    prop="arrivalAddress"
                    show-overflow-tooltip
                    label="目的地">
                  </el-table-column>
                <el-table-column
                    prop="expenseItem"
                    show-overflow-tooltip
                    label="费用项目">
                  </el-table-column>
                <el-table-column
                    prop="numberOfDocuments"
                    show-overflow-tooltip
                    label="单据数">
                  </el-table-column>
                <el-table-column
                    prop="amount"
                    show-overflow-tooltip
                    label="金额">
                  </el-table-column>
                <el-table-column
                    prop="taxRate"
                    show-overflow-tooltip
                    label="税率">
                  </el-table-column>
      <el-table-column
            prop="filePath"
            show-overflow-tooltip
            sortable="custom"
            label="附件">
            <template slot-scope="scope" v-if="scope.row.filePath">
                <a :href="item" target="_blank" :key="index" v-for="(item, index) in scope.row.filePath.split('|')">
                    {{decodeURIComponent(item.substring(item.lastIndexOf("/")+1))}}
                </a>
            </template>
      </el-table-column>
                </el-table>
              </el-tab-pane>
            <el-tab-pane label="办公系统费控管理报销-差旅费报销内容">
                  <el-table
                  size="small"
                  :data="scope.row.bgxtFkglBizReimbursementTravlExpensesList"
                  style="width: 100%">
                <el-table-column
                    prop="actualTravelDays"
                    show-overflow-tooltip
                    label="实际出差天数">
                  </el-table-column>
                <el-table-column
                    prop="actualStayDays"
                    show-overflow-tooltip
                    label="实际住宿天数">
                  </el-table-column>
                <el-table-column
                    prop="affiliatedUnit"
                    show-overflow-tooltip
                    label="出差补助">
                  </el-table-column>
                <el-table-column
                    prop="travelAllowance"
                    show-overflow-tooltip
                    label="住宿费">
                  </el-table-column>
                <el-table-column
                    prop="content"
                    show-overflow-tooltip
                    label="备注">
                  </el-table-column>
                <el-table-column
                    prop="reimbursementAmount"
                    show-overflow-tooltip
                    label="报销金额">
                  </el-table-column>
                <el-table-column
                    prop="totalNumber"
                    show-overflow-tooltip
                    label="单据总数">
                  </el-table-column>
                <el-table-column
                    prop="loanAmount"
                    show-overflow-tooltip
                    label="借款金额">
                  </el-table-column>
                <el-table-column
                    prop="offsetLoanAmount"
                    show-overflow-tooltip
                    label="冲抵借款金额">
                  </el-table-column>
                <el-table-column
                    prop="bankAccount"
                    show-overflow-tooltip
                    label="银行账户">
                  </el-table-column>
                <el-table-column
                    prop="bankOfDeposit"
                    show-overflow-tooltip
                    label="开户银行">
                  </el-table-column>
                <el-table-column
                    prop="bankNo"
                    show-overflow-tooltip
                    label="银行账号">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
      </template>
      </el-table-column>
    <el-table-column
        prop="applicant"
        show-overflow-tooltip
        sortable="custom"
        label="申请人">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('fkgl:reimbursementinfo:bgxtFkglBizReimbursementInfo:edit')" @click="edit(scope.row.id)">{{scope.row.applicant}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('fkgl:reimbursementinfo:bgxtFkglBizReimbursementInfo:view')"  @click="view(scope.row.id)">{{scope.row.applicant}}</el-link>
              <span v-else>{{scope.row.applicant}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="department"
        show-overflow-tooltip
        sortable="custom"
        label="所属部门">
      </el-table-column>
    <el-table-column
        prop="affiliatedUnit"
        show-overflow-tooltip
        sortable="custom"
        label="所属单位">
      </el-table-column>
    <el-table-column
        prop="reimbursementDate"
        show-overflow-tooltip
        sortable="custom"
        label="报销日期">
      </el-table-column>
    <el-table-column
        prop="affiliatedType"
        show-overflow-tooltip
        sortable="custom"
        label="类型">
        <template slot-scope="scope">
             {{ $dictUtils.getDictLabel("", scope.row.affiliatedType, '-') }}
        </template>
      </el-table-column>
    <el-table-column
        prop="paymentAmount"
        show-overflow-tooltip
        sortable="custom"
        label="本次支付金额">
      </el-table-column>
    <el-table-column
        prop="paymentDate"
        show-overflow-tooltip
        sortable="custom"
        label="支付日期">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('fkgl:reimbursementinfo:bgxtFkglBizReimbursementInfo:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('fkgl:reimbursementinfo:bgxtFkglBizReimbursementInfo:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('fkgl:reimbursementinfo:bgxtFkglBizReimbursementInfo:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>
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
    <BgxtFkglBizReimbursementInfoForm  ref="bgxtFkglBizReimbursementInfoForm" @refreshDataList="refreshList"></BgxtFkglBizReimbursementInfoForm>
  </div>
</template>

<script>
  import BgxtFkglBizReimbursementInfoForm from './BgxtFkglBizReimbursementInfoForm'
  export default {
    data () {
      return {
        searchForm: {
          applicant: '',
          department: '',
          affiliatedUnit: '',
          reimbursementDate: '',
          affiliatedType: ''
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
      BgxtFkglBizReimbursementInfoForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/fkgl/reimbursementinfo/bgxtFkglBizReimbursementInfo/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginReimbursementDate: this.searchForm.reimbursementDate[0],
            endReimbursementDate: this.searchForm.reimbursementDate[1],
            ...this.lodash.omit(this.searchForm, 'reimbursementDate')
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
        this.$refs.bgxtFkglBizReimbursementInfoForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.bgxtFkglBizReimbursementInfoForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.bgxtFkglBizReimbursementInfoForm.init('view', id)
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
            url: '/fkgl/reimbursementinfo/bgxtFkglBizReimbursementInfo/delete',
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
        this.$http.get(`/fkgl/reimbursementinfo/bgxtFkglBizReimbursementInfo/queryById?id=${row.id}`).then(({data}) => {
          this.dataList.forEach((item, index) => {
            if (item.id === row.id) {
              item.bgxtFkglBizReimbursementDailyProcurementList = data.bgxtFkglBizReimbursementInfo.bgxtFkglBizReimbursementDailyProcurementList
              item.bgxtFkglBizReimbursementDailyProcurementDetailList = data.bgxtFkglBizReimbursementInfo.bgxtFkglBizReimbursementDailyProcurementDetailList
              item.bgxtFkglBizReimbursementTravlDetailList = data.bgxtFkglBizReimbursementInfo.bgxtFkglBizReimbursementTravlDetailList
              item.bgxtFkglBizReimbursementTravlExpensesList = data.bgxtFkglBizReimbursementInfo.bgxtFkglBizReimbursementTravlExpensesList
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
        this.$utils.download('/fkgl/reimbursementinfo/bgxtFkglBizReimbursementInfo/import/template')
      },
      exportExcel () {
        let params = {
          beginReimbursementDate: this.searchForm.reimbursementDate[0],
          endReimbursementDate: this.searchForm.reimbursementDate[1],
          ...this.lodash.omit(this.searchForm, 'reimbursementDate')
        }
        this.$utils.download('/fkgl/reimbursementinfo/bgxtFkglBizReimbursementInfo/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>