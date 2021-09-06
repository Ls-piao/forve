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
        <el-col :span="12">
            <el-form-item label="库房编号" prop="kfbh"
                :rules="[
                  {required: true, message:'库房编号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.kfbh" placeholder="请填写库房编号"  maxlength="15"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="库房名称" prop="kfmc"
                :rules="[
                  {required: true, message:'库房名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.kfmc" placeholder="请填写库房名称"  maxlength="100"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="面积" prop="mj"
                :rules="[
                 ]">
              <el-input v-model="inputForm.mj" placeholder="请填写面积"  maxlength="50"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="管理员" prop="gly"
                :rules="[
                 ]">
              <el-input v-model="inputForm.gly" placeholder="请填写管理员"  maxlength="25"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="联系电话" prop="lxdh"
                :rules="[
                 ]">
              <el-input v-model="inputForm.lxdh" placeholder="请填写联系电话"  maxlength="20"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="位置" prop="wz"
                :rules="[
                 ]">
              <el-input v-model="inputForm.wz" placeholder="请填写位置"  maxlength="25"    ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="库房图片" prop="kftp"
                :rules="[
                 ]">
              <el-upload ref="kftp"
              v-if="visible"
              list-type="picture-card"
                    :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/dagl/dakfkfb`"
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
                       inputForm.kftp = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                    :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.kftp = fileList.map(item => item.url).join('|')
                    }"
                    :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                    multiple
                    :limit="5"
                    :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                    :file-list="kftpArra">
                    <i class="el-icon-plus"></i>
                  </el-upload>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注"  maxlength="100"    ></el-input>
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
        kftpArra: [],
        inputForm: {
          id: '',
          kfbh: '',
          kfmc: '',
          mj: '',
          gly: '',
          lxdh: '',
          wz: '',
          kftp: '',
          remarks: ''
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
          this.title = `新建库房`
        } else if (method === 'edit') {
          this.title = '修改库房'
        } else if (method === 'view') {
          this.title = '查看库房'
        }
        this.kftpArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/dagl/dakfkfb/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.daKfKfb)
              this.inputForm.kftp.split('|').forEach((item) => {
                if (item.trim().length > 0) {
                  this.kftpArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
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
              url: `/dagl/dakfkfb/save`,
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
