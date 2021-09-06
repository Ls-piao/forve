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
            <el-form-item label="备注信息" prop="remarks" :rules="[]">
              <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级编号" prop="parent.id" :rules="[]">
              <SelectTree
                ref="parent"
                :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'children'    // 子级字段名
                        }"
                v-if="visible"
                :url="`/data/dataType/treeData?extId=${inputForm.id}`"
                :value="inputForm.parent.id"
                :clearable="true"
                :accordion="true"
                @getValue="(value) => {inputForm.parent.id=value}"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="类型封面" prop="coverImg" :rules="[]">
              <el-upload ref="coverImg"
                         v-if="visible"
                         list-type="picture-card"
                         :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/xxdata/xxDataType`"
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
                       inputForm.coverImg = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
                    }"
                         :on-remove="(file, fileList) => {
                      $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
                        $message.success(data.msg)
                      })
                      inputForm.coverImg = fileList.map(item => item.url).join('|')
                    }"
                         :before-remove="(file, fileList) => {
                      return $confirm(`确定移除 ${file.name}？`)
                    }"
                         multiple
                         :limit="5"
                         :on-exceed="(files, fileList) =>{
                      $message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
                    }"
                         :file-list="coverImgArra">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name" :rules="[{required: true, message:'名称不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.name" :maxlength="30" placeholder="请填写名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort" :rules="[
                  {required: true, message:'排序不能为空', trigger:'blur'},
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.sort" placeholder="请填写排序"></el-input>
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

export default {
  data () {
    return {
      title: '',
      method: '',
      visible: false,
      loading: false,
      coverImgArra: [],
      inputForm: {
        id: '',
        remarks: '',
        parent: {
          id: ''
        },
        name: '',
        sort: ''
      }
    }
  },
  components: {
    SelectTree
  },
  methods: {
    init (method, obj) {
      this.method = method
      this.inputForm.id = obj.id
      if (method === 'add') {
        this.title = '新建资料'
      } else if (method === 'addChild') {
        this.title = '添加下级资料'
      } else if (method === 'edit') {
        this.title = '修改资料'
      } else if (method === 'view') {
        this.title = '查看资料'
      }
      this.visible = true
      this.loading = false
      this.$nextTick(() => {
        this.$refs.inputForm.resetFields()
        this.inputForm.parent.id = obj.parent.id
        this.inputForm.parent.name = obj.parent.name
        if (method === 'edit' || method === 'view') { // 修改或者查看
          this.loading = true
          this.$http({
            url: `/data/dataType/queryById?id=${this.inputForm.id}`,
            method: 'get'
          }).then(({data}) => {
            this.inputForm = this.recover(this.inputForm, data.dataType)
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
            url: `/data/dataType/save`,
            method: 'post',
            data: this.inputForm
          }).then(({data}) => {
            this.loading = false
            if (data && data.success) {
              this.visible = false
              this.$message.success(data.msg)
              this.$emit('refreshTree')
            }
          })
        }
      })
    }
  }
}
</script>
