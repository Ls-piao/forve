<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" :class="method==='view'?'readonly':''"  :disabled="method==='view'" @keyup.enter.native="doSubmit()"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="申购ID" prop="sgjh.id"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sgjh.id" placeholder="请填写申购ID"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="资产名称" prop="zcmc"
                :rules="[
                 ]">
              <el-input v-model="inputForm.zcmc" placeholder="请填写资产名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="资产型号" prop="zcxh"
                :rules="[
                 ]">
              <el-input v-model="inputForm.zcxh" placeholder="请填写资产型号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="资产规格" prop="zcgg"
                :rules="[
                 ]">
              <el-input v-model="inputForm.zcgg" placeholder="请填写资产规格"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="申请数量" prop="sqsl"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sqsl" placeholder="请填写申请数量"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="金额(元)" prop="money"
                :rules="[
                 ]">
              <el-input v-model="inputForm.money" placeholder="请填写金额(元)"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="备注信息" prop="remarks"
                :rules="[
                 ]">
          <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"     ></el-input>
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
          sgjh: {
            id: ''
          },
          zcmc: '',
          zcxh: '',
          zcgg: '',
          sqsl: '',
          money: '',
          remarks: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, obj) {
        this.method = method
        if (method === 'add') {
          this.title = `新建申购计划明细表`
        } else if (method === 'edit') {
          this.title = '修改申购计划明细表'
        } else if (method === 'view') {
          this.title = '查看申购计划明细表'
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
