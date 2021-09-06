<template>
<div>
  <el-dialog width="80%"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly" label-width="150px">
    <div id="printMe" style="width:100%">
      <el-row  :gutter="15">
        <div class="text item">
            <el-row  :gutter="15">
              <el-col :span="24">
                <el-form-item style="text-align:center;size:24px;font-weight:bold;">费用报销单</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公司名称：">{{inputForm.affiliatedUnit}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请人：">{{inputForm.applicant}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="报销日期：">{{inputForm.reimbursementDate.substring(0,10)}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所属项目：">{{inputForm.projectName}}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label-width="0" style="margin-top:-60px;">
                  <el-tabs v-model="bgxtFkglBizReimbursementInfoTab">
                    <el-tab-pane >
                        <el-table
                          size="small"
                          class="table"
                          :data="inputForm.bgxtFkglBizReimbursementTravlDetailList.filter(function(item){ return item.delFlag !== '1'})"
                          style="width: 100%;">
                        <el-table-column
                          prop="departureTime"
                          header-align="center"
                          align="center"
                          show-overflow-tooltip
                          label="出发时间">
                          <template slot-scope="scope">
                              {{ scope.row.departureTime.substring(0,10) }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="arrivalTime"
                          header-align="center"
                          align="center"
                          show-overflow-tooltip
                          label="到达时间">
                          <template slot-scope="scope">
                              {{ scope.row.arrivalTime.substring(0,10) }}
                          </template>
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
                          label="金额(元)">
                        </el-table-column>
                        <el-table-column
                          prop="taxRate"
                          header-align="center"
                          align="center"
                          show-overflow-tooltip
                          label="税率">
                        </el-table-column>
                        <el-table-column
                          prop=""
                          header-align="center"
                          align="center"
                          show-overflow-tooltip
                          label="">
                        </el-table-column>
                      </el-table>
                    </el-tab-pane>
                  </el-tabs>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报销金额(元)：">{{inputForm.reimbursementAmount}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单据总数：">{{inputForm.totalNumber}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="本次支付金额(元)：">{{inputForm.paymentAmount}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出差补助(元)：">{{inputForm.ccbz}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开户银行：">{{inputForm.bankOfDeposit}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="银行账号：">{{inputForm.bankNo}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出纳审批状态：">{{cnspyj.status}}</el-form-item>
                <el-form-item label="出纳审批意见：">{{cnspyj.message}}</el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item label="出纳审批状态：">{{cnspyj.status}}</el-form-item>
                <el-form-item label="出纳审批意见：">{{cnspyj.message}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出纳审批状态：">{{cnspyj.status}}</el-form-item>
                <el-form-item label="出纳审批意见：">{{cnspyj.message}}</el-form-item>
              </el-col> -->
              <!-- <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>出纳审批意见</span>
                </div>
                <div class="text item">
                  <el-col :span="8">
                    <el-form-item label="审批状态:" prop="paymentAmount">
                      {{cnspyj.status}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="意见:" prop="paymentAmount">
                      
                    </el-form-item>
                  </el-col>
                </div>
              </el-card> -->

              <!-- <el-col :span="8">
                <el-form-item label="出差类型：">
                  {{ $dictUtils.getDictLabel("travel_type", inputForm.travelType, '-') }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="支付方式：">
                  {{ $dictUtils.getDictLabel("payment_type", inputForm.paymentType, '-') }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="住宿费：">{{inputForm.travelAllowance}}(元)</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="借款金额：">{{inputForm.loanAmount}}(元)</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="冲抵借款金额：">{{inputForm.offsetLoanAmount}}(元)</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="支付日期：">{{inputForm.paymentDate.substring(0,10)}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实际出差天数：">{{inputForm.actualTravelDays}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实际住宿天数：">{{inputForm.actualStayDays}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="银行账户：">{{inputForm.bankAccount}}</el-form-item>
              </el-col> -->
            </el-row>
          </div>
        
      
    </el-row>
        
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" v-print="printObj" v-noMoreClick >打印</el-button>
      </span>
    </div>
    </el-form>
  <BgxtFkglBizReimbursementDailyProcurementDetailForm ref="bgxtFkglBizReimbursementDailyProcurementDetailForm" @addRow="saveBgxtFkglBizReimbursementDailyProcurementDetailRow(arguments)"></BgxtFkglBizReimbursementDailyProcurementDetailForm>
  <BgxtFkglBizReimbursementTravlDetailForm ref="bgxtFkglBizReimbursementTravlDetailForm" @addRow="saveBgxtFkglBizReimbursementTravlDetailRow(arguments)"></BgxtFkglBizReimbursementTravlDetailForm>

  </el-dialog>
</div>
</template>

<script>
  import BgxtFkglBizReimbursementDailyProcurementDetailForm from './BgxtFkglBizReimbursementDailyProcurementDetailForm'
  import BgxtFkglBizReimbursementTravlDetailForm from './BgxtFkglBizReimbursementTravlDetailForm'
  import GridSelect from '@/components/gridSelect'
  import Print from 'vue-print-nb'
  export default {
    data () {
      return {
        printObj: {
          id: 'printMe',    // 这里是要打印元素的ID
          popTitle: '打印',
          extraCss: '',
          extraHead: ''
        },
        title: '',
        method: '',
        visible: false,
        loading: false,
        bgxtFkglBizReimbursementInfoTab: '0',
        filePathArra: [],
        procInsId: '',
        historicTaskList: [],
        cnspyj:{},
        inputForm: {
          id: '',
          bgxtFkglBizReimbursementDailyProcurementDetailList: [],
          bgxtFkglBizReimbursementTravlDetailList: [],
          ccbz: '',
          applicant: '',
          department: '',
          affiliatedUnit: '',
          reimbursementDate: '',
          travelType: '',
          projectId: '',
          paymentAmount: '',
          paymentType: '',
          paymentDate: '',
          actualTravelDays: '',
          actualStayDays: '',
          travelAllowance: '',
          reimbursementAmount: '',
          totalNumber: '',
          loanAmount: '',
          offsetLoanAmount: '',
          bankAccount: '',
          bankOfDeposit: '',
          bankNo: '',
          filePath: '',
          paymentContent: '',
          procInsId: '',
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
      BgxtFkglBizReimbursementDailyProcurementDetailForm,
      BgxtFkglBizReimbursementTravlDetailForm,
      GridSelect,
      Print
    },
    watch: {
      'businessId': {
        handler (newVal) {
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
            this.inputForm.affiliatedUnit = data.user.company.name
            this.getAccount(data.user.id)
          }
        })
      },
      getAccount (id) {
        this.$http({
          url: '/fkgl/account/bgxtFkglBizAccount/list',
          method: 'get',
          params: {
            'status': '0'
          }
        }).then(({data}) => {
          if (data.success) {
            this.inputForm.bankAccount = data.page.list[0].bankAccountName
            this.inputForm.bankOfDeposit = data.page.list[0].bankName
            this.inputForm.bankNo = data.page.list[0].bankNo
          }
        })
      },
      init (id) {
        this.filePathArra = []
        if (id) {
          this.visible = true
          this.bgxtFkglBizReimbursementInfoTab = '0'
          this.inputForm.bgxtFkglBizReimbursementDailyProcurementDetailList = []
          this.inputForm.bgxtFkglBizReimbursementTravlDetailList = []
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/fkgl/reimbursementinfo/bgxtFkglBizReimbursementInfo/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtFkglBizReimbursementInfo)
              this.inputForm.filePath.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.filePathArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              })
              
              this.$http.get(`/flowable/task/historicTaskList?procInsId=${this.inputForm.procInsId}`).then(({data}) => {
                let historicTaskList = data.historicTaskList
                console.log(historicTaskList);
                for(var i=0;i<historicTaskList.length;i++){
                  var yjPar = historicTaskList[i];
                  var assigneeName = yjPar.assigneeName;//出纳
                  var status = '';//状态
                  var message = '';//内容
                  var durationTime = yjPar.durationTime;//时间
                  if(assigneeName == '出纳'){
                    status = yjPar.comment.status;
                    message = yjPar.comment.message;
                    this.cnspyj = {assigneeName: assigneeName,status: status,message: message,durationTime: durationTime}
                    break;
                  }
                }
                console.log('this.cnspyj-->',this.cnspyj);
              })

              this.loading = false
            })
          })
          this.$nextTick(() => {
            console.log('this.inputForm.procInsId--->',this.inputForm.procInsId);
              
          })
        }
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
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.inputForm.affiliatedType = '1'
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
<style lang='scss'>
.el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #00FA9A !important;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
  .el-tabs el-tabs--top{
    margin-top: -60px !important;
  }
</style>