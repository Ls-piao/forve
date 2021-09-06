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
            <el-form-item label="选择分配人" prop="principal"
                          :rules="[{required: true, message:'分配人不能为空', trigger:'blur'}
                 ]">
              <user-select :limit='1' :value="inputForm.principal"
                           @getValue='(value) => {inputForm.principal=value}'></user-select>
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
      roleType: '',
      method: '',
      visible: false,
      loading: false,
      inputForm: {
        id: '',
        mainTaskId: '',
        principal: '',
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
      if (method === 'add') {
        this.title = '重新分配负责人'
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
            url: `/maintask/mainTask/UpdatePrincipal`,
            method: 'post',
            data: {
              id: this.inputForm.mainTaskId,
              principal: this.inputForm.principal
            }
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
