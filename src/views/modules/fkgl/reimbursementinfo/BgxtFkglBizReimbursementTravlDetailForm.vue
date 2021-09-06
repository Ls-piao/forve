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
            <el-form-item label="出发时间" prop="departureTime"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.departureTime"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="到达时间" prop="arrivalTime"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.arrivalTime"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="出发地" prop="departureAddress"
                :rules="[
                 ]">
              <el-input v-model="inputForm.departureAddress" placeholder="请填写出发地"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="目的地" prop="arrivalAddress"
                :rules="[
                 ]">
              <el-input v-model="inputForm.arrivalAddress" placeholder="请填写目的地"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="单据数" prop="numberOfDocuments"
                :rules="[
                  {validator: validator.isIntGteZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.numberOfDocuments" placeholder="请填写单据数"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="金额(元)" prop="amount"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.amount" placeholder="请填写金额(元)"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="税率" prop="taxRate"
                :rules="[
                 ]">
              <el-input v-model="inputForm.taxRate" placeholder="请填写税率"     ></el-input>
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
          departureTime: '',
          arrivalTime: '',
          departureAddress: '',
          arrivalAddress: '',
          numberOfDocuments: '',
          amount: '',
          taxRate: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, obj) {
        this.method = method
        if (method === 'add') {
          this.title = `新建办公系统费控管理报销-差旅费明细`
        } else if (method === 'edit') {
          this.title = '修改办公系统费控管理报销-差旅费明细'
        } else if (method === 'view') {
          this.title = '查看办公系统费控管理报销-差旅费明细'
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