<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" :class="method==='view'?'readonly':''"  :disabled="method==='view'" @keyup.enter.native="doSubmit()"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="费用内容" prop="costContent"
                :rules="[
                 ]">
              <el-input v-model="inputForm.costContent" placeholder="请填写费用内容"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="费用类别" prop="costType"
                :rules="[
                 ]">
                <el-select v-model="inputForm.costType" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('fkgl_fylb')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="单据总数" prop="totalNumber"
                :rules="[
                  {validator: validator.isIntGteZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.totalNumber" placeholder="请填写单据总数"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="金额(元)" prop="amount"
                :rules="[
                  {validator: validator.isNumber, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.amount" placeholder="请填写金额(元)"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="税率" prop="taxRate"
                :rules="[
                 ]">
              <el-input v-model="inputForm.taxRate" placeholder="请填写税率"     ></el-input>
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
          costContent: '',
          costType: '',
          totalNumber: '',
          amount: '',
          taxRate: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, obj) {
        this.method = method
        if (method === 'add') {
          this.title = `新建办公系统费控管理报销-日常及采购报销内容`
        } else if (method === 'edit') {
          this.title = '修改办公系统费控管理报销-日常及采购报销内容'
        } else if (method === 'view') {
          this.title = '查看办公系统费控管理报销-日常及采购报销内容'
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