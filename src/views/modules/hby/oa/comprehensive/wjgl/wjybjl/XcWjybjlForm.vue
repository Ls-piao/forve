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
            <el-form-item label="问卷id" prop="wjid"
                :rules="[
                 ]">
              <el-input v-model="inputForm.wjid" placeholder="请填写问卷id"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="姓名id" prop="xmid"
                :rules="[
                 ]">
              <el-input v-model="inputForm.xmid" placeholder="请填写姓名id"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="姓名" prop="xm"
                :rules="[
                 ]">
              <el-input v-model="inputForm.xm" placeholder="请填写姓名"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="单选总分" prop="dxzf"
                :rules="[
                 ]">
              <el-input v-model="inputForm.dxzf" placeholder="请填写单选总分"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="多选总分" prop="dxxzf"
                :rules="[
                 ]">
              <el-input v-model="inputForm.dxxzf" placeholder="请填写多选总分"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="实际得分" prop="sjdf"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sjdf" placeholder="请填写实际得分"     ></el-input>
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
          wjid: '',
          xmid: '',
          xm: '',
          dxzf: '',
          dxxzf: '',
          sjdf: ''
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
          this.title = `新建问卷样本记录`
        } else if (method === 'edit') {
          this.title = '修改问卷样本记录'
        } else if (method === 'view') {
          this.title = '查看问卷样本记录'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/wjybjl/xcWjybjl/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xcWjybjl)
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
              url: `/wjybjl/xcWjybjl/save`,
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