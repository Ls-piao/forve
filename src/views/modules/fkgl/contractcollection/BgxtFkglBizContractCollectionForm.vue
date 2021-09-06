<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="经办人" prop="handler"
                :rules="[
                 ]">
              <el-input v-model="inputForm.handler" placeholder="请填写经办人"   disabled  ></el-input>
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
            <el-form-item label="款项内容" prop="paymentContent"
                :rules="[
                 ]">
              <el-input v-model="inputForm.paymentContent" placeholder="请填写款项内容"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="应收日期" prop="dueDate"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.dueDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="本次应收金额" prop="dueMoney"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dueMoney" placeholder="请填写本次应收金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="收款说明" prop="collectionDescription"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.collectionDescription" placeholder="请填写收款说明"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="相关文档（附件）" prop="relatedDocument"
                :rules="[
                 ]">
              <el-upload ref="relatedDocument"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fkgl/contractcollection/bgxtFkglBizContractCollection`"
                    :headers="{token: $cookie.get('token')}"
                    :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                    :on-success="(response, file, fileList) => {
                       inputForm.relatedDocument = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                    :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.relatedDocument = fileList.map(item => item.url).join('|')
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    multiple
                    :limit="5"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="relatedDocumentArra">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">添加相关附件</div>
                  </el-upload>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="实收金额" prop="confrimDueMoney"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.confrimDueMoney" placeholder="请填写实收金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="实收日期" prop="confrimDueDate"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.confrimDueDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="收款方式" prop="collectionType"
                :rules="[
                 ]">
              <el-input v-model="inputForm.collectionType" placeholder="请填写收款方式"     ></el-input>
           </el-form-item>
        </el-col>
        </el-row>
    </el-form>
</div>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        relatedDocumentArra: [],
        inputForm: {
          id: '',
          procInsId: '',
          handler: '',
          handlingDepartment: '',
          handlingDate: '',
          contractName: '',
          contractNo: '',
          paymentContent: '',
          dueDate: '',
          dueMoney: '',
          collectionDescription: '',
          relatedDocument: '',
          confrimDueMoney: '',
          confrimDueDate: '',
          collectionType: ''
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
        this.relatedDocumentArra = []
        if (id) {
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/fkgl/contractcollection/bgxtFkglBizContractCollection/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtFkglBizContractCollection)
              this.inputForm.relatedDocument.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.relatedDocumentArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              })
              this.loading = false
            })
          })
        }
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/fkgl/contractcollection/bgxtFkglBizContractCollection/save`,
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