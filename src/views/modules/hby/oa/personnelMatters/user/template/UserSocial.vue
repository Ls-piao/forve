<template>
  <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" :class="method==='view'?'readonly':''"
      :disabled="method==='view'" @keyup.enter.native="doSubmit()" label-width="120px">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="关系" prop="socialType" :rules="[]">
            <el-select v-model="inputForm.socialType" placeholder="请选择">
              <el-option v-for="item in $dictUtils.getDictList('RSGL_socialType')" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="紧急联络人" prop="emergencyFlag" :rules="[]">
            <el-checkbox v-model="emergencyFlag" true-label="true" false-label="false"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关系人姓名" prop="socialName" :rules="[]">
            <el-input v-model="inputForm.socialName" maxlength="10" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关系人工作地址" prop="workAddress" :rules="[]">
            <el-input v-model="inputForm.workAddress" maxlength="10" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关系人住址" prop="homeAddress" :rules="[]">
            <el-input v-model="inputForm.homeAddress" maxlength="10" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关系人联系电话" prop="socialPhone" :rules="[]">
            <el-input v-model="inputForm.socialPhone" maxlength="10" placeholder=""></el-input>
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
        emergencyFlag: false,
        inputForm: {
          socialType: '',
          emergencyFlag: '',
          socialName: '',
          workAddress: '',
          homeAddress: '',
          socialPhone: ''
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
            this.emergencyFlag = (obj.emergencyFlag === 'E')
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.inputForm.emergencyFlag = this.emergencyFlag === 'true' ? 'E' : ''
            this.$emit('addRow', this.oldInputForm, JSON.parse(JSON.stringify(this.inputForm)))
            this.visible = false
          }
        })
      },
      continueDoSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.inputForm.emergencyFlag = this.emergencyFlag === 'true' ? 'E' : ''
            this.$emit('addRow', this.oldInputForm, JSON.parse(JSON.stringify(this.inputForm)))
            this.$refs['inputForm'].resetFields()
          }
        })
      }
    }
  }
</script>
