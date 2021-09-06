<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="申请人" prop="applicant"
                :rules="[
                 ]">
              <el-input v-model="inputForm.applicant" placeholder="请填写申请人"  disabled   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="所属部门" prop="department"
                :rules="[
                 ]">
              <el-input v-model="inputForm.department" placeholder="请填写所属部门"  disabled   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="所属单位" prop="affiliatedUnit"
                :rules="[
                 ]">
              <el-input v-model="inputForm.affiliatedUnit" placeholder="请填写所属单位"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="报销日期" prop="reimbursementDate"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.reimbursementDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="出差类型" prop="travelType"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.travelType" placeholder="请填写出差类型"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="项目" prop="projectId"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.projectId" placeholder="请填写项目"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="本次支付金额" prop="paymentAmount"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.paymentAmount" placeholder="请填写本次支付金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="支付方式" prop="paymentType"
                :rules="[
                 ]">
              <el-input v-model="inputForm.paymentType" placeholder="请填写支付方式"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="支付日期" prop="paymentDate"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.paymentDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
    <el-col :span="24">
     <el-form-item label-width="0">
            <el-tabs v-model="bgxtFkglBizReimbursementInfoTab">
            <el-tab-pane label="办公系统费控管理报销-日常及采购报销内容"  v-if="inputForm.affiliatedType=='2' || inputForm.affiliatedType=='3' ">
                  <el-button size="small" @click="addBgxtFkglBizReimbursementDailyProcurementRow" type="primary">新增</el-button>
                  <el-table
                  size="small"
                  class="table"
                  :data="inputForm.bgxtFkglBizReimbursementDailyProcurementList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                <el-table-column
                    prop="reimbursementAmount"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="报销金额">
                  </el-table-column>
                <el-table-column
                    prop="totalNumber"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="单据总数">
                  </el-table-column>
                <el-table-column
                    prop="loanAmount"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="借款金额">
                  </el-table-column>
                <el-table-column
                    prop="offsetLoanAmount"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="冲抵借款金额">
                  </el-table-column>
                <el-table-column
                    prop="bankAccount"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="银行账户">
                  </el-table-column>
                <el-table-column
                    prop="bankOfDeposit"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="开户银行">
                  </el-table-column>
                <el-table-column
                    prop="bankNo"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="银行账号">
                  </el-table-column>
                <el-table-column
                    prop="content"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="备注">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                      <el-button @click="viewBgxtFkglBizReimbursementDailyProcurementRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editBgxtFkglBizReimbursementDailyProcurementRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtFkglBizReimbursementDailyProcurementRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            <el-tab-pane label="办公系统费控管理报销-日常及采购报销内容" v-if="inputForm.affiliatedType=='2' || inputForm.affiliatedType=='3' ">
                  <el-button size="small" @click="addBgxtFkglBizReimbursementDailyProcurementDetailRow" type="primary">新增</el-button>
                  <el-table
                  size="small"
                  class="table"
                  :data="inputForm.bgxtFkglBizReimbursementDailyProcurementDetailList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                <el-table-column
                    prop="costContent"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="费用内容">
                  </el-table-column>
                <el-table-column
                    prop="costType"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="费用类别">
                  </el-table-column>
                <el-table-column
                    prop="totalNumber"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="单据总数">
                  </el-table-column>
                <el-table-column
                    prop="amount"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="金额">
                  </el-table-column>
                <el-table-column
                    prop="taxRate"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="税率">
                  </el-table-column>
                <el-table-column
                    prop="filePath"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="附件">
        <template slot-scope="scope" v-if="scope.row.filePath">
            <a :href="item" target="_blank" :key="index" v-for="(item, index) in scope.row.filePath.split('|')">
                {{decodeURIComponent(item.substring(item.lastIndexOf("/")+1))}}
            </a>
        </template>
      </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                      <el-button @click="viewBgxtFkglBizReimbursementDailyProcurementDetailRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editBgxtFkglBizReimbursementDailyProcurementDetailRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtFkglBizReimbursementDailyProcurementDetailRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            <el-tab-pane label="办公系统费控管理报销-差旅费明细"  v-if="inputForm.affiliatedType=='1'">
                  <el-button size="small" @click="addBgxtFkglBizReimbursementTravlDetailRow" type="primary">新增</el-button>
                  <el-table
                  size="small"
                  class="table"
                  :data="inputForm.bgxtFkglBizReimbursementTravlDetailList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                <el-table-column
                    prop="departureTime"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="出发时间">
                  </el-table-column>
                <el-table-column
                    prop="arrivalTime"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="到达时间">
                  </el-table-column>
                <el-table-column
                    prop="departureAddress"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="出发地">
                  </el-table-column>
                <el-table-column
                    prop="arrivalAddress"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="目的地">
                  </el-table-column>
                <el-table-column
                    prop="expenseItem"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="费用项目">
                  </el-table-column>
                <el-table-column
                    prop="numberOfDocuments"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="单据数">
                  </el-table-column>
                <el-table-column
                    prop="amount"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="金额">
                  </el-table-column>
                <el-table-column
                    prop="taxRate"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="税率">
                  </el-table-column>
                <el-table-column
                    prop="filePath"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="附件">
        <template slot-scope="scope" v-if="scope.row.filePath">
            <a :href="item" target="_blank" :key="index" v-for="(item, index) in scope.row.filePath.split('|')">
                {{decodeURIComponent(item.substring(item.lastIndexOf("/")+1))}}
            </a>
        </template>
      </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                      <el-button @click="viewBgxtFkglBizReimbursementTravlDetailRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editBgxtFkglBizReimbursementTravlDetailRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtFkglBizReimbursementTravlDetailRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            <el-tab-pane label="办公系统费控管理报销-差旅费报销内容" v-if="inputForm.affiliatedType=='1'">
                  <el-button size="small" @click="addBgxtFkglBizReimbursementTravlExpensesRow" type="primary">新增</el-button>
                  <el-table
                  size="small"
                  class="table"
                  :data="inputForm.bgxtFkglBizReimbursementTravlExpensesList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                <el-table-column
                    prop="actualTravelDays"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="实际出差天数">
                  </el-table-column>
                <el-table-column
                    prop="actualStayDays"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="实际住宿天数">
                  </el-table-column>
                <el-table-column
                    prop="affiliatedUnit"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="出差补助">
                  </el-table-column>
                <el-table-column
                    prop="travelAllowance"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="住宿费">
                  </el-table-column>
                <el-table-column
                    prop="content"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="备注">
                  </el-table-column>
                <el-table-column
                    prop="reimbursementAmount"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="报销金额">
                  </el-table-column>
                <el-table-column
                    prop="totalNumber"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="单据总数">
                  </el-table-column>
                <el-table-column
                    prop="loanAmount"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="借款金额">
                  </el-table-column>
                <el-table-column
                    prop="offsetLoanAmount"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="冲抵借款金额">
                  </el-table-column>
                <el-table-column
                    prop="bankAccount"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="银行账户">
                  </el-table-column>
                <el-table-column
                    prop="bankOfDeposit"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="开户银行">
                  </el-table-column>
                <el-table-column
                    prop="bankNo"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="银行账号">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                      <el-button @click="viewBgxtFkglBizReimbursementTravlExpensesRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editBgxtFkglBizReimbursementTravlExpensesRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtFkglBizReimbursementTravlExpensesRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
           </el-form-item>
          </el-col>
        </el-row>
    </el-form>
  <BgxtFkglBizReimbursementDailyProcurementForm ref="bgxtFkglBizReimbursementDailyProcurementForm" @addRow="saveBgxtFkglBizReimbursementDailyProcurementRow(arguments)"></BgxtFkglBizReimbursementDailyProcurementForm>
  <BgxtFkglBizReimbursementDailyProcurementDetailForm ref="bgxtFkglBizReimbursementDailyProcurementDetailForm" @addRow="saveBgxtFkglBizReimbursementDailyProcurementDetailRow(arguments)"></BgxtFkglBizReimbursementDailyProcurementDetailForm>
  <BgxtFkglBizReimbursementTravlDetailForm ref="bgxtFkglBizReimbursementTravlDetailForm" @addRow="saveBgxtFkglBizReimbursementTravlDetailRow(arguments)"></BgxtFkglBizReimbursementTravlDetailForm>
  <BgxtFkglBizReimbursementTravlExpensesForm ref="bgxtFkglBizReimbursementTravlExpensesForm" @addRow="saveBgxtFkglBizReimbursementTravlExpensesRow(arguments)"></BgxtFkglBizReimbursementTravlExpensesForm>
