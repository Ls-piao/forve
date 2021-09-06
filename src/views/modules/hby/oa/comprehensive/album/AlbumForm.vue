<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="24">
            <el-form-item label="相片名称" prop="title" :rules="[{required: true, message:'相册名称不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.title" placeholder="请填写相片名称"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="相片说明" prop="content" :rules="[{required: true, message:'相册说明不能为空', trigger:'blur'}]">
              <el-input type="textarea" v-model="inputForm.content" placeholder="请填写相片说明"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24" style="display: block;text-align: center;">
          <!--            label="上传照片"-->
          <el-form-item prop="photoPath" :rules="[{required: true, message:'照片不能为空', trigger:'blur'}]" >
            <el-upload ref="photoPath"
                       style="margin-left: -120px"
                       v-if="visible"
                       list-type="picture-card"
                       :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/xc/xcgl/xpjl`"
                       :headers="{token: $cookie.get('token')}"
                       :on-preview="(file, fileList) => {
                        $alert(`<img style='width:100%' src=' ${(file.response && file.response.url) || file.url}'/>`,  {
                          dangerouslyUseHTMLString: true,
                          showConfirmButton: false,
                          closeOnClickModal: true,
                          customClass: 'showPic'
                        });
                    }"
                       :on-success="(response, file, fileList) => {
                       inputForm.photoPath = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                       :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.photoPath = fileList.map(item => item.url).join('|')
                    }"
                       :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                       multiple
                       :limit="1"
                       :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                       :file-list="photoPathArra">
              <i class="el-icon-plus"></i>
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
        photoPathArra: [],
        inputForm: {
          id: '',
          title: '',
          photoPath: '',
          content: '',
          flId: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id) {
        this.method = method
        // this.inputForm.id = id
        if (method === 'add') {
          this.inputForm.id = ''
          this.inputForm.flId = id
          this.title = `新建照片信息`
        } else if (method === 'edit') {
          this.inputForm.id = id
          this.title = '修改照片信息'
        } else if (method === 'view') {
          this.title = '查看照片信息'
        }
        this.photoPathArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xc/xcgl/xpjl/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xpjl)
              this.inputForm.photoPath.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.photoPathArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
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
              url: `/xc/xcgl/xpjl/save`,
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
<style>
  /*.el-form-item__content {*/
  /*  margin-left: 5px;*/
  /*}*/
</style>
