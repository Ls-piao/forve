<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading"
               :class="method==='view'?'readonly':''" :disabled="method==='view'"
               label-width="120px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="资料名称" prop="dataName"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.dataName" placeholder="请填写资料名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联资料类别id" prop="dataType.id"
                          :rules="[
                 ]">
              <SelectTree
                ref="dataType"
                :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'children'    // 子级字段名
                        }"

                url="/data/dataType/treeData"
                :value="inputForm.dataType.id"
                :clearable="true"
                :accordion="true"
                @getValue="(value) => {inputForm.dataType.id=value}"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资料路径" prop="dataUrl"
                          :rules="[
                 ]">
              <el-upload ref="dataUrl"
                         v-if="visible"
                         :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/data/data`"
                         :headers="{token: $cookie.get('token')}"
                         :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                         :on-success="(response, file, fileList) => {
                       inputForm.dataUrl = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                         :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.dataUrl = fileList.map(item => item.url).join('|')
                    }"
                         :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                         multiple
                         :limit="5"
                         :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                         :file-list="dataUrlArra">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">添加相关附件</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资料内容" prop="dataContent"
                          :rules="[
                 ]">
              <WangEditor ref="dataContentEditor" v-model="inputForm.dataContent"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注信息" prop="remarks"
                          :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">发布</el-button>
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import WangEditor from '@/components/editor/WangEditor'

export default {
  data () {
    return {
      title: '',
      method: '',
      visible: false,
      loading: false,
      dataUrlArra: [],
      inputForm: {
        id: '',
        dataName: '',
        dataType: {
          id: ''
        },
        dataUrl: '',
        dataContent: '',
        remarks: ''
      }
    }
  },
  components: {
    SelectTree,
    WangEditor
  },
  methods: {
    init (method, id) {
      this.method = method
      this.inputForm.id = id
      if (method === 'add') {
        this.title = `新建资料库表`
      } else if (method === 'edit') {
        this.title = '修改资料库表'
      } else if (method === 'view') {
        this.title = '查看资料库表'
      }
      this.dataUrlArra = []
      this.visible = true
      this.loading = false
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.$refs.dataContentEditor.init('')
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.loading = true
          this.$http({
            url: `/data/data/queryById?id=${this.inputForm.id}`,
            method: 'get'
          }).then(({data}) => {
            this.inputForm = this.recover(this.inputForm, data.data)
            this.$refs.dataContentEditor.init(this.inputForm.dataContent)
            this.inputForm.dataUrl.split('|').forEach((item) => {
              if (item.trim().length > 0) {
                this.dataUrlArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
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
            url: `/data/data/save`,
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
