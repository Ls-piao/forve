<template>
  <el-dialog :title="title" :close-on-click-modal="false" v-dialogDrag :visible.sync="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" :class="method==='view'?'readonly':''"
      :disabled="method==='view'" @keyup.enter.native="doSubmit()" label-width="120px">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item label="技能类别" prop="techType" :rules="[]">
            <el-input v-model="inputForm.techType" maxlength="10" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="技能名称" prop="techTitle" :rules="[]">
            <el-input v-model="inputForm.techTitle" maxlength="10" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="技能描述" prop="techDetail" :rules="[]">
            <el-input type="textarea" v-model="inputForm.techDetail" placeholder="请填写备注信息"></el-input>
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
          techType: '',
          techTitle: '',
          techDetail: ''
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
