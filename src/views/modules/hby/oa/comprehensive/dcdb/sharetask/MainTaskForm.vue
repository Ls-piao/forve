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
            <el-form-item label="任务名称" prop="taskName"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.taskName" placeholder="请填写任务名称"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务目标" prop="object"
                          :rules="[
                 ]">
              <el-input v-model="inputForm.object" placeholder="请填写任务目标"     ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startDate"
                          :rules="[
                 ]">
              <el-date-picker
                style="width: 100%;"
                v-model="inputForm.startDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endDate"
                          :rules="[
                 ]">
              <el-date-picker
                style="width: 100%;"
                v-model="inputForm.endDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="principal"
                          :rules="[
                 ]">
              <user-select :limit='1' :value="inputForm.principal" @getValue='(value) => {inputForm.principal=value}'>
              </user-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="督办人" prop="oversee"
                          :rules="[
                 ]">
              <user-select :limit='1' :value="inputForm.oversee" @getValue='(value) => {inputForm.oversee=value}'>
              </user-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分管人" prop="manager"
                          :rules="[
                 ]">
              <user-select :limit='1' :value="inputForm.manager" @getValue='(value) => {inputForm.manager=value}'>
              </user-select>
              <!--<el-select v-model="inputForm.manager" placeholder="请选择"  style="width: 100%;">
                        <el-option
                          v-for="item in $dictUtils.getDictList('')"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参与人" prop="participant"
                          :rules="[
                 ]">
              <user-select :limit='1' :value="inputForm.participant" @getValue='(value) => {inputForm.participant=value}'></user-select>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="附件url" prop="fileUrl"
                          :rules="[
                 ]">
              <el-upload ref="fileUrl"
                         v-if="visible"
                         list-type="picture-card"
                         :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/maintask/mainTask`"
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
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注信息" prop="remarks"
                          :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"     ></el-input>
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
        title: '',
        method: '',
        visible: false,
        loading: false,
        fileUrlArra: [],
        inputForm: {
          id: '',
          taskName: '',
          principal: '',
          participant: '',
          oversee: '',
          manager: '',
          object: '',
          startDate: '',
          endDate: '',
          fileUrl: '',
          taskStatus: '',
          remarks: ''
        }
      }
    },
    components: {
      UserSelect
    },
    methods: {
      init (method, id, role, mainTaskId) {
        this.inputForm.mainTaskId = mainTaskId
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建主任务`
        } else if (method === 'edit') {
          this.title = '修改主任务'
        } else if (method === 'view') {
          this.title = '查看主任务'
        }
        this.fileUrlArra = []
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/maintask/mainTask/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.mainTask)
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
              url: `/maintask/mainTask/save`,
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
