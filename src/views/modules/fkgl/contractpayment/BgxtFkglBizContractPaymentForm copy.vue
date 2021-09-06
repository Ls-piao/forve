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
            <el-form-item label="合同名称" prop="contractName"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'}
                 ]">
                  <GridSelect
                    title="选择所属洲"
                    labelName = 'name'
                    labelValue = 'id'
                    :value = "inputForm.continent.id"
                    :limit="1"
                    @getValue='(value) => {inputForm.continent.id=value}'
                    :columns="[
                    {
                      prop: 'name',
                      label: '洲名'
                    },
                    {
                      prop: 'remarks',
                      label: '备注'
                    }
                    ]"
                    :searchs="[
                    {
                      prop: 'name',
                      label: '洲名'
                    },
                    {
                      prop: 'remarks',
                      label: '备注'
                    }
                    ]"
                    dataListUrl="/test/grid/testContinent/list"
                    entityBeanName="testContinent"
                    queryEntityUrl="/test/grid/testContinent/queryById">
                  </GridSelect>
              <el-input v-model="inputForm.contractName" placeholder="请填写合同名称"  ></el-input>
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
            <el-form-item label="经办部门" prop="handlingDepartment"
                :rules="[
                 ]">
              <el-input v-model="inputForm.handlingDepartment" placeholder="请填写经办部门"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="收款单位" prop="payyee"
                :rules="[
                 ]">
              <el-input v-model="inputForm.payyee" placeholder="请填写收款单位"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="联系人" prop="contacts"
                :rules="[
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
            <el-form-item label="开户银行" prop="bankName"
                :rules="[
                 ]">
              <el-input v-model="inputForm.bankName" placeholder="请填写开户银行"     ></el-input>
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
            <el-form-item label="应付金额" prop="copeWithMoney"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.copeWithMoney" placeholder="请填写应付金额"     ></el-input>
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
        <el-col :span="24">
            <el-form-item label="相关附件" prop="filePath"
                :rules="[
                 ]">
              <el-upload ref="filePath"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fkgl/contractpayment/bgxtFkglBizContractPayment`"
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
     <el-form-item label-width="0">
            <el-tabs v-model="bgxtFkglBizContractPaymentTab">
            <el-tab-pane label="办公系统费控管理合同付款明细列表">
                  <el-button size="small" @click="addBgxtFkglBizContractPaymentContentRow" type="primary">新增</el-button>
                  <el-table
                  size="small"
                  class="table"
                  :data="inputForm.bgxtFkglBizContractPaymentContentList.filter(function(item){ return item.delFlag !== '1'})"
                  style="width: 100%">
                <el-table-column
                    prop="payment"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="付款款项">
                  </el-table-column>
                <el-table-column
                    prop="termOfPayment"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="付款条件">
                  </el-table-column>
                <el-table-column
                    prop="fyzr"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="违约责任">
                  </el-table-column>
                <el-table-column
                    prop="copeWithDate"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="应付日期">
                  </el-table-column>
                <el-table-column
                    prop="copeWithMoney"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="应付金额">
                  </el-table-column>
                <el-table-column
                    prop="yseNo"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="是否已收发票">
                  </el-table-column>
                <el-table-column
                    prop="invoiceDate"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="开票日期">
                  </el-table-column>
                <el-table-column
                    prop="invoiceNo"
                    header-align="center"
                    align="center"
                    show-overflow-tooltip
                    label="发票号码">
                  </el-table-column>
                <el-table-column
                    prop="invoiceContent"
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
                      <el-button @click="viewBgxtFkglBizContractPaymentContentRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editBgxtFkglBizContractPaymentContentRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtFkglBizContractPaymentContentRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
           </el-form-item>
          </el-col>
        </el-row>
    </el-form>
  <BgxtFkglBizContractPaymentContentForm ref="bgxtFkglBizContractPaymentContentForm" @addRow="saveBgxtFkglBizContractPaymentContentRow(arguments)"></BgxtFkglBizContractPaymentContentForm>
</div>
</template>

<script>
  import GridSelect from '@/components/gridSelect'
  import BgxtFkglBizContractPaymentContentForm from './BgxtFkglBizContractPaymentContentForm'
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        bgxtFkglBizContractPaymentTab: '0',
        filePathArra: [],
        inputForm: {
          id: '',
          bgxtFkglBizContractPaymentContentList: [],
          handler: '',
          contractName: '',
          contractNo: '',
          handlingDate: '',
          handlingDepartment: '',
          status: '',
          payyee: '',
          contacts: '',
          contactsTel: '',
          bankName: '',
          bankNo: '',
          copeWithMoney: '',
          copeWithDate: '',
          filePath: ''
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
      BgxtFkglBizContractPaymentContentForm,
      GridSelect
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
            this.inputForm.contractName = data.user.office.name
          }
        })
      },
      init (id) {
        this.filePathArra = []
        if (id) {
          this.bgxtFkglBizContractPaymentTab = '0'
          this.inputForm.bgxtFkglBizContractPaymentContentList = []
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/fkgl/contractpayment/bgxtFkglBizContractPayment/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtFkglBizContractPayment)
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
      saveBgxtFkglBizContractPaymentContentRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtFkglBizContractPaymentContentList.push(child[1])
        } else {
          this.inputForm.bgxtFkglBizContractPaymentContentList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtFkglBizContractPaymentContentList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtFkglBizContractPaymentContentRow (child) {
        this.$refs.bgxtFkglBizContractPaymentContentForm.init('add')
      },
      viewBgxtFkglBizContractPaymentContentRow (child) {
        this.$refs.bgxtFkglBizContractPaymentContentForm.init('view', child)
      },
      editBgxtFkglBizContractPaymentContentRow (child) {
        this.$refs.bgxtFkglBizContractPaymentContentForm.init('edit', child)
      },
      delBgxtFkglBizContractPaymentContentRow (child) {
        this.inputForm.bgxtFkglBizContractPaymentContentList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtFkglBizContractPaymentContentList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtFkglBizContractPaymentContentList.splice(index, 1, item)
          }
        })
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/fkgl/contractpayment/bgxtFkglBizContractPayment/save`,
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