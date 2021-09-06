<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    append-to-body
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="24">
            <el-form-item label="子任务名称" prop="taskName"
                          :rules="[{required: true, message:'子任务名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.taskName" placeholder="请填写子任务名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="principal"
                        :rules="[{required: true, message:'负责人不能为空', trigger:'blur'}
                 ]">
            <user-select :limit='1' :value="inputForm.principal" @getValue='(value) => {inputForm.principal=value}' placeholder="请选择负责人">
            </user-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参与人" prop="participants"
                        :rules="[{required: true, message:'参与人不能为空', trigger:'blur'}
                 ]">
            <user-select :value="inputForm.participants" @getValue='(value) => {inputForm.participants=value}' placeholder="请选择参与人"></user-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开始时间" prop="startDate"
                          :rules="[{required: true, message:'开始时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.startDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="请选择开始时间"
                      :picker-options="pickerBeginDateStart">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="结束时间" prop="endDate"
                          :rules="[{required: true, message:'结束时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.endDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="请选择结束时间"
                      :picker-options="pickerBeginDateEnd">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="重要" type="danger" prop="importance">
              <el-switch v-model="inputForm.importance"
                         active-color="#ff4949"
                         :active-value="1"
                         :inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关键字" prop="keyWord"
            >
              <el-input  v-model="inputForm.keyWord" placeholder="请填写关键字"></el-input>
            </el-form-item>
          </el-col>
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
        <el-col :span="24">
          <el-form-item label="任务目标" prop="object"
                        :rules="[{required: true, message:'任务目标不能为空', trigger:'blur'}
                 ]">
            <el-input type="textarea" v-model="inputForm.object" placeholder="请填写任务目标"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="备注信息" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"></el-input>
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
  import UserSelect from '@/components/userSelect'
  export default {
    data () {
      return {
        pickerBeginDateStart: {
          // 开始时间限制
          disabledDate: time => {
            if (this.inputForm.endDate === '') {
              return (time.getTime() < Date.now() - 8.64e7) + (time.getTime() > new Date(this.endTime).getTime())
            }
            return (time.getTime() > new Date(this.inputForm.endDate).getTime()) + (time.getTime() < new Date(this.inputForm.endDate).getTime() - 8.64e7)
          }
        },
        pickerBeginDateEnd: {
          // 结束时间限制
          disabledDate: time => {
            if (this.inputForm.startDate === '') {
              return (time.getTime() < Date.now() - 8.64e7) + (time.getTime() > new Date(this.endTime).getTime())
            }
            return (time.getTime() > new Date(this.endTime).getTime()) + (time.getTime() < new Date(this.inputForm.startDate).getTime() - 8.64e7)
          }
        },
        endTime: '',
        title: '',
        method: '',
        visible: false,
        loading: false,
        fileUrlArra: [],
        inputForm: {
          id: '',
          mainTaskId: '',
          taskName: '',
          principal: '',
          participants: '',
          object: '',
          startDate: '',
          endDate: '',
          fileUrl: '',
          remarks: '',
          keyWord: '',
          importance: ''
        }
      }
    },
    components: {
      UserSelect
    },
    methods: {
      init (method, id, endTime) {
        this.endTime = endTime
        this.method = method
        if (method === 'add') {
          this.title = `新建子任务`
          this.inputForm.mainTaskId = id
        } else if (method === 'edit') {
          this.title = '修改子任务'
          this.inputForm.id = id
        } else if (method === 'view') {
          this.title = '查看子任务'
          this.inputForm.id = id
        }
        this.fileUrlArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/sontask/sonTask/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.sonTask)
              this.inputForm.fileUrl.split('|').forEach((item) => {
                if (item.trim().length > 0) {
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
              url: `/sontask/sonTask/save`,
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
