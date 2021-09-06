<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="经办人" prop="handler"
                :rules="[
                 ]">
              <el-input v-model="inputForm.handler" placeholder="请填写经办人"  disabled   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="经办部门" prop="handlingDepartment"
                :rules="[
                 ]">
              <el-input v-model="inputForm.handlingDepartment" placeholder="请填写经办部门"  disabled   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="经办日期" prop="handlingDate"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.handlingDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="合同名称" prop="contractName"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.contractName" placeholder="请填写合同名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="合同编号" prop="contractNo"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.contractNo" placeholder="请填写合同编号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开票单位" prop="issuingOffice"
                :rules="[
                 ]">
              <el-input v-model="inputForm.issuingOffice" placeholder="请填写开票单位"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="纳税人识别号" prop="taxpayerNo"
                :rules="[
                 ]">
              <el-input v-model="inputForm.taxpayerNo" placeholder="请填写纳税人识别号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开户银行" prop="bankOfDeposit"
                :rules="[
                 ]">
              <el-input v-model="inputForm.bankOfDeposit" placeholder="请填写开户银行"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="银行账号" prop="bankNo"
                :rules="[
                 ]">
              <el-input v-model="inputForm.bankNo" placeholder="请填写银行账号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注" prop="bankContent"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.bankContent" placeholder="请填写备注"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="申请开票金额" prop="invoicingMoney"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.invoicingMoney" placeholder="请填写申请开票金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="发票类型" prop="invoicingType"
                :rules="[
                 ]">
                    <el-radio-group v-model="inputForm.invoicingType">
                        <el-radio v-for="item in $dictUtils.getDictList('invoiceType')" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开票内容" prop="invoicingContent"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.invoicingContent" placeholder="请填写开票内容"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="申请说明" prop="invoicingExplan"
                :rules="[
                 ]">
              <el-input v-model="inputForm.invoicingExplan" placeholder="请填写申请说明"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="实际开票金额" prop="actualInvoicingMoney"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.actualInvoicingMoney" placeholder="请填写实际开票金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开票日期" prop="actualInvoicingDate"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.actualInvoicingDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="2124">
            <el-form-item label="备注" prop="actualInvoicingContent"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.actualInvoicingContent" placeholder="请填写备注"     ></el-input>
           </el-form-item>
        </el-col>
    <el-col :span="24">
     <el-form-item label-width="0">
            <el-tabs v-model="bgxtFkglBizInvoicingTab">
            <el-tab-pane label="办公系统费控管理开票申请发票信息">
                  <el-button size="small" @click="addBgxtFkglBizInvoicingContentRow" type="primary">新增</el-button>
                  <el-table
                  size="small"
                  class="table"
                  :data="inputForm.bgxtFkglBizInvoicingContentList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                <el-table-column
                    prop="invoiceNo"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="发票号码">
                  </el-table-column>
                <el-table-column
                    prop="invoiceMoney"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="发票金额">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                      <el-button @click="viewBgxtFkglBizInvoicingContentRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editBgxtFkglBizInvoicingContentRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtFkglBizInvoicingContentRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
           </el-form-item>
          </el-col>
        </el-row>
    </el-form>
  <BgxtFkglBizInvoicingContentForm ref="bgxtFkglBizInvoicingContentForm" @addRow="saveBgxtFkglBizInvoicingContentRow(arguments)"></BgxtFkglBizInvoicingContentForm>
</div>
</template>

<script>
  import BgxtFkglBizInvoicingContentForm from './BgxtFkglBizInvoicingContentForm'
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        bgxtFkglBizInvoicingTab: '0',
        inputForm: {
          id: '',
          bgxtFkglBizInvoicingContentList: [],
          handler: '',
          handlingDepartment: '',
          handlingDate: '',
          contractName: '',
          contractNo: '',
          issuingOffice: '',
          taxpayerNo: '',
          bankOfDeposit: '',
          bankNo: '',
          bankContent: '',
          invoicingMoney: '',
          invoicingType: '',
          invoicingContent: '',
          invoicingExplan: '',
          actualInvoicingMoney: '',
          actualInvoicingDate: '',
          actualInvoicingContent: ''
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
      BgxtFkglBizInvoicingContentForm
    },
    watch: {
      'businessId': {
        handler (newVal) {
          if (this.businessId) {
            this.init(this.businessId)
          } else {
            this.$nextTick(() => {
              this.$refs.inputForm.resetFields()
              this.showInfo()
            })
          }
        },
        immediate: true,
        deep: false
      }
    },
    methods: {
      showInfo () {
        this.$http({
          url: '/sys/user/info',
          method: 'get'
        }).then(({data}) => {
          if (data.success) {
            this.inputForm.handler = data.user.name
            this.inputForm.handlingDepartment = data.user.office.name
          }
        })
      },
      init (id) {
        if (id) {
          this.bgxtFkglBizInvoicingTab = '0'
          this.inputForm.bgxtFkglBizInvoicingContentList = []
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/fkgl/invoicing/bgxtFkglBizInvoicing/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtFkglBizInvoicing)
              this.loading = false
            })
          })
        }
      },
      saveBgxtFkglBizInvoicingContentRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtFkglBizInvoicingContentList.push(child[1])
        } else {
          this.inputForm.bgxtFkglBizInvoicingContentList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtFkglBizInvoicingContentList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtFkglBizInvoicingContentRow (child) {
        this.$refs.bgxtFkglBizInvoicingContentForm.init('add')
      },
      viewBgxtFkglBizInvoicingContentRow (child) {
        this.$refs.bgxtFkglBizInvoicingContentForm.init('view', child)
      },
      editBgxtFkglBizInvoicingContentRow (child) {
        this.$refs.bgxtFkglBizInvoicingContentForm.init('edit', child)
      },
      delBgxtFkglBizInvoicingContentRow (child) {
        this.inputForm.bgxtFkglBizInvoicingContentList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtFkglBizInvoicingContentList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtFkglBizInvoicingContentList.splice(index, 1, item)
          }
        })
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/fkgl/invoicing/bgxtFkglBizInvoicing/save`,
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