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
            <el-form-item label="文件名称" prop="fileName"
              :rules="[{required: true, message:'文件名称不能为空', trigger:'blur'}]">
              <el-input :disabled="true" v-model="inputForm.fileName" placeholder="请填写文件名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="文件类型" prop="fileType"
                :rules="[{required: true, message:'文件类型不能为空', trigger:'blur'}]">
            <el-input :disabled="true" v-model="inputForm.fileType" placeholder="请填写文件类型"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="文件类别" prop="lbId.id"
                :rules="[{required: true, message:'文件类别不能为空', trigger:'blur'}]">
          <SelectTree
                      ref="lb"
                      :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'children'    // 子级字段名
                        }"
                      url="/wjgl/wjgl/wjlb/treeData"
                      :value="inputForm.lbId.id"
                      :clearable="true"
                      :accordion="true"
                      @getValue="(value) => {inputForm.lbId.id=value}"/>
           </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件秘密级别" prop="lev"
              :rules="[{required: true, message:'文件秘密级别不能为空', trigger:'blur'},{validator: isOneToNinetyNine, trigger: 'blur'}]">
            <el-input type="number"  v-model="inputForm.lev" placeholder="请填写文件秘密级别"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关键词" prop="keyWord"
              :rules="[{required: true, message:'关键词不能为空', trigger:'blur'}]">
            <el-input v-model="inputForm.keyWord" placeholder="请填写关键词"     ></el-input>
          </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="摘要" prop="summary"
            :rules="[]">
          <el-input type="textarea" v-model="inputForm.summary" placeholder="请填写摘要"     ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件" prop="fileUrl"
          :rules="[{required: true, message:'附件不能为空', trigger:'blur'}]">
          <el-upload ref="fileUrl"
            :disabled="true"
            v-if="visible"
            :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fileManage`"
            :headers="{token: $cookie.get('token')}"
            :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
            :on-success="(response, file, fileList) => {
              inputForm.path = fileList.map(item => (item.response && item.response.url) || item.url).join('|')
              inputForm.fileName = fileList.map(item => item.name).join('|')
            }"
            :on-remove="(file, fileList) => {
            $http.post(`/sys/file/webupload/deleteByUrl?url=${(file.response && file.response.url) || file.url}`).then(({data}) => {
              $message.success(data.msg)
            })
            inputForm.path = fileList.map(item => item.url).join('|')
            inputForm.fileName = fileList.map(item => item.name).join('|')
            }"
            :before-remove="(file, fileList) => {
              return $confirm(`确定移除 ${file.name}？`)
            }"
            :multiple=false
            :file-list="fileUrlArra">
            <el-button :disabled="true" size="small" type="primary">点击上传</el-button>
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
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
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
          fileType: '',
          lbId: {
            id: ''
          },
          lev: '',
          keyWord: '',
          summary: '',
          path: '',
          fileName: ''
        }
      }
    },
    components: {
      SelectTree
    },
    methods: {
      init (method, id) {
        this.fileUrlArra = []
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建文件信息`
        } else if (method === 'edit') {
          this.title = '修改文件信息'
        } else if (method === 'view') {
          this.title = '查看文件信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/filemanage/wjxx/wjjbxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.wjjbxx)
              this.fileUrlArra.push({
                name: this.inputForm.fileName,
                url: this.inputForm.path
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
              url: `/filemanage/wjxx/wjjbxx/save`,
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
      },
      isOneToNinetyNine (rule, value, callback) {
        if (!value) {
          return callback(new Error('输入不可以为空'))
        }
        setTimeout(() => {
          if (!Number(value)) {
            callback(new Error('请输入正整数'))
          } else {
            const re = /^[1-9][0-9]{0,1}$/
            const rsCheck = re.test(value)
            if (!rsCheck) {
              callback(new Error('请输入正整数，值为【1,99】'))
            } else {
              callback()
            }
          }
        }, 0)
      }
    }
  }
</script>