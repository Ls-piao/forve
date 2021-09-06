<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    v-dialogDrag
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="24">
            <el-form-item label="标题" prop="bt"
                :rules="[
                  {required: true, message:'标题不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.bt" placeholder="请填写标题"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="内容" prop="nr"
                :rules="[
                  {required: true, message:'内容不能为空', trigger:'blur'}
                 ]">
              <el-input  type="textarea" v-model="inputForm.nr" placeholder="请填写内容"     ></el-input>
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
          bt: '',
          nr: '',
          xmId: {
            id: '',
            xmmc: ''
          },
          fqr: {
            id: '',
            name: ''
          },
          fqsj: ''
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
          this.title = `新建问题信息`
        } else if (method === 'edit') {
          this.title = '修改问题信息'
        } else if (method === 'view') {
          this.title = '查看问题信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xmgl/wtxx/wtxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.wtxx)
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
              url: `/xmgl/wtxx/wtxx/save`,
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