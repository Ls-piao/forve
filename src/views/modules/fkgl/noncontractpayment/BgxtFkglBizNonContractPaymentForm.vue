<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="经办人handler" prop="handler"
                :rules="[
                 ]">
              <el-input v-model="inputForm.handler" placeholder="请填写经办人"  disabled   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="经办部门" prop="handlingDepartment"
                :rules="[
                 ]">
              <el-input v-model="inputForm.handlingDepartment" placeholder="请填写经办部门" disabled    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="经办日期" prop="handlingDate"
                :rules="[
                 ]">
              <el-input v-model="inputForm.handlingDate" placeholder="请填写经办日期"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="收款单位" prop="payee"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.payee" placeholder="请填写收款单位"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="联系人" prop="contacts"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.contacts" placeholder="请填写联系人"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="联系电话" prop="contactsTel"
                :rules="[
                  {validator: validator.isMobile, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.contactsTel" placeholder="请填写联系电话"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="本次应付" prop="copeWithMoney"
                :rules="[
                 ]">
              <el-input v-model="inputForm.copeWithMoney" placeholder="请填写本次应付"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="应付日期" prop="copeWithDate"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.copeWithDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="发票情况" prop="invoiceType"
                :rules="[
                 ]">
                    <el-radio-group v-model="inputForm.invoiceType">
                        <el-radio v-for="item in $dictUtils.getDictList('invoiceType')" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="收款银行" prop="collectionBank"
                :rules="[
                 ]">
              <el-input v-model="inputForm.collectionBank" placeholder="请填写收款银行"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="收款账号" prop="collectionNo"
                :rules="[
                 ]">
              <el-input v-model="inputForm.collectionNo" placeholder="请填写收款账号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="付款说明" prop="paymentContent"
                :rules="[
                 ]">
              <el-input v-model="inputForm.paymentContent" placeholder="请填写付款说明"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="相关文档（附件）" prop="filePath"
                :rules="[
                 ]">
              <el-upload ref="filePath"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fkgl/noncontractpayment/bgxtFkglBizNonContractPayment`"
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
        <el-col :span="12">
            <el-form-item label="实际付款" prop="actualPayment"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.actualPayment" placeholder="请填写实际付款"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="扣款金额" prop="deductionAmount"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.deductionAmount" placeholder="请填写扣款金额"     ></el-input>
           </el-form-item>
        </el-col>
    <el-col :span="24">
     <el-form-item label-width="0">
            <el-tabs v-model="bgxtFkglBizNonContractPaymentTab">
            <el-tab-pane label="办公系统费控管理非合同付款记录列表">
                  <el-button size="small" @click="addBgxtFkglBizNonContractPaymentContentRow" type="primary">新增</el-button>
                  <el-table
                  size="small"
                  class="table"
                  :data="inputForm.bgxtFkglBizNonContractPaymentContentList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                <el-table-column
                    prop="paymentDate"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="付款日期">
                  </el-table-column>
                <el-table-column
                    prop="paymentMoney"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="付款金额">
                  </el-table-column>
                <el-table-column
                    prop="paymentType"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="付款方式">
                  </el-table-column>
                <el-table-column
                    prop="content"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="说明">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                      <el-button @click="viewBgxtFkglBizNonContractPaymentContentRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editBgxtFkglBizNonContractPaymentContentRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtFkglBizNonContractPaymentContentRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
           </el-form-item>
          </el-col>
        </el-row>
    </el-form>
  <BgxtFkglBizNonContractPaymentContentForm ref="bgxtFkglBizNonContractPaymentContentForm" @addRow="saveBgxtFkglBizNonContractPaymentContentRow(arguments)"></BgxtFkglBizNonContractPaymentContentForm>
</div>
</template>

<script>
  import BgxtFkglBizNonContractPaymentContentForm from './BgxtFkglBizNonContractPaymentContentForm'
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        bgxtFkglBizNonContractPaymentTab: '0',
        filePathArra: [],
        inputForm: {
          id: '',
          bgxtFkglBizNonContractPaymentContentList: [],
          handler: '',
          handlingDepartment: '',
          handlingDate: '',
          status: '',
          payee: '',
          contacts: '',
          contactsTel: '',
          copeWithMoney: '',
          copeWithDate: '',
          invoiceType: '',
          collectionBank: '',
          collectionNo: '',
          paymentContent: '',
          filePath: '',
          actualPayment: '',
          deductionAmount: ''
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
      BgxtFkglBizNonContractPaymentContentForm
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
            this.inputForm.handler = data.user.name
            this.inputForm.handlingDepartment = data.user.office.name
          }
        })
      },
      init (id) {
        this.filePathArra = []
        if (id) {
          this.bgxtFkglBizNonContractPaymentTab = '0'
          this.inputForm.bgxtFkglBizNonContractPaymentContentList = []
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/fkgl/noncontractpayment/bgxtFkglBizNonContractPayment/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtFkglBizNonContractPayment)
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
      saveBgxtFkglBizNonContractPaymentContentRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtFkglBizNonContractPaymentContentList.push(child[1])
        } else {
          this.inputForm.bgxtFkglBizNonContractPaymentContentList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtFkglBizNonContractPaymentContentList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtFkglBizNonContractPaymentContentRow (child) {
        this.$refs.bgxtFkglBizNonContractPaymentContentForm.init('add')
      },
      viewBgxtFkglBizNonContractPaymentContentRow (child) {
        this.$refs.bgxtFkglBizNonContractPaymentContentForm.init('view', child)
      },
      editBgxtFkglBizNonContractPaymentContentRow (child) {
        this.$refs.bgxtFkglBizNonContractPaymentContentForm.init('edit', child)
      },
      delBgxtFkglBizNonContractPaymentContentRow (child) {
        this.inputForm.bgxtFkglBizNonContractPaymentContentList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtFkglBizNonContractPaymentContentList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtFkglBizNonContractPaymentContentList.splice(index, 1, item)
          }
        })
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/fkgl/noncontractpayment/bgxtFkglBizNonContractPayment/save`,
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