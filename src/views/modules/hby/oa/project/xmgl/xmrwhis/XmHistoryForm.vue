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
            <el-form-item label="项目ID" prop="xmId"
                :rules="[
                 ]">
              <el-input v-model="inputForm.xmId" placeholder="请填写项目ID"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="任务名称" prop="rwmc"
                :rules="[
                 ]">
              <el-input v-model="inputForm.rwmc" placeholder="请填写任务名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="层次" prop="cc"
                :rules="[
                 ]">
              <el-input v-model="inputForm.cc" placeholder="请填写层次"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="任务代码" prop="rwdm"
                :rules="[
                 ]">
              <el-input v-model="inputForm.rwdm" placeholder="请填写任务代码"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="责任人" prop="zrr.id"
                :rules="[
                 ]">
                <user-select :limit='1' :value="inputForm.zrr.id" @getValue='(value) => {inputForm.zrr.id=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="是否关键路径" prop="sfGjlj"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sfGjlj" placeholder="请填写是否关键路径"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="是否里程碑" prop="sfLcb"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sfLcb" placeholder="请填写是否里程碑"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="工期" prop="gq"
                :rules="[
                 ]">
              <el-input v-model="inputForm.gq" placeholder="请填写工期"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="计划开始日期" prop="jhKsrq"
                :rules="[
                 ]">
              <el-input v-model="inputForm.jhKsrq" placeholder="请填写计划开始日期"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="计划完成日期" prop="jhWcrq"
                :rules="[
                 ]">
              <el-input v-model="inputForm.jhWcrq" placeholder="请填写计划完成日期"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="目标，产出物" prop="mb"
                :rules="[
                 ]">
              <el-input v-model="inputForm.mb" placeholder="请填写目标，产出物"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="标记状态" prop="zt"
                :rules="[
                 ]">
              <el-input v-model="inputForm.zt" placeholder="请填写标记状态"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="任务阶段" prop="rwjd"
                :rules="[
                 ]">
              <el-input v-model="inputForm.rwjd" placeholder="请填写任务阶段"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="实际工期" prop="sjgq"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sjgq" placeholder="请填写实际工期"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="实际开始日期" prop="sjKsrq"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sjKsrq" placeholder="请填写实际开始日期"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="实际完成日期" prop="sjWcrq"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sjWcrq" placeholder="请填写实际完成日期"     ></el-input>
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
  import UserSelect from '@/components/userSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        inputForm: {
          id: '',
          xmId: '',
          rwmc: '',
          cc: '',
          rwdm: '',
          zrr: {
            id: ''
          },
          sfGjlj: '',
          sfLcb: '',
          gq: '',
          jhKsrq: '',
          jhWcrq: '',
          mb: '',
          zt: '',
          rwjd: '',
          sjgq: '',
          sjKsrq: '',
          sjWcrq: ''
        }
      }
    },
    components: {
      UserSelect
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建任务历史`
        } else if (method === 'edit') {
          this.title = '修改任务历史'
        } else if (method === 'view') {
          this.title = '查看任务历史'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xmgl/xmrwhis/xmHistory/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xmHistory)
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
              url: `/xmgl/xmrwhis/xmHistory/save`,
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