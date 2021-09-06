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
        <el-col :span="12">
            <el-form-item label="任务名称" prop="rwmc"
                :rules="[
                  {required: true, message:'任务名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.rwmc" placeholder="请填写任务名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="任务代码" prop="rwdm"
                :rules="[
                  {required: true, message:'任务代码不能为空', trigger:'blur'}
                 ]">
              <el-input type="number" v-model="inputForm.rwdm" placeholder="请填写任务代码"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="层次" prop="cc"
                :rules="[
                  {required: true, message:'层次不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.cc" placeholder="请填写层次"     ></el-input>
           </el-form-item>
        </el-col>
        
        <el-col :span="12">
            <el-form-item label="责任人" prop="zrr.id"
                :rules="[
                  {required: true, message:'责任人不能为空', trigger:'blur'}
                 ]">
                <user-select :readonly="true" :limit='1' :value="inputForm.zrr.id" @getValue='(value) => {inputForm.zrr.id=value}'></user-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="是否关键路径" prop="sfGjlj"
                :rules="[
                  {required: true, message:'是否关键路径不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.sfGjlj" placeholder="是否关键路径"  style="width: 100%;">
                <el-option
                  v-for="item in this.$dictUtils.getDictList('yes_no')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="是否里程碑" prop="sfLcb"
                :rules="[
                  {required: true, message:'是否里程碑不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.sfLcb" placeholder="是否里程碑"  style="width: 100%;">
                <el-option
                  v-for="item in this.$dictUtils.getDictList('yes_no')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
           </el-form-item>
        </el-col>
        
        <el-col :span="12">
            <el-form-item label="计划开始日期" prop="jhKsrq"
                :rules="[
                  {required: true, message:'计划开始日期不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.jhKsrq"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="计划完成日期" prop="jhWcrq"
                :rules="[
                  {required: true, message:'计划完成日期不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.jhWcrq"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="工期" prop="gq"
                :rules="[
                  {required: true, message:'工期不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.gq" placeholder="请填写工期"     ></el-input>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
            <el-form-item label="目标，产出物" prop="mb"
                :rules="[
                 ]">
              <el-input  type="textarea" v-model="inputForm.mb" placeholder="请填写目标，产出物"     ></el-input>
           </el-form-item>
        </el-col>  -->
         <el-col :span="24">
            <el-form-item label="备注" prop="bz"
                :rules="[
                 ]">
              <el-input  type="textarea" v-model="inputForm.bz" placeholder="请填写备注"     ></el-input>
           </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="实际开始日期" prop="sjKsrq"
                :rules="[
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.sjKsrq"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="实际完成日期" prop="sjWcrq"
                :rules="[
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.sjWcrq"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="实际工期" prop="sjgq"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sjgq" placeholder="请填写实际工期"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="目标，产出物" prop="mb"
                :rules="[
                  {required: true, message:'目标，产出物不能为空', trigger:'blur'}
                 ]">
              <el-input  type="textarea" v-model="inputForm.mb" placeholder="请填写目标，产出物"     ></el-input>
           </el-form-item>
        </el-col> -->

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
          bz: '',
          zt: '',
          rwjd: '',
          sjgq: '',
          sjKsrq: '',
          sjWcrq: '',
          bbh: '',
          sort: '',
          xmId: {
            id: '',
            xmmc: ''
          }
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
          this.title = `新建项目任务信息`
        } else if (method === 'edit') {
          this.title = '修改项目任务信息'
        } else if (method === 'view') {
          this.title = '查看项目任务信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xmgl/lsb/rwxxLsb/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xwRwxx)
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
              url: `/xmgl/lsb/rwxxLsb/save`,
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