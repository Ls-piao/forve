<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      width="60%"
      v-dialogDrag
      :visible.sync="visible"

    >
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
               :class="method==='view'?'readonly':''" :disabled="method==='view'"
               label-width="120px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="任务名称" prop="taskName"
                          :rules="[{required: true, message:'任务名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.taskName" placeholder="请填写任务名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务类型" prop="taskType"
                          :rules="[{required: true, message:'任务类型不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.taskType" placeholder="请选择任务类型" style="width: 100%;">
                <el-option v-for="item in $dictUtils.getDictList('TASK_TYPE')" :label="item.label" :key="item.value"
                           :value="item.value"></el-option>
              </el-select>
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
          <el-col :span="12">
            <el-form-item label="负责人" prop="principal"
                          :rules="[{required: true, message:'负责人不能为空', trigger:'blur'}
                 ]">
              <user-select :limit='1' :value="inputForm.principal" @getValue='(value) => {inputForm.principal=value}'
                           placeholder="请选择负责人"
                           contenteditable="true" :disabled="method != 'edit' ? false : true">
              </user-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="督办人" prop="oversee"
                          :rules="[{required: true, message:'督办人不能为空', trigger:'blur'}
                 ]">
              <user-select :limit='1' :value="inputForm.oversee" @getValue='(value) => {inputForm.oversee=value}'
                           placeholder="请选择督办人"
                           :disabled="method != 'edit' ? false : true">
              </user-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分管人" prop="manager"
                          :rules="[{required: true, message:'分管人不能为空', trigger:'blur'}
                 ]">
              <user-select :limit='1' :value="inputForm.manager" @getValue='(value) => {inputForm.manager=value}'
                           placeholder="请选择分管人"
                           :disabled="method != 'edit' ? false : true">
              </user-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参与人" prop="participants"
                          :rules="[{required: true, message:'参与人不能为空', trigger:'blur'}
                 ]">
              <user-select :value="inputForm.participants"
                           @getValue='(value) => {inputForm.participants=value}' placeholder="请选择参与人"
                           :disabled="method != 'edit' ? false : true"></user-select>
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
                <el-input v-model="inputForm.keyWord" placeholder="请填写关键字"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="fileUrl"
                          :rules="[
                 ]">
              <el-upload ref="fileUrl"
                         v-if="visible"
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
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">添加相关附件</div>
                <!--  <i class="el-icon-plus"></i>-->

              </el-upload>
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
      <el-button size="small" v-if="method === 'add'" style="float: left" type="success" @click="dialogVisible = true">高级设置</el-button>
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method != 'view'" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
    </el-dialog>
    <el-dialog
      title="高级设置"
      :visible.sync="dialogVisible"
      width="55%"
      modal
      class="topSeting"
    >
      <el-form :model="taskMails">
        <div class="firstSelect">
          <p style="float: left">提醒接收人</p>
          <el-checkbox-group v-model="taskMails.sendRoles" style="margin-left: 16%">
            <el-checkbox label="principal">任务分配人</el-checkbox>
            <el-checkbox label="manager">任务责任人</el-checkbox>
            <el-checkbox label="oversee">任务监控人</el-checkbox>
            <el-checkbox label="participant">任务参与人</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="thirdSelect">
          <p style="float: left; margin-top: 2%;padding: 0;">提醒设置</p>
          <el-checkbox-group v-model="taskMails.sendTimes" style="margin-left: 16%;">
            <el-row :gutter="0">
              <el-col :span="24" style="margin-top: 2%">
                <el-checkbox label="begin">开始前提醒</el-checkbox>
              </el-col>
              <el-col :span="24" style="margin-top: 2%">
                <el-checkbox label="end">结束前提醒</el-checkbox>
              </el-col>
              <el-col :span="24" style="margin-top: 2%">
                <el-checkbox label="overtime">超期后提醒</el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendSave()" size="small">保存</el-button>
        <el-button @click="dialogVisible = false" size="small">关闭</el-button>
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
        disabledDate: time => {
          if (this.inputForm.endDate === '') {
            return time.getTime() < Date.now() - 8.64e7
          }
          return (time.getTime() > new Date(this.inputForm.endDate).getTime()) + (time.getTime() < Date.now() - 8.64e7)
        }
      },
      pickerBeginDateEnd: {
        disabledDate: time => {
          if (this.inputForm.startDate === '') {
            return time.getTime() < Date.now() - 8.64e7
          }
          return time.getTime() <= new Date(this.inputForm.startDate).getTime() - 8.64e7
        }
      },
      title: '',
      method: '',
      visible: false,
      loading: false,
      dialogVisible: false,
      checkList: ['选中且禁用', '复选框 A'],
      checkSec: [],
      fileUrlArra: [],
      taskMails: {
        sendRoles: [],
        sendTimes: []
      },
      inputForm: {
        keyWord: '',
        importance: '',
        taskType: '',
        id: '',
        taskName: '',
        principal: '',
        participants: '',
        oversee: '',
        manager: '',
        object: '',
        startDate: '',
        endDate: '',
        fileUrl: '',
        taskStatus: '',
        distributedState: '0',
        remarks: '',
        taskMail: {
          sendRole: '',
          sendTime: ''
        }
      }
    }
  },
  components: {
    UserSelect
  },
  methods: {
    // 高级设置保存
    sendSave () {
      this.inputForm.taskMail.sendRole = this.taskMails.sendRoles.toString()
      this.inputForm.taskMail.sendTime = this.taskMails.sendTimes.toString()
      if (this.inputForm.taskMail.sendRole === '' && this.inputForm.taskMail.sendTime === '') {
        this.$message.success('请完善高级设置信息')
      } else {
        this.$message.success('高级设置保存成功')
        this.dialogVisible = false
      }
    },
    init (method, id) {
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
            console.log(this.inputForm)
            this.inputForm.fileUrl.split('|').forEach((item) => {
              if (item.trim().length > 0) {
                this.fileUrlArra.push({
                  name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)),
                  url: item
                })
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
              this.taskMails = {
                sendRoles: [],
                sendTimes: []
              }
              this.inputForm.taskMail.sendRole = ''
              this.inputForm.taskMail.sendTime = ''
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-table--scrollable-x .el-table__body-wrapper {
  overflow: scroll !important;
  height: 29rem !important;
}

.topSeting {

  .el-dialog__title {
    float: left;
  }

}

.secondSelect {
  margin-top: 2%;
}

p{
  margin: 0;
  padding: 0;
}

</style>




