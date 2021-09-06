<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      append-to-body
      v-dialogDrag
      :visible.sync="visible">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
               :class="method==='view'?'readonly':''" :disabled="method==='view'"
               label-width="120px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="里程碑名称" prop="milestoneName"
                          :rules="[{required: true, message:'里程碑名称不能为空', trigger:'blur'}
                 ]">
              <el-input :disabled="method === 'edit'" v-model="inputForm.milestoneName" placeholder="请填写里程碑名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工时" prop="workingHours"
                          :rules="[{required: true, message:'工时不能为空', trigger:'blur'}
                 ]">
              <el-input :disabled="method === 'edit'" @input.native="number($event)" v-model="inputForm.workingHours" placeholder="请填写工时"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计结束时间" prop="schedEndDate"
                          :rules="[{required: true, message:'预计结束时间不能为空', trigger:'blur'}
                 ]">
              <el-date-picker
                :disabled="method === 'edit'"
                style="width: 100%;"
                v-model="inputForm.schedEndDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择开始时间"
                :picker-options="pickerschedEndDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="method != 'add'">
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
          <el-col :span="12" v-if="method != 'add'">
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
            <el-form-item label="备注信息" prop="remarks"
                          :rules="[
                 ]">
              <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息" :disabled="method === 'edit'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="任务进度" prop="schedule">
              <el-progress  :disabled="method === 'edit'" :percentage="percentage" :color="customColor" style="margin-top: 2%"></el-progress>
            </el-form-item>
          </el-col>
          <el-col :span="10" v-if="method === 'add'">
            <el-button-group>
              <el-button icon="el-icon-minus" @click="decrease" size="small" :disabled="this.percentage <= this.inputForm.otherSchedule ? true : false"></el-button>
              <el-button icon="el-icon-plus" @click="increase" size="small"></el-button>
            </el-button-group>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="fileUrl"
                          :rules="[
                 ]">
              <el-upload ref="fileUrl"
                         v-if="visible"
                         :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/milestone/milestone`"
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
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="method == 'add'" @click="doSubmit()" v-noMoreClick>确定</el-button>
        <el-button size="small" type="primary" v-if="method == 'edit'" @click="doSubmit()" v-noMoreClick>完成</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        pickerschedEndDate: {
          disabledDate: time => {
            return (time.getTime() < Date.now() - 8.64e7) + (time.getTime() > new Date(this.endDate).getTime())
          }
        },
        pickerBeginDateStart: {
          disabledDate: time => {
            return time.getTime() > new Date(this.inputForm.endDate).getTime()
          }
        },
        pickerBeginDateEnd: {
          disabledDate: time => {
            return time.getTime() <= new Date(this.inputForm.startDate).getTime() - 8.64e7
          }
        },
        fileUrlArra: [],
        percentage: 0,
        customColor: '#409eff',
        roleType: '',
        taskList: [],
        title: '',
        method: '',
        visible: false,
        loading: false,
        endDate: '',
        inputForm: {
          id: '',
          mainTaskId: '',
          milestoneName: '',
          startDate: '',
          endDate: '',
          workingHours: '',
          taskStatus: '',
          remarks: '',
          taskType: '',
          schedule: '',
          otherSchedule: '',
          schedEndDate: '',
          fileUrl: ''
        }
      }
    },
    components: {},
    methods: {
      // 限制函数 只能输入非0正整数
      number (e) {
        var _value = e.target.value  // 获取到输入框的value值
        const reg = isNaN(_value)    // 判断拿到的value是否为数字
        if (reg) {                    // 若为非数字键，则全部替换为空
          e.target.value = _value.replace(/[^1-9]/g, '')
        }
        if (_value === '0') {         // 若为0，则替换为空
          e.target.value = _value.replace(/^[^1-9]/g, '')
        }
      },
      // 进度条增加和减少
      increase () {
        this.percentage += 10
        if (this.percentage > 100) {
          this.percentage = 100
        }
      },
      decrease () {
        this.percentage -= 10
        if (this.percentage < 0) {
          this.percentage = 0
        }
      },
      init (method, id, role, mainTaskId, taskType, schedule, endDate) {
        this.endDate = endDate
        this.inputForm.otherSchedule = schedule
        this.percentage = schedule
        this.inputForm.taskType = taskType
        if (role === 'principal') {
          this.inputForm.mainTaskId = mainTaskId
        }
        this.roleType = role
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建里程碑`
        } else if (method === 'edit') {
          this.title = '修改里程碑'
        } else if (method === 'view') {
          this.title = '查看里程碑'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/milestone/milestone/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.milestone)
              this.percentage = this.inputForm.schedule
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
            this.inputForm.schedule = this.percentage
            this.loading = true
            this.$http({
              url: `/milestone/milestone/save`,
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
      // 获取主任务
      getMainTaskList () {
        this.loading = true
        this.$http({
          url: '/maintask/mainTask/getList',
          method: 'get'
        }).then(({data}) => {
          if (data) {
            this.taskList = data
          }
        })
      }
    },
    mounted () {
      this.getMainTaskList()
    }
  }
</script>
