<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" :class="method==='view'?'readonly':''"  :disabled="method==='view'" @keyup.enter.native="doSubmit()"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="报销金额" prop="reimbursementAmount"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.reimbursementAmount" placeholder="请填写报销金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="单据总数" prop="totalNumber"
                :rules="[
                  {validator: validator.isIntGteZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.totalNumber" placeholder="请填写单据总数"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="借款金额" prop="loanAmount"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.loanAmount" placeholder="请填写借款金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="冲抵借款金额" prop="offsetLoanAmount"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.offsetLoanAmount" placeholder="请填写冲抵借款金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="银行账户" prop="bankAccount"
                :rules="[
                 ]">
              <el-input v-model="inputForm.bankAccount" placeholder="请填写银行账户"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开户银行" prop="bankOfDeposit"
                :rules="[
                 ]">
              <el-input v-model="inputForm.bankOfDeposit" placeholder="请填写开户银行"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="银行账号" prop="bankNo"
                :rules="[
                 ]">
              <el-input v-model="inputForm.bankNo" placeholder="请填写银行账号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注" prop="content"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.content" placeholder="请填写备注"     ></el-input>
           </el-form-item>
        </el-col>
        </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" v-if="method === 'add'" type="primary" @click="continueDoSubmit()">继续添加</el-button>
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" v-if="method !== 'view'" type="primary" @click="doSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        oldInputForm: '',
        inputForm: {
          id: '',
          reimbursementAmount: '',
          totalNumber: '',
          loanAmount: '',
          offsetLoanAmount: '',
          bankAccount: '',
          bankOfDeposit: '',
          bankNo: '',
          content: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, obj) {
        this.method = method
        if (method === 'add') {
          this.title = `新建办公系统费控管理报销-日常及采购报销内容`
        } else if (method === 'edit') {
          this.title = '修改办公系统费控管理报销-日常及采购报销内容'
        } else if (method === 'view') {
          this.title = '查看办公系统费控管理报销-日常及采购报销内容'
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = ''
          this.oldInputForm = ''
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.oldInputForm = obj
            this.inputForm = JSON.parse(JSON.stringify(obj))
          }
        })
      },
   // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.$emit('addRow', this.oldInputForm, JSON.parse(JSON.stringify(this.inputForm)))
            this.visible = false
          }
        })
      },
      continueDoSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.$emit('addRow', this.oldInputForm, JSON.parse(JSON.stringify(this.inputForm)))
            this.$refs['inputForm'].resetFields()
          }
        })
      }
    }
  }
</script>