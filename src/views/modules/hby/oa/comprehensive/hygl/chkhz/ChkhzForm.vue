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
            <el-form-item label="客户姓名" prop="name"
                :rules="[{required: true, message:'客户姓名不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.name" placeholder="请填写客户姓名"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="单位名称" prop="dwmc"
                :rules="[{required: true, message:'单位名称不能为空', trigger:'blur'}]">
                <el-input v-model="inputForm.dwmc" placeholder="请填写单位名称"></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="sjhm"
                :rules="[{required: true, message:'手机号码不能为空', trigger:'blur'}]">
            <el-input v-model="inputForm.sjhm" placeholder="请填写手机号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电子邮箱" prop="dzyx"
                :rules="[{required: true, message:'电子邮箱不能为空', trigger:'blur'}]">
            <el-input v-model="inputForm.dzyx" placeholder="请填写电子邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息" prop="remarks" :rules="[]">
            <el-input type="textarea" v-model="inputForm.remarks" placeholder="请填写备注信息"></el-input>
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
          name: '',
          flid: '',
          dwmc: '',
          sjhm: '',
          dzyx: '',
          remarks: ''
        }
      }
    },
    components: {
      UserSelect
    },
    methods: {
      init (method, id, flid) {
        this.method = method
        this.inputForm.id = id
        this.inputForm.flid = flid
        if (method === 'add') {
          this.title = `新建客户组信息`
        } else if (method === 'edit') {
          this.title = '修改客户组信息'
        } else if (method === 'view') {
          this.title = '查看客户组信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/hygl/chkhz/chkhz/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.chkhz)
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
              url: `/hygl/chkhz/chkhz/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.visible = false
                this.$message.success(data.msg)
                this.$emit('refreshList')
              }
            })
          }
        })
      }
    }
  }
</script>
