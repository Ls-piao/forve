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
            <el-form-item label="主任务" prop="mainTaskId" v-if = "this.roleType!=='principal'"
                          :rules="[{required: true, message:'主任务不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.mainTaskId" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in this.taskList"
                  :key="item.id"
                  :label="item.taskName"
                  :value="item.id">
                </el-option>
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
            <el-form-item label="工时" prop="manHour"
                          :rules="[{required: true, message:'工时不能为空', trigger:'blur'}
                 ]">
              <el-input @input.native="number($event)" v-model="inputForm.manHour" placeholder="请填写工时"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="任务完成概述" prop="overview"
                          :rules="[{required: true, message:'任务完成概述不能为空', trigger:'blur'}
                 ]">
          <el-input type="textarea" v-model="inputForm.overview" placeholder="请填写任务完成概述"     ></el-input>
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
  export default {
    data () {
      return {
        pickerBeginDateStart: {
          disabledDate: time => {
            if (this.inputForm.endDate === '') {
              return (time.getTime() < Date.now() - 8.64e7) + (time.getTime() > new Date(this.endDate).getTime())
            }
            return (time.getTime() > new Date(this.inputForm.endDate).getTime()) + (time.getTime() < Date.now() - 8.64e7)
          }
        },
        pickerBeginDateEnd: {
          disabledDate: time => {
            if (this.inputForm.startDate === '') {
              return (time.getTime() < Date.now() - 8.64e7) + (time.getTime() > new Date(this.endDate).getTime())
            }
            return (time.getTime() <= new Date(this.inputForm.startDate).getTime() - 8.64e7) + (time.getTime() > new Date(this.endDate).getTime())
          }
        },
        roleType: '',
        taskList: [],
        title: '',
        method: '',
        visible: false,
        endDate: '',
        loading: false,
        inputForm: {
          id: '',
          mainTaskId: '',
          startDate: '',
          endDate: '',
          manHour: '',
          overview: '',
          remarks: '',
          taskType: ''
        }
      }
    },
    components: {
    },
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
      init (method, id, role, mainTaskId, taskType, endDate) {
        this.endDate = endDate
        this.inputForm.taskType = taskType
        if (role === 'principal') {
          this.inputForm.mainTaskId = mainTaskId
        }
        this.roleType = role
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建工作简报`
        } else if (method === 'edit') {
          this.title = '修改工作简报'
        } else if (method === 'view') {
          this.title = '查看工作简报'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/workreport/workReport/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.workReport)
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
              url: `/workreport/workReport/save`,
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
