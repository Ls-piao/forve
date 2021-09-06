<template>
  <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" :class="method==='view'?'readonly':''"
      :disabled="method==='view'" @keyup.enter.native="doSubmit()" label-width="120px">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="起止时间" prop="eduDatePicker">
            <el-date-picker v-model="eduDatePicker" type="monthrange"
              value-format="yyyy-MM"
              range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学校" prop="eduSchool" :rules="[]">
            <el-input v-model="inputForm.eduSchool" maxlength="10" placeholder="填写学校"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="专业" prop="eduMajor" :rules="[]">
            <el-input v-model="inputForm.eduMajor" maxlength="10" placeholder="填写专业"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="学历" prop="eduRecord" :rules="[]">
            <el-select v-model="inputForm.eduRecord" placeholder="请选择专业">
              <el-option v-for="item in $dictUtils.getDictList('RSGL_eduRecord')" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="学位" prop="eduLevel" :rules="[]">
            <el-select v-model="inputForm.eduLevel" placeholder="请选择学位">
              <el-option v-for="item in $dictUtils.getDictList('RSGL_eduLevel')" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="eduRemark" :rules="[]">
            <el-input type="textarea" v-model="inputForm.eduRemark" placeholder="请填写备注信息"></el-input>
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
      // 验证时间控件
      // const validatorDatePicker = (rule, value, callback) => {
      //   console.log(value)
      //   if (value.length < 2) {

      //   }
      //   return callback()
      // }
      return {
        title: '',
        method: '',
        visible: false,
        oldInputForm: '',
        eduDatePicker: [],
        inputForm: {
          eduFrom: '',
          eduTo: '',
          eduSchool: '',
          eduMajor: '',
          eduRecord: '',
          eduLevel: '',
          eduRemark: ''
        }
      }
    },
    methods: {
      init (method, obj) {
        this.method = method
        if (method === 'add') {
          this.title = '新增联系方式'
        } else if (method === 'edit') {
          this.title = '修改联系方式'
        } else if (method === 'view') {
          this.title = '查看联系方式'
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.inputForm.id = ''
          this.oldInputForm = ''
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.oldInputForm = obj
            this.inputForm = JSON.parse(JSON.stringify(obj))
            this.eduDatePicker[0] = obj.eduFrom
            this.eduDatePicker[1] = obj.eduTo
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.inputForm.eduFrom = this.eduDatePicker[0]
            this.inputForm.eduTo = this.eduDatePicker[1]
            this.$emit('addRow', this.oldInputForm, JSON.parse(JSON.stringify(this.inputForm)))
            this.visible = false
          }
        })
      },
      continueDoSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.inputForm.eduFrom = this.eduDatePicker[0]
            this.inputForm.eduTo = this.eduDatePicker[1]
            this.$emit('addRow', this.oldInputForm, JSON.parse(JSON.stringify(this.inputForm)))
            this.$refs['inputForm'].resetFields()
          }
        })
      }
    }
  }
</script>
