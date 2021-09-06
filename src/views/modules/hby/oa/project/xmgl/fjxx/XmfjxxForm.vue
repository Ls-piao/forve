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
            <el-form-item label="附件名" prop="name"
                :rules="[
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写附件名"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="附件地址" prop="path"
                :rules="[
                 ]">
              <el-input v-model="inputForm.path" placeholder="请填写附件地址"     ></el-input>
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
          name: '',
          path: ''
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
          this.title = `新建附件信息`
        } else if (method === 'edit') {
          this.title = '修改附件信息'
        } else if (method === 'view') {
          this.title = '查看附件信息'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xmgl/fjxx/xmfjxx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.xmfjxx)
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit (callback) {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/xmgl/fjxx/xmfjxx/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              if (data && data.success) {
                callback(data.businessTable, data.businessId)
              }
            })
          }
        })
      }
    }
  }
</script>