<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" :class="method==='view'?'readonly':''"  :disabled="method==='view'" @keyup.enter.native="doSubmit()"
             label-width="120px">
      <el-row  :gutter="15">
<!--        <el-col :span="12">
            <el-form-item label="采购ID" prop="cg.id"
                :rules="[
                 ]">
              <el-input v-model="inputForm.cg.id" placeholder="请填写采购ID"     ></el-input>
           </el-form-item>
        </el-col>-->
        <el-col :span="12">
            <el-form-item label="资产名称" prop="zcmc"
                :rules="[
                   {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.zcmc" placeholder="请填写资产名称"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="资产型号" prop="zcxh"
                :rules="[
                   {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.zcxh" placeholder="请填写资产型号"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="资产规格" prop="zcgg"
                :rules="[
                   {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.zcgg" placeholder="请填写资产规格"     ></el-input>
           </el-form-item>
        </el-col>
<!--        <el-col :span="12">
            <el-form-item label="申购数量" prop="sgNum"
                :rules="[
                 ]">
              <el-input v-model="inputForm.sgNum" placeholder="请填写申购数量"     ></el-input>
           </el-form-item>
        </el-col>-->
        <el-col :span="12">
            <el-form-item label="采购数量" prop="cgNum"
                :rules="[
                   {required: true, message:'不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.cgNum" placeholder="请填写采购数量"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="单价" prop="dj"
                :rules="[
                  {validator: validator.isFloatGtZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.dj" placeholder="请填写单价"     ></el-input>
           </el-form-item>
        </el-col>
<!--        <el-col :span="12">
            <el-form-item label="金额" prop="money"
                :rules="[
                  {validator: validator.isFloatGtZero, trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.money" placeholder="请填写金额"     ></el-input>
           </el-form-item>
        </el-col>-->
        <el-col :span="12">
            <el-form-item label="供应商" prop="gys.id"
                :rules="[
                   {required: true, message:'不能为空', trigger:'blur'}
                 ]">
          <GridSelect
            title="选择供应商ID"
            labelName = 'name'
            labelValue = 'id'
            :value = "inputForm.gys.id"
            :limit="1"
            @getValue='(value) => {inputForm.gys.id=value}'
            :columns="[
            {
              prop: 'id',
              label: '主键'
            },
            {
              prop: 'name',
              label: '供应商全称'
            }
            ]"
            :searchs="[
            {
              prop: 'id',
              label: '主键'
            },
            {
              prop: 'name',
              label: '供应商全称'
            }
            ]"
            dataListUrl="/gysgl/supplier/list"
            entityBeanName="supplier"
            queryEntityUrl="/gysgl/supplier/queryById">
          </GridSelect>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="供货日期" prop="ghDate"
                :rules="[
                   {required: true, message:'不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      v-model="inputForm.ghDate"
                      type="datetime"
                      style="width: 100%;"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
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
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        oldInputForm: '',
        inputForm: {
          id: '',
/*          cg: {
            id: ''
          }, */
          zcmc: '',
          zcxh: '',
          zcgg: '',
          sgNum: '',
          cgNum: '',
          dj: '',
          gys: {
            id: ''
          },
          ghDate: '',
          remarks: ''
        }
      }
    },
    components: {
      GridSelect
    },
    methods: {
      init (method, obj) {
        this.method = method
        if (method === 'add') {
          this.title = `新建采购明细表`
        } else if (method === 'edit') {
          this.title = '修改采购明细表'
        } else if (method === 'view') {
          this.title = '查看采购明细表'
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = ''
          this.oldInputForm = ''
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.oldInputForm = obj
            this.inputForm = JSON.parse(JSON.stringify(obj))
            console.log(this.inputForm + '-------------')
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
