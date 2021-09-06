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
            <el-form-item label="问卷主键" prop="wjid"
                :rules="[
                 ]">
              <el-input v-model="inputForm.wjid" placeholder="请填写问卷主键"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="问题主键" prop="wtid"
                :rules="[
                 ]">
              <el-input v-model="inputForm.wtid" placeholder="请填写问题主键"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="答案序号" prop="daxh"
                :rules="[
                 ]">
              <el-input v-model="inputForm.daxh" placeholder="请填写答案序号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="答案描述" prop="dams"
                :rules="[
                 ]">
              <el-input v-model="inputForm.dams" placeholder="请填写答案描述"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="答案分数" prop="dafs"
                :rules="[
                 ]">
              <el-input v-model="inputForm.dafs" placeholder="请填写答案分数"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="创建单位编码" prop="createByOrg"
                :rules="[
                 ]">
              <el-input v-model="inputForm.createByOrg" placeholder="请填写创建单位编码"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="更新单位编码" prop="updateByOrg"
                :rules="[
                 ]">
              <el-input v-model="inputForm.updateByOrg" placeholder="请填写更新单位编码"     ></el-input>
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
          wtid: '',
          daxh: '',
          dams: '',
          dafs: '',
          createByOrg: '',
          updateByOrg: ''
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
          this.title = `新建问卷答案`
        } else if (method === 'edit') {
          this.title = '修改问卷答案'
        } else if (method === 'view') {
          this.title = '查看问卷答案'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xcwjglwjtxx/wjglWjwtda/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.wjglWjwtda)
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
              url: `/xcwjglwjtxx/wjglWjwtda/save`,
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
