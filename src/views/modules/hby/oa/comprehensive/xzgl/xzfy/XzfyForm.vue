<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible"
    :append-to-body="true">
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col hidden :span="24">
            <el-form-item label="父级" prop="parent.id"
                :rules="[
                 ]">
                 <el-input v-model="inputForm.parent.id" placeholder="请填写发言信息"     ></el-input>
                 <el-input v-model="inputForm.xz.id" placeholder="请填写发言信息"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="发言信息" prop="name"
                :rules="[
                  {required: true, message:'发言信息不能为空', trigger:'blur'}
                 ]">
              <el-input type="textarea" v-model="inputForm.name" placeholder="请填写发言信息"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="附件" prop="fileUrl"
                          :rules="[]">
              <el-upload ref="fileUrl"
                         v-if="visible"
                         :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fileManage`"
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
          name: '',
          parent: {
            id: ''
          },
          xz: {
            id: ''
          },
          fileUrl: '',
          fileName: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, obj) {
        this.fileUrlArra = []
        this.method = method
        this.inputForm.id = obj.id
        if (method === 'add') {
          this.title = '新建协作发言'
        } else if (method === 'addChild') {
          this.title = '添加下级协作发言'
        } else if (method === 'edit') {
          this.title = '修改协作发言'
        } else if (method === 'view') {
          this.title = '查看协作发言'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.parent.id = obj.parent.id
          this.inputForm.xz.id = obj.parent.xzId
          this.inputForm.parent.name = obj.parent.name
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xzgl/xzfy/xzfy/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xzfy)
              var url = this.inputForm.fileUrl.split('|')
              var name = this.inputForm.fileName.split('|')
              if (url[0] !== '') {
                for (var i = 0; i < url.length; i++) {
                  this.fileUrlArra.push({
                    name: name[i],
                    url: url[i]
                  })
                }
              }
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
              url: `/xzgl/xzfy/xzfy/save`,
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