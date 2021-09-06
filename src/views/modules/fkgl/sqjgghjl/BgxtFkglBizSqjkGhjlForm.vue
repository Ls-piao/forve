<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="报销冲抵" prop="bxcd"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.bxcd" placeholder="请填写报销冲抵"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="本次归还" prop="thisReturn"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'},
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.thisReturn" placeholder="请填写本次归还"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="还款日期" prop="repaymentDate"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      v-model="inputForm.repaymentDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="还款说明" prop="repaymentDescription"
                :rules="[
                 ]">
              <el-input v-model="inputForm.repaymentDescription" placeholder="请填写还款说明"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="结清日期" prop="cleanDate"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.cleanDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="会计" prop="accounting"
                :rules="[
                 ]">
              <el-input v-model="inputForm.accounting" placeholder="请填写会计"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="出纳" prop="cashier"
                :rules="[
                 ]">
              <el-input v-model="inputForm.cashier" placeholder="请填写出纳"     ></el-input>
           </el-form-item>
        </el-col> -->
        </el-row>
    </el-form>
</div>
</template>

<script>
  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        inputForm: {
          id: '',
          bxcd: '',
          thisReturn: '',
          repaymentDate: '',
          repaymentDescription: '',
          cleanDate: '',
          accounting: '',
          cashier: ''
        }
      }
    },
    props: {
      businessId: {
        type: String,
        default: ''
      },
      formReadOnly: {
        type: Boolean,
        default: false
      }
    },
    components: {
    },
    watch: {
      'businessId': {
        handler (newVal) {
          if (this.businessId) {
            this.init(this.businessId)
          } else {
            this.$nextTick(() => {
              this.$refs.inputForm.resetFields()
            })
          }
        },
        immediate: true,
        deep: false
      }
    },
    methods: {
      init (id) {
        if (id) {
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/fkgl/sqjgghjl/bgxtFkglBizSqjkGhjl/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtFkglBizSqjkGhjl)
              this.loading = false
            })
          })
        }
      },
      // 表单提交
      saveForm (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/fkgl/sqjgghjl/bgxtFkglBizSqjkGhjl/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                callback(data.businessTable, data.businessId)
              }
            })
          }
        })
      }
    }
  }
</script>