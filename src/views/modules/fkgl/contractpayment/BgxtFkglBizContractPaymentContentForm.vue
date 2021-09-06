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
            <el-form-item label="付款款项" prop="payment"
                :rules="[
                 ]">
              <el-input v-model="inputForm.payment" placeholder="请填写付款款项"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="付款条件" prop="termOfPayment"
                :rules="[
                 ]">
              <el-input v-model="inputForm.termOfPayment" placeholder="请填写付款条件"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="违约责任" prop="fyzr"
                :rules="[
                 ]">
              <el-input v-model="inputForm.fyzr" placeholder="请填写违约责任"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="应付日期" prop="copeWithDate"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.copeWithDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="应付金额" prop="copeWithMoney"
                :rules="[
                 ]">
              <el-input v-model="inputForm.copeWithMoney" placeholder="请填写应付金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="是否已收发票" prop="yseNo"
                :rules="[
                 ]">
              <el-input v-model="inputForm.yseNo" placeholder="请填写是否已收发票"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开票日期" prop="invoiceDate"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.invoiceDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="发票号码" prop="invoiceNo"
                :rules="[
                 ]">
              <el-input v-model="inputForm.invoiceNo" placeholder="请填写发票号码"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注" prop="invoiceContent"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.invoiceContent" placeholder="请填写备注"     ></el-input>
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
          payment: '',
          termOfPayment: '',
          fyzr: '',
          copeWithDate: '',
          copeWithMoney: '',
          yseNo: '',
          invoiceDate: '',
          invoiceNo: '',
          invoiceContent: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, obj) {
        this.method = method
        if (method === 'add') {
          this.title = `新建办公系统费控管理合同付款明细列表`
        } else if (method === 'edit') {
          this.title = '修改办公系统费控管理合同付款明细列表'
        } else if (method === 'view') {
          this.title = '查看办公系统费控管理合同付款明细列表'
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