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
              <el-input v-model="inputForm.handlingDepartment" placeholder="请填写经办部门" disabled    ></el-input>
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
            <el-form-item label="本次收票金额" prop="collectInvoiceMoney"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'},
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.collectInvoiceMoney" placeholder="请填写本次收票金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="发票类型" prop="invoiceType"
                :rules="[
                 ]">
                    <el-radio-group v-model="inputForm.invoiceType">
                        <el-radio v-for="item in $dictUtils.getDictList('invoiceType')" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开票内容" prop="invoiceContent"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.invoiceContent" placeholder="请填写开票内容"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注" prop="invoiceExplan"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.invoiceExplan" placeholder="请填写备注"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="发票附件（附件）" prop="invoiceFile"
                :rules="[
                 ]">
              <el-upload ref="invoiceFile"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fkgl/collenctinvoice/bgxtFkglBizCollectInvoice`"
                    :headers="{token: $cookie.get('token')}"
                    :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                    :on-success="(response, file, fileList) => {
                       inputForm.invoiceFile = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                    :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.invoiceFile = fileList.map(item => item.url).join('|')
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    multiple
                    :limit="5"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="invoiceFileArra">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">添加相关附件</div>
                  </el-upload>
           </el-form-item>
        </el-col>
    <el-col :span="24">
     <el-form-item label-width="0">
            <el-tabs v-model="bgxtFkglBizCollectInvoiceTab">
            <el-tab-pane label="办公系统费控管理收票记录发票信息">
                  <el-button size="small" @click="addBgxtFkglBizCollectInvoiceContentRow" type="primary">新增</el-button>
                  <el-table
                  size="small"
                  class="table"
                  :data="inputForm.bgxtFkglBizCollectInvoiceContentList.filter(function(item){ return item.delFlag !== '1'})"
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
                      <el-button @click="viewBgxtFkglBizCollectInvoiceContentRow(scope.row)" type="text" size="small">查看</el-button>
                      <el-button  @click="editBgxtFkglBizCollectInvoiceContentRow(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button  @click="delBgxtFkglBizCollectInvoiceContentRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
           </el-form-item>
          </el-col>
        </el-row>
    </el-form>
  <BgxtFkglBizCollectInvoiceContentForm ref="bgxtFkglBizCollectInvoiceContentForm" @addRow="saveBgxtFkglBizCollectInvoiceContentRow(arguments)"></BgxtFkglBizCollectInvoiceContentForm>
</div>
</template>

<script>
  import BgxtFkglBizCollectInvoiceContentForm from './BgxtFkglBizCollectInvoiceContentForm'
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        bgxtFkglBizCollectInvoiceTab: '0',
        invoiceFileArra: [],
        inputForm: {
          id: '',
          bgxtFkglBizCollectInvoiceContentList: [],
          handler: '',
          handlingDepartment: '',
          handlingDate: '',
          contractName: '',
          contractNo: '',
          collectInvoiceMoney: '',
          invoiceType: '',
          invoiceContent: '',
          invoiceExplan: '',
          invoiceFile: ''
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
      BgxtFkglBizCollectInvoiceContentForm
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
        this.invoiceFileArra = []
        if (id) {
          this.bgxtFkglBizCollectInvoiceTab = '0'
          this.inputForm.bgxtFkglBizCollectInvoiceContentList = []
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/fkgl/collenctinvoice/bgxtFkglBizCollectInvoice/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtFkglBizCollectInvoice)
              this.inputForm.invoiceFile.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.invoiceFileArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              })
              this.loading = false
            })
          })
        }
      },
      saveBgxtFkglBizCollectInvoiceContentRow (child) {
        if (child[0] === '') {
          this.inputForm.bgxtFkglBizCollectInvoiceContentList.push(child[1])
        } else {
          this.inputForm.bgxtFkglBizCollectInvoiceContentList.forEach((item, index) => {
            if (item === child[0]) {
              this.inputForm.bgxtFkglBizCollectInvoiceContentList.splice(index, 1, child[1])
            }
          })
        }
      },
      addBgxtFkglBizCollectInvoiceContentRow (child) {
        this.$refs.bgxtFkglBizCollectInvoiceContentForm.init('add')
      },
      viewBgxtFkglBizCollectInvoiceContentRow (child) {
        this.$refs.bgxtFkglBizCollectInvoiceContentForm.init('view', child)
      },
      editBgxtFkglBizCollectInvoiceContentRow (child) {
        this.$refs.bgxtFkglBizCollectInvoiceContentForm.init('edit', child)
      },
      delBgxtFkglBizCollectInvoiceContentRow (child) {
        this.inputForm.bgxtFkglBizCollectInvoiceContentList.forEach((item, index) => {
          if (item === child && item.id === '') {
            this.inputForm.bgxtFkglBizCollectInvoiceContentList.splice(index, 1)
          } else if (item === child) {
            item.delFlag = '1'
            this.inputForm.bgxtFkglBizCollectInvoiceContentList.splice(index, 1, item)
          }
        })
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/fkgl/collenctinvoice/bgxtFkglBizCollectInvoice/save`,
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