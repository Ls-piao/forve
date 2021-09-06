<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
        <el-col :span="24">
            <el-form-item label="意见" prop="opinion"
                          :rules="[{required: true, message:'意见不能为空', trigger:'blur'}
                 ]">
              <el-input type="textarea" v-model="inputForm.opinion" placeholder="请填写意见" :disabled="method === 'edit'"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="备注信息" prop="remarks"
                :rules="[{required: true, message:'备注不能为空', trigger:'blur'}]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息" :disabled="method === 'edit'"></el-input>
           </el-form-item>
        </el-col>
      <el-col :span="24" v-if="method != 'add'">
        <el-form-item label="反馈信息" prop="replyMessage"
                      :rules="[{required: true, message:'反馈信息不能为空', trigger:'blur'}]">
          <el-input type="textarea" v-model="inputForm.replyMessage" placeholder="请填写反馈信息"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件" prop="fileUrl"
                      :rules="[
                 ]">
          <el-upload ref="fileUrl"
                     v-if="visible"
                     :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/sontask/sonTask`"
                     :headers="{token: $cookie.get('token')}"
                     :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                     :on-success="(response, file, fileList) => {
                       inputForm.fileUrl = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                     :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.fileUrl = fileList.map(item => item.url).join('|')
                    }"
                     :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                     multiple
                     :limit="5"
                     :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                     :file-list="fileUrlArra">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">添加相关附件</div>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  export default {
    data () {
      return {
        fileUrlArra: [],
        roleType: '',
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          mainTaskId: '',
          roleType: '',
          opinion: '',
          remarks: '',
          isReply: '',
          replyMessage: '',
          fileUrl: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id, role, mainTaskId) {
        this.fileUrlArra = []
        this.inputForm.mainTaskId = mainTaskId
        this.roleType = role
        this.inputForm.roleType = role
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建意见`
        } else if (method === 'edit') {
          this.title = '反馈意见'
        } else if (method === 'view') {
          this.title = '查看意见'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/opinion/opinion/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.opinion)
              // 从表单获取文件
              this.inputForm.fileUrl.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  // 回显文件数组
                  this.fileUrlArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
                }
              })
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/opinion/opinion/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.$emit('refreshDataList')
              }
            })
          }
        })
      }
    }
  }
</script>
