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
            <el-form-item label="开始时间" prop="startDate"
                :rules="[
                  {required: true, message:'开始时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.startDate"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      :picker-options="editStartOptions">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="结束时间" prop="endDate"
                :rules="[
                  {required: true, message:'结束时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.endDate"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      :picker-options="editStopOptions">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="排班人员" prop="person"
                :rules="[
                  {required: true, message:'排班人员不能为空', trigger:'blur'}
                 ]">
                <user-select :value="inputForm.person" @getValue='(value) => {inputForm.person=value}'></user-select>
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
        appendToBody: false,
        inputForm: {
          id: '',
          startDate: '',
          endDate: '',
          person: '',
          remarks: ''
        },
        editStartOptions: {
          disabledDate: time => {
            if (!this.inputForm.endDate) {
              return time.getTime() < new Date(1970 - 1 - 1).getTime()
            } else {
              return time.getTime() > new Date(this.inputForm.endDate)
            }
          }
        },
        editStopOptions: {
          disabledDate: time => {
            return (
              time.getTime() < new Date(this.inputForm.startDate) ||
              time.getTime() < new Date(1970 - 1 - 1).getTime()    // 禁止选择1970年以前的日期
            )
          }
        }
      }
    },
    components: {
      UserSelect
    },
    methods: {
      init (method, id, date) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建排班信息`
        } else if (method === 'edit') {
          this.title = '修改排班信息'
        } else if (method === 'view') {
          this.title = '查看排班信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
     //     this.inputForm.startDate =
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/kqgl/pbxx/qbxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.qbxx)
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
              url: `/kqgl/pbxx/qbxx/save`,
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
