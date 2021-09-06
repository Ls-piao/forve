<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="文档名称" prop="wdMc"
                :rules="[
                 {required: true, message:'文档名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.wdMc" placeholder="请填写文档名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="文档编写人" prop="wdbxr"
                :rules="[
                {required: true, message:'文档编写人不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.wdbxr" placeholder="请填写文档编写人"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="文档说明" prop="wdsm"
                :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.wdsm" placeholder="请填写文档说明"     ></el-input>
           </el-form-item>
        </el-col>
       <el-col :span="24">
            <el-form-item label="文档" prop="fileUrl"
                :rules="[{required: true, message:'文档不能为空', trigger:'blur'}]">
            <el-upload ref="fileUrl"
                        v-if="visible"
                        :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/xmwd`"
                        :headers="{token: $cookie.get('token')}"
                        :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                        :on-success="(response, file, fileList) => {
                           inputForm.fileUrl = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                           inputForm.fileName = fileList.map(item => item.name).join('|')
                        }"
                        :on-remove="(file, fileList) => {
                        $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                           $message.success(data.msg)
                        })
                        inputForm.fileUrl = fileList.map(item => item.url).join('|')
                        inputForm.fileName = fileList.map(item => item.name).join('|')
                        }"
                        :before-remove="(file, fileList) => {
                          return $confirm(`确定移除 ${file.name}？`)
                        }"
                        multiple
                        :limit="1"
                        :on-exceed="(files, fileList) =>{
                          $message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                        }"
                        :file-list="fileUrlArra">
               <el-button size="small" type="primary">点击上传</el-button>
               <div slot="tip" class="el-upload__tip">添加相关附件</div>
            </el-upload>
            </el-form-item>
         </el-col>
        </el-row>
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
        title: '',
        method: '',
        visible: false,
        loading: false,
        fileUrlArra: [],
        inputForm: {
          id: '',
          xmId: {
            id: '',
            xmmc: ''
          },
          wdsm: '',
          wdbxr: '',
          fileUrl: '',
          fileName: '',
          wdMc: '',
          scr: {
            id: '',
            name: ''
          },
          scsj: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建项目文档`
        } else if (method === 'edit') {
          this.title = '修改项目文档'
        } else if (method === 'view') {
          this.title = '查看项目文档'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xmgl/xmwdxx/wdxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.wdxx)
              this.fileUrlArra.push({
                name: this.inputForm.fileName,
                url: this.inputForm.fileUrl
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
              url: `/xmgl/xmwdxx/wdxx/save`,
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