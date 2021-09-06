<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="24">
            <el-form-item label="出差补助(元)（差旅费）" prop="ccbz"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.ccbz" placeholder="请填写出差补助(元)（差旅费）"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="申请人" prop="applicant"
                :rules="[
                 ]">
              <el-input v-model="inputForm.applicant" placeholder="请填写申请人"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="所属部门" prop="department"
                :rules="[
                 ]">
              <el-input v-model="inputForm.department" placeholder="请填写所属部门"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="所属单位" prop="affiliatedUnit"
                :rules="[
                 ]">
              <el-input v-model="inputForm.affiliatedUnit" placeholder="请填写所属单位"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
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
        <el-col :span="24">
            <el-form-item label="出差类型(差旅费)" prop="travelType"
                :rules="[
                 ]">
                <el-select v-model="inputForm.travelType" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('travel_type')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="关联项目" prop="projectId"
                :rules="[
                  {required: true, message:'关联项目不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.projectId" placeholder="请填写关联项目"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="本次支付金额(元)" prop="paymentAmount"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.paymentAmount" placeholder="请填写本次支付金额(元)"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="支付方式" prop="paymentType"
                :rules="[
                 ]">
                <el-select v-model="inputForm.paymentType" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('payment_type')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="24">
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
            <el-form-item label="实际出差天数(差旅费)" prop="actualTravelDays"
                :rules="[
                  {validator: validator.isIntGteZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.actualTravelDays" placeholder="请填写实际出差天数(差旅费)"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="差旅费)实际住宿天数(差旅费)" prop="actualStayDays"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.actualStayDays" placeholder="请填写差旅费)实际住宿天数(差旅费)"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="住宿费(元)(差旅费)" prop="travelAllowance"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.travelAllowance" placeholder="请填写住宿费(元)(差旅费)"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="报销金额(元)" prop="reimbursementAmount"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.reimbursementAmount" placeholder="请填写报销金额(元)"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="单据总数" prop="totalNumber"
                :rules="[
                 ]">
              <el-input v-model="inputForm.totalNumber" placeholder="请填写单据总数"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="借款金额(元)" prop="loanAmount"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.loanAmount" placeholder="请填写借款金额(元)"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="冲抵借款金额(元)" prop="offsetLoanAmount"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.offsetLoanAmount" placeholder="请填写冲抵借款金额(元)"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="银行账户" prop="bankAccount"
                :rules="[
                 ]">
              <el-input v-model="inputForm.bankAccount" placeholder="请填写银行账户"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="开户银行" prop="bankOfDeposit"
                :rules="[
                 ]">
              <el-input v-model="inputForm.bankOfDeposit" placeholder="请填写开户银行"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="银行账号" prop="bankNo"
                :rules="[
                 ]">
              <el-input v-model="inputForm.bankNo" placeholder="请填写银行账号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="filePath"
                :rules="[
                 ]">
              <el-upload ref="filePath"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fkgl/reimbursementinfo/bgxtFkglBizReimbursementInfo`"
                    :headers="{token: $cookie.get('token')}"
                    :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                    :on-success="(response, file, fileList) => {
                       inputForm.filePath = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                    :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.filePath = fileList.map(item => item.url).join('|')
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    multiple
                    :limit="5"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="filePathArra">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">添加相关附件</div>
                  </el-upload>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="报销说明(日常采购)" prop="paymentContent"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.paymentContent" placeholder="请填写报销说明(日常采购)"     ></el-input>
           </el-form-item>
        </el-col>
    <el-col :span="24">
     <el-form-item label-width="0">
            <el-tabs v-model="bgxtFkglBizReimbursementInfoTab">
            <el-tab-pane label="办公系统费控管理报销-日常及采购报销内容">
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
                    <template slot-scope="scope">
                        {{ $dictUtils.getDictLabel("fkgl_fylb", scope.row.costType, '-') }}
                    </template>
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
            <el-tab-pane label="办公系统费控管理报销-差旅费明细">
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
            </el-tabs>
           </el-form-item>
          </el-col>
        </el-row>
    </el-form>
  <BgxtFkglBizReimbursementDailyProcurementDetailForm ref="bgxtFkglBizReimbursementDailyProcurementDetailForm" @addRow="saveBgxtFkglBizReimbursementDailyProcurementDetailRow(arguments)"></BgxtFkglBizReimbursementDailyProcurementDetailForm>
  <BgxtFkglBizReimbursementTravlDetailForm ref="bgxtFkglBizReimbursementTravlDetailForm" @addRow="saveBgxtFkglBizReimbursementTravlDetailRow(arguments)"></BgxtFkglBizReimbursementTravlDetailForm>
</div>
</template>

<script>
  import BgxtFkglBizReimbursementDailyProcurementDetailForm from './BgxtFkglBizReimbursementDailyProcurementDetailForm'
  import BgxtFkglBizReimbursementTravlDetailForm from './BgxtFkglBizReimbursementTravlDetailForm'
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        bgxtFkglBizReimbursementInfoTab: '0',
        filePathArra: [],
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
          paymentContent: ''
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
      BgxtFkglBizReimbursementTravlDetailForm
    },
    watch: {
      'businessId': {
        handler (newVal) {
          if (this.businessId) {
            this.init(this.businessId)
          } else {
            this.$nextTick(() => {
              this.$refs.inputForm.resetFields()
            })
          }
        },
        immediate: true,
        deep: false
      }
    },
    methods: {
      init (id) {
        this.filePathArra = []
        if (id) {
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
              this.loading = false
            })
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