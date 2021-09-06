<template>
<div>
    <el-form size="small" :model="inputForm" ref="inputForm" v-loading="loading" :disabled="formReadOnly"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="借款人" prop="borrower"
                :rules="[
                 ]">
              <el-input v-model="inputForm.borrower" placeholder="请填写借款人"   disabled  ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12"> 
            <el-form-item label="所属部门" prop="department"
                :rules="[
                 ]">
              <el-input v-model="inputForm.department" placeholder="请填写所属部门"  disabled   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="借支方式" prop="borrowingMethod"
                :rules="[
                 ]">
              <el-input v-model="inputForm.borrowingMethod" placeholder="请填写借支方式"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="借支金额" prop="debitAmout"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'},
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.debitAmout" placeholder="请填写借支金额"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="借支日期" prop="debitDate"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'},
                 ]">
                <el-date-picker
                      v-model="inputForm.debitDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="归还日期" prop="returnDate"
                :rules="[
                  {required: true, message:'不能为空', trigger:'blur'},
                 ]">
                <el-date-picker
                      v-model="inputForm.returnDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="结清日期" prop="clearDate"
                :rules="[
                 ]">
                <el-date-picker
                      v-model="inputForm.clearDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="借款单号" prop="loanNo"
                :rules="[
                 ]">
              <el-input v-model="inputForm.loanNo" placeholder="请填写借款单号"     ></el-input>
           </el-form-item>
        </el-col>
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
          borrower: '',
          department: '',
          borrowingMethod: '',
          debitAmout: '',
          debitDate: '',
          returnDate: '',
          handlingCashier: '',
          clearDate: '',
          loanNo: ''
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
              this.showUserInfo()
            })
          }
        },
        immediate: true,
        deep: false
      }
    },
    methods: {
      showUserInfo () {
        this.$http({
          url: '/sys/user/info',
          method: 'get'
        }).then(({data}) => {
          console.log(data)
          if (data.success) {
            this.inputForm.borrower = data.user.name
            this.inputForm.department = data.user.office.name
          }
        })
      },
      init (id) {
        if (id) {
          this.loading = true
          this.inputForm.id = id
          this.$nextTick(() => {
            this.$refs.inputForm.resetFields()
            this.$http({
              url: `/fkgl/sqjk/bgxtFkglBizSqjk/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtFkglBizSqjk)
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
              url: `/fkgl/sqjk/bgxtFkglBizSqjk/save`,
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