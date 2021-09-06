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
        <el-col :span="24">
            <el-form-item label="所属项目" prop="xmId.id"
                :rules="[
                  {required: true, message:'所属项目不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.xmId.id" style="width:100%" filterable placeholder="所属项目">
              <el-option
                v-for="xm in xmList"
                :key="xm.id"
                :label="xm.xmmc"
                :value="xm.id">
              </el-option>
            </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="收支类型" prop="szlx"
                :rules="[
                {required: true, message:'收支类型不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.szlx" placeholder="收支类型"  style="width: 100%;">
              <el-option
                v-for="item in this.$dictUtils.getDictList('XMSZ_TYPE')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="明细" prop="mx"
                :rules="[
                {required: true, message:'明细不能为空', trigger:'blur'}
                 ]">
              <el-input type="textarea" v-model="inputForm.mx" placeholder="请填写明细"     ></el-input>
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="金额（元）" prop="je"
                :rules="[
                {required: true, message:'金额数值不能为空', trigger:'blur'}
                 ]">
              <el-input type="number" v-model="inputForm.je" placeholder="请填写金额数值"     ></el-input>
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
        xmList: [],
        inputForm: {
          id: '',
          xmId: {
            id: '',
            name: ''
          },
          szlx: '',
          je: '',
          mx: ''
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
          this.title = `新建收支明细`
        } else if (method === 'edit') {
          this.title = '修改收支明细'
        } else if (method === 'view') {
          this.title = '查看收支明细'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          this.$http({
            url: `/xmgl/xmxx/xmjbxx/list?xmzt=4&pageNo=1&pageSize=-1`,
            method: 'get'
          }).then(({data}) => {
            this.xmList = data.page.list
          })
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/xmgl/szmx/szmx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.szmx)
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
              url: `/xmgl/szmx/szmx/save`,
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
