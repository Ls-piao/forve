<template>
<div>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    append-to-body="true"
    :visible.sync="visible">
    <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="12">
            <el-form-item label="被共享人" prop="bgxrList"
                :rules="[
                  {required: true, message:'被共享人不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.bgxrList" style="width:100%" multiple filterable placeholder="请选择">
                <el-option
                  v-for="user in userList"
                  :key="user.id"
                  :label="user.name"
                  :value="user.id">
                </el-option>
              </el-select>
           </el-form-item>
        </el-col>
<!--        <el-col :span="12">
            <el-form-item label="共享时间" prop="gxsj"
                :rules="[
                  {required: true, message:'共享时间不能为空', trigger:'blur'}
                 ]">
                <el-date-picker
                      style="width: 100%;"
                      v-model="inputForm.gxsj"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
           </el-form-item>
        </el-col>-->
        <el-col :span="12">
            <el-form-item label="共享级别" prop="gxjb"
                :rules="[
                  {required: true, message:'共享级别不能为空', trigger:'blur'}
                 ]">
              <el-select v-model="inputForm.gxjb" placeholder="请选择"  style="width: 100%;">
                <el-option
                  v-for="item in this.$dictUtils.getDictList('RCGL_GXJB')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
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
        userList: [],
        inputForm: {
          id: '',
          bgxrList: [],
          gxsj: '',
          gxjb: '',
          remarks: '',
          rcId: ''
        }
      }
    },
    components: {
    },
    methods: {
      init (method, id, rcId) {
        this.method = method
        this.inputForm.rcId = rcId
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建日程共享`
        } else if (method === 'edit') {
          this.title = '修改日程共享'
        } else if (method === 'view') {
          this.title = '查看日程共享'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$http({
            url: `/sys/user/list?pageNo=1&pageSize=-1`,
            method: 'get'
          }).then(({data}) => {
            this.userList = data.page.list
          })
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            this.$http({
              url: `/rcgx/rcgx/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.rcgx)
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
              url: `/rcgx/rcgx/save`,
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
