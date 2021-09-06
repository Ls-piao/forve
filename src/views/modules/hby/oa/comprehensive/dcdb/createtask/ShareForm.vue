<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
               :class="method==='view'?'readonly':''" :disabled="method==='view'"
               label-width="120px">
        <el-row :gutter="15">
            <el-col :span="24">
              <el-form-item label="分享人" prop="personIds"
                            :rules="[{required: true, message:'分享人不能为空', trigger:'blur'}
                 ]">
                <user-select :value="inputForm.personIds"
                             @getValue='(value) => {inputForm.personIds=value}'></user-select>
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
        roleType: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          mainTaskId: '',
          personIds: '',
          remarks: '',
          startDate: '',
          endDate: ''
        }
      }
    },
    components: {
      UserSelect
    },
    methods: {
      init (method, id, role, mainTaskId) {
        if (role === 'principal') {
          this.inputForm.mainTaskId = mainTaskId
        }
        this.roleType = role
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = '任务共享'
        } else if (method === 'edit') {
          this.title = '任务共享'
        } else if (method === 'view') {
          this.title = '任务共享'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/manhour/manHour/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.manHour)
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
              url: `/share/Share/save`,
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
    },
    mounted () {
      // this.getMainTaskList()
    }
  }
</script>