</div>
</template>

<script>
  import BgxtFkglBizReimbursementDailyProcurementForm from './BgxtFkglBizReimbursementDailyProcurementForm'
  import BgxtFkglBizReimbursementDailyProcurementDetailForm from './BgxtFkglBizReimbursementDailyProcurementDetailForm'
  import BgxtFkglBizReimbursementTravlDetailForm from './BgxtFkglBizReimbursementTravlDetailForm'
  import BgxtFkglBizReimbursementTravlExpensesForm from './BgxtFkglBizReimbursementTravlExpensesForm'
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        bgxtFkglBizReimbursementInfoTab: '0',
        inputForm: {
          id: '',
          bgxtFkglBizReimbursementDailyProcurementList: [],
          bgxtFkglBizReimbursementDailyProcurementDetailList: [],
          bgxtFkglBizReimbursementTravlDetailList: [],
          bgxtFkglBizReimbursementTravlExpensesList: [],
          applicant: '',
          department: '',
          affiliatedUnit: '',
          reimbursementDate: '',
          travelType: '',
          projectId: '',
          affiliatedType: '',
          paymentAmount: '',
          paymentType: '',
          paymentDate: ''
        }
      }
    },
    props: {
      businessId: {
        type: String,
        default: ''
      },
      formReadOnly: {
        type: Boolean,
        default: false
      }
    },
    components: {
      BgxtFkglBizReimbursementDailyProcurementForm,
      BgxtFkglBizReimbursementDailyProcurementDetailForm,
      BgxtFkglBizReimbursementTravlDetailForm,
      BgxtFkglBizReimbursementTravlExpensesForm
    },
    watch: {
      'businessId': {
        handler (newVal) {
          this.inputForm.affiliatedType = '1'
          if (this.businessId) {
            this.init(this.businessId)
          } else {
            this.$nextTick(() => {
              this.$refs.inputForm.resetFields()
              this.showUserInfo()
            })
          }
        },
        immediate: true,
        deep: false
      }
    },
    methods: {
      showUserInfo () {
        this.$http({
          url: '/sys/user/info',
          method: 'get'
        }).then(({data}) => {
          if (data.success) {
            this.inputForm.applicant = data.user.name
            this.inputForm.department = data.user.office.name
          }
        })
      },
      init (id) {
        if (id) {
          this.bgxtFkglBizReimbursementInfoTab = '0'
          this.inputForm.bgxtFkglBizReimbursementDailyProcurementList = []
          this.inputForm.bgxtFkglBizReimbursementDailyProcurementDetailList = []
          this.inputForm.bgxtFkglBizReimbursementTravlDetailList = []
          this.inputForm.bgxtFkglBizReimbursementTravlExpensesList = []
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/fkgl/reimbursementinfo/bgxtFkglBizReimbursementInfo/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtFkglBizReimbursementInfo)
              this.loading = false
            })
          })
        }
      },
      saveBgxtFkglBizReimbursementDailyProcurementRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtFkglBizReimbursementDailyProcurementList.push(child[1])
        } else {
          this.inputForm.bgxtFkglBizReimbursementDailyProcurementList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtFkglBizReimbursementDailyProcurementList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtFkglBizReimbursementDailyProcurementRow (child) {
        this.$refs.bgxtFkglBizReimbursementDailyProcurementForm.init('add')
      },
      viewBgxtFkglBizReimbursementDailyProcurementRow (child) {
        this.$refs.bgxtFkglBizReimbursementDailyProcurementForm.init('view', child)
      },
      editBgxtFkglBizReimbursementDailyProcurementRow (child) {
        this.$refs.bgxtFkglBizReimbursementDailyProcurementForm.init('edit', child)
      },
      delBgxtFkglBizReimbursementDailyProcurementRow (child) {
        this.inputForm.bgxtFkglBizReimbursementDailyProcurementList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtFkglBizReimbursementDailyProcurementList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtFkglBizReimbursementDailyProcurementList.splice(index, 1, item)
          }
        })
      },
      saveBgxtFkglBizReimbursementDailyProcurementDetailRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtFkglBizReimbursementDailyProcurementDetailList.push(child[1])
        } else {
          this.inputForm.bgxtFkglBizReimbursementDailyProcurementDetailList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtFkglBizReimbursementDailyProcurementDetailList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtFkglBizReimbursementDailyProcurementDetailRow (child) {
        this.$refs.bgxtFkglBizReimbursementDailyProcurementDetailForm.init('add')
      },
      viewBgxtFkglBizReimbursementDailyProcurementDetailRow (child) {
        this.$refs.bgxtFkglBizReimbursementDailyProcurementDetailForm.init('view', child)
      },
      editBgxtFkglBizReimbursementDailyProcurementDetailRow (child) {
        this.$refs.bgxtFkglBizReimbursementDailyProcurementDetailForm.init('edit', child)
      },
      delBgxtFkglBizReimbursementDailyProcurementDetailRow (child) {
        this.inputForm.bgxtFkglBizReimbursementDailyProcurementDetailList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtFkglBizReimbursementDailyProcurementDetailList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtFkglBizReimbursementDailyProcurementDetailList.splice(index, 1, item)
          }
        })
      },
      saveBgxtFkglBizReimbursementTravlDetailRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtFkglBizReimbursementTravlDetailList.push(child[1])
        } else {
          this.inputForm.bgxtFkglBizReimbursementTravlDetailList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtFkglBizReimbursementTravlDetailList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtFkglBizReimbursementTravlDetailRow (child) {
        this.$refs.bgxtFkglBizReimbursementTravlDetailForm.init('add')
      },
      viewBgxtFkglBizReimbursementTravlDetailRow (child) {
        this.$refs.bgxtFkglBizReimbursementTravlDetailForm.init('view', child)
      },
      editBgxtFkglBizReimbursementTravlDetailRow (child) {
        this.$refs.bgxtFkglBizReimbursementTravlDetailForm.init('edit', child)
      },
      delBgxtFkglBizReimbursementTravlDetailRow (child) {
        this.inputForm.bgxtFkglBizReimbursementTravlDetailList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtFkglBizReimbursementTravlDetailList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtFkglBizReimbursementTravlDetailList.splice(index, 1, item)
          }
        })
      },
      saveBgxtFkglBizReimbursementTravlExpensesRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtFkglBizReimbursementTravlExpensesList.push(child[1])
        } else {
          this.inputForm.bgxtFkglBizReimbursementTravlExpensesList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtFkglBizReimbursementTravlExpensesList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtFkglBizReimbursementTravlExpensesRow (child) {
        this.$refs.bgxtFkglBizReimbursementTravlExpensesForm.init('add')
      },
      viewBgxtFkglBizReimbursementTravlExpensesRow (child) {
        this.$refs.bgxtFkglBizReimbursementTravlExpensesForm.init('view', child)
      },
      editBgxtFkglBizReimbursementTravlExpensesRow (child) {
        this.$refs.bgxtFkglBizReimbursementTravlExpensesForm.init('edit', child)
      },
      delBgxtFkglBizReimbursementTravlExpensesRow (child) {
        this.inputForm.bgxtFkglBizReimbursementTravlExpensesList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtFkglBizReimbursementTravlExpensesList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtFkglBizReimbursementTravlExpensesList.splice(index, 1, item)
          }
        })
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/fkgl/reimbursementinfo/bgxtFkglBizReimbursementInfo/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                callback(data.businessTable, data.businessId)
              }
            })
          }
        })
      }
    }
  }
</script>