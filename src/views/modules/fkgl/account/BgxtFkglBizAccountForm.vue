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
            <el-form-item label="姓名" prop="name"
                :rules="[
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写姓名"  disabled   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="所属部门" prop="officeCode"
                :rules="[
                 ]">
              <el-input v-model="inputForm.officeCode" placeholder="请填写所属部门"  disabled   ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="银行账户名" prop="bankAccountName"
                :rules="[
                  {required: true, message:'银行账户名不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.bankAccountName" placeholder="请填写银行账户名"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="开户银行名" prop="bankName"
                :rules="[
                  {required: true, message:'开户银行名不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.bankName" placeholder="请填写开户银行名"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="银行账号" prop="bankNo"
                :rules="[
                  {required: true, message:'银行账号不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.bankNo" placeholder="请填写银行账号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="状态" prop="status"
                :rules="[
                 ]">
                    <el-radio-group v-model="inputForm.status">
                        <el-radio v-for="item in $dictUtils.getDictList('yes_no')" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
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
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          name: '',
          officeCode: '',
          bankAccountName: '',
          bankName: '',
          bankNo: '',
          status: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id) {
        if (!id) {
          this.$http({
            url: '/sys/user/info',
            method: 'get'
          }).then(({data}) => {
            if (data.success) {
              this.inputForm.name = data.user.name
              this.inputForm.officeCode = data.user.office.name
            }
          })
        }
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建我的账户`
        } else if (method === 'edit') {
          this.title = '修改我的账户'
        } else if (method === 'view') {
          this.title = '查看我的账户'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/fkgl/account/bgxtFkglBizAccount/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.bgxtFkglBizAccount)
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
              url: `/fkgl/account/bgxtFkglBizAccount/save`,
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