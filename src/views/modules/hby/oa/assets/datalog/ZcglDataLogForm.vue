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
            <el-form-item label="远程地址" prop="remoteAddress"
                :rules="[
                  {required: true, message:'远程地址不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.remoteAddress" placeholder="请填写远程地址"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="请求路径" prop="requestUri"
                :rules="[
                  {required: true, message:'请求路径不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.requestUri" placeholder="请填写请求路径"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="提交方式" prop="method"
                :rules="[
                  {required: true, message:'提交方式不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.method" placeholder="请填写提交方式"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="操作用户" prop="userId"
                :rules="[
                  {required: true, message:'操作用户不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.userId" placeholder="请填写操作用户"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="数据表名" prop="dataTable"
                :rules="[
                  {required: true, message:'数据表名不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dataTable" placeholder="请填写数据表名"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="数据ID" prop="dataId"
                :rules="[
                  {required: true, message:'数据ID不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dataId" placeholder="请填写数据ID"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="数据内容" prop="dataContent"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.dataContent" placeholder="请填写数据内容"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="版本" prop="dataVersion"
                :rules="[
                  {required: true, message:'版本不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dataVersion" placeholder="请填写版本"     ></el-input>
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
          remoteAddress: '',
          requestUri: '',
          method: '',
          userId: '',
          dataTable: '',
          dataId: '',
          dataContent: '',
          dataVersion: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建数据日志`
        } else if (method === 'edit') {
          this.title = '修改数据日志'
        } else if (method === 'view') {
          this.title = '查看数据日志'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/datalog/zcglDataLog/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.zcglDataLog)
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
              url: `/datalog/zcglDataLog/save`,
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