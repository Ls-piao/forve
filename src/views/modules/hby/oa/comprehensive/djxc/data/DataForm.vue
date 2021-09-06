<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      width="80%"
      :visible.sync="visible">
      <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading"
               :class="method==='view'?'readonly':''" :disabled="method==='view'"
               label-width="120px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="资料名称" prop="dataName" :rules="[{required: true, message:'资料名称不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.dataName" :maxlength="30" placeholder="请填写资料名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="display: none">
            <el-form-item label="状态" prop="dataStatus" :rules="[]">
              <el-input v-model="inputForm.dataStatus" placeholder="状态"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资料类别" prop="dataType.id" :rules="[{required: true, message:'资料类别必选', trigger:'blur'}]">
              <SelectTree v-if="forRefresh"
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
          <el-col :span="12">
            <el-form-item label="发布部门" prop="department" :rules="[{required: true, message:'发布部门必填', trigger:'blur'}]">
              <el-input v-model="inputForm.department" :maxlength="30" placeholder="发布部门"></el-input>
              <!--              <SelectTree
                              ref="dataType" placeholder="请选择资料类别"
                              :props="{
                                        value: 'id',             // ID字段名
                                        label: 'name',         // 显示名称
                                        children: 'children'    // 子级字段名
                                      }"
                              size="small"
                              url="/sys/office/treeData"
                              :value="inputForm.department"
                              :clearable="true"
                              :accordion="true"
                              @getValue="(value) => {inputForm.department=value}"/>-->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资料内容" prop="dataContent" :rules="dataContentRules">
              <WangEditor ref="dataContentEditor" v-model="inputForm.dataContent"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="dataUrl" :rules="[]">
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
          <el-col :span="24" v-if="inputForm.dataStatus == 1">
            <el-form-item label="驳回原因" prop="reason" :rules="[]">
              <el-input type="textarea" v-model="inputForm.reason" disabled :maxlength="200" placeholder="请填写驳回原因"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remarks" :rules="[]">
              <el-input type="textarea" v-model="inputForm.remarks" :maxlength="200" placeholder="请填写备注信息"></el-input>
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
import SelectTree from '@/components/treeSelect/treeSelect.vue'
import WangEditor from '@/components/editor/WangEditor'

export default {
  data () {
    // eslint-disable-next-line no-unused-vars
    let dataContentNotEmpty = (rule, value, callback) => {
      // eslint-disable-next-line no-constant-condition
      if (value === null || value === '') {
        callback(new Error('资料内容不能为空'))
      } else {
        callback()
      }
    }
    return {
      forRefresh: true,
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
        dataStatus: '',
        remarks: '',
        reason: '',
        department: ''
      },
      dataContentRules: [
        {required: true, message: '资料内容不能为空', trigger: 'blur'},
        {validator: dataContentNotEmpty, trigger: 'blur'}
      ]
    }
  },
  components: {
    SelectTree,
    WangEditor
  },
  activated () {
    this.forRefresh = false
    this.forRefresh = true
  },
  methods: {
    init: function (method, id) {
      this.method = method
      this.inputForm.id = id
      if (method === 'add') {
        this.title = `新建资料`
      } else if (method === 'edit') {
        this.title = '修改资料'
      } else if (method === 'view') {
        this.title = '查看资料'
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
      /*      if (method === 'view') {
              this.$refs.dataContentEditor.disabled()
            } else {
              this.$refs.dataContentEditor.enabled()
            } */
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
<style scoped>
/deep/.w-e-text {
  height: 3.5rem !important; /*!important是重点，因为原div是行内样式设置的高度300px*/
  border: 1px solid #ccc;

}
/deep/.wtext {
  height: auto !important;
  border: none !important;

}
</style>
